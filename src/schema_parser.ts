// src/schema_parser.ts
import { DB } from "https://deno.land/x/sqlite@v3.8/mod.ts";
import * as path from "https://deno.land/std@0.208.0/path/mod.ts";
import { Schema, ColumnSchema, IndexSchema, ConstraintSchema } from "./types.ts";
import { logVerbose, fileExists, getSqliteFilename } from "./utils.ts";
import { ensureDir } from "https://deno.land/std@0.208.0/fs/ensure_dir.ts";
import { copy } from "https://deno.land/std@0.208.0/fs/copy.ts";

const SCHEMA_VERSION = "1.0.0";

export async function parseSchema(schemaPath: string, outputDir: string, verbose: boolean | undefined, stitchedSqlOutput: string = '_stitched_schema.sql', schemaJsonOutput: string = '_schema.json'): Promise<Schema> {
  const isDir = (await Deno.stat(schemaPath)).isDirectory;
  let db: DB;
  let stitchedSql = `-- codegen schema version: ${SCHEMA_VERSION}\n`;

  if (isDir) {
    logVerbose(`Parsing schema from migration directory: ${schemaPath}`, verbose);
    const migrationFiles = Array.from(Deno.readDirSync(schemaPath))
      .filter(entry => entry.isFile && entry.name.endsWith('.sql'))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));  // Numerical sort

    const tempDbPath = getSqliteFilename(schemaPath); // Use temporary file
    db = new DB(tempDbPath);

    try {
      for (const file of migrationFiles) {
        const filePath = path.join(schemaPath, file.name);
        const sql = await Deno.readTextFile(filePath);
        stitchedSql += sql + '\n';
        db.execute(sql);
      }
    } catch(error) {
      db.close();
      await Deno.remove(tempDbPath).catch(() => {});
      throw error;
    }


    // Write stitched SQL
    const stitchedOutputPath = path.join(outputDir, stitchedSqlOutput);
    await ensureDir(outputDir);
    await Deno.writeTextFile(stitchedOutputPath, stitchedSql);
    logVerbose(`Stitched SQL written to: ${stitchedOutputPath}`, verbose);

    // Switch to in-memory DB for introspection for safety
    const tempDb = new DB();
    db.backup(tempDb);
    db.close();
    await Deno.remove(tempDbPath); // Clean up temp file
    db = tempDb;
  } else {
    logVerbose(`Parsing schema from single SQL file: ${schemaPath}`, verbose);
    const sql = await Deno.readTextFile(schemaPath);
    db = new DB(":memory:"); // Use in-memory DB
    try {
      db.execute(sql);
    } catch (e) {
      db.close()
      throw e;
    }
  }

  const schema: Schema = {
    version: SCHEMA_VERSION,
    tables: {},
  };

  try {
    // Get table names
    const tables = db.query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");

    for (const [tableName] of tables) {
      // Get column info
      const columns: Record<string, ColumnSchema> = {};
      const columnInfo = db.queryEntries<ColumnSchema>(`PRAGMA table_info(${tableName});`);
      for (const col of columnInfo) {
        columns[col.name] = col;
      }

      // Get index info
      const indexes: Record<string, IndexSchema> = {};
      const indexList = db.queryEntries<{ seq: number, name: string, unique: number, origin: string, partial: number }>(`PRAGMA index_list(${tableName});`);

      for (const index of indexList) {
        const indexInfo = db.queryEntries<{ seqno: number, cid: number, name: string }>(`PRAGMA index_info(${index.name});`);
        const indexColumns = indexInfo.map(info => info.name);
        indexes[index.name] = {
          seq: index.seq,
          name: index.name,
          unique: index.unique,
          origin: index.origin,
          partial: index.partial,
          columns: indexColumns,
        };
      }

      // Get constraint info
      const constraints: Record<string, ConstraintSchema> = {};

      // Primary Key Constraint (from table_info)
      const primaryKeyColumns = columnInfo.filter(col => col.pk > 0).sort((a,b) => a.pk - b.pk).map(col => col.name);
      if (primaryKeyColumns.length > 0) {
        constraints['pk'] = {  // Use a consistent name like 'pk'
          type: 'PRIMARY KEY',
          columns: primaryKeyColumns,
          name: 'pk' //primary key contraint name
        };
      }

      // Foreign Key Constraints
      const foreignKeys = db.queryEntries<{ id: number, seq: number, table: string, from: string, to: string, on_update: string, on_delete: string, match: string }>(`PRAGMA foreign_key_list(${tableName});`);
      const fkConstraints: Record<number, ConstraintSchema> = {};

      for (const fk of foreignKeys) {
        if (!fkConstraints[fk.id]) {
          fkConstraints[fk.id] = {
            type: 'FOREIGN KEY',
            columns: [],
            references: { table: fk.table, columns: [] },
            name: `fk_${fk.id}` // Use a consistent naming convention
          };
        }
        fkConstraints[fk.id].columns!.push(fk.from);
        fkConstraints[fk.id].references!.columns.push(fk.to);
      }
      // Add foreign key constraints to the constraints object
      for (const [id, fkConstraint] of Object.entries(fkConstraints)) {
        constraints[fkConstraint.name!] = fkConstraint; // Use the generated name
      }

      // Unique Constraints (from index_list, where unique=1 and origin='u')
      for (const index of indexList) {
        if (index.unique === 1 && index.origin === 'u') {
          const indexInfo = db.queryEntries<{ seqno: number, cid: number, name: string }>(`PRAGMA index_info(${index.name});`);
          const indexColumns = indexInfo.map(info => info.name);
          constraints[index.name] = {
            type: 'UNIQUE',
            columns: indexColumns,
            name: index.name,
          };
        }
      }

      schema.tables[tableName] = {
        name: tableName,
        columns,
        indexes,
        constraints,
      };
    }
  } finally {
    db.close();
  }


  // Write schema JSON
  const schemaJsonOutputPath = path.join(outputDir, schemaJsonOutput);
  await ensureDir(outputDir);
  await Deno.writeTextFile(schemaJsonOutputPath, JSON.stringify(schema, null, 2));
  logVerbose(`Schema JSON written to: ${schemaJsonOutputPath}`, verbose);

  await generateInternalMetadata(schema, outputDir, verbose);

  return schema;
}


async function generateInternalMetadata(schema: Schema, outputDir: string, verbose: boolean | undefined) {
  const internalMetadata: any = {};

  for (const tableName in schema.tables) {
    internalMetadata[tableName] = {
      tableMeta: {
        displayName: tableName.charAt(0).toUpperCase() + tableName.slice(1), // Capitalize first letter
      },
      columns: {},
      indexes: {}, // Add indexes
      constraints: {}, // Add constraints
    };

    for (const columnName in schema.tables[tableName].columns) {
      internalMetadata[tableName].columns[columnName] = {
        label: columnName.charAt(0).toUpperCase() + columnName.slice(1), // Capitalize
        readOnly: false,
        expose: 'inout', // Default expose value
        // Add other default values as needed
      };
    }

    for (const indexName in schema.tables[tableName].indexes) {
      internalMetadata[tableName].indexes[indexName] = {
        unique: schema.tables[tableName].indexes[indexName].unique === 1, // Convert to boolean
        expose: false,
      };
    }

    for (const constraintName in schema.tables[tableName].constraints) {
      internalMetadata[tableName].constraints[constraintName] = schema.tables[tableName].constraints[constraintName];
    }
  }

  const outputPath = path.join(outputDir, '_internal_metadata.ts');
  await Deno.writeTextFile(outputPath, `// This file is auto-generated and should NOT be edited manually.\nexport default ${JSON.stringify(internalMetadata, null, 2)};`);
  logVerbose(`Internal metadata written to: ${outputPath}`, verbose);
}
