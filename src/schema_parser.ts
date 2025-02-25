// src/schema_parser.ts
import { DB } from "https://deno.land/x/sqlite@v3.8/mod.ts";
import * as path from "https://deno.land/std@0.208.0/path/mod.ts";
import { Schema, ColumnSchema, IndexSchema } from "./types.ts";
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

      schema.tables[tableName] = {
        name: tableName,
        columns,
        indexes,
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
  }

  const outputPath = path.join(outputDir, '_internal_metadata.ts');
  await Deno.writeTextFile(outputPath, `// This file is auto-generated and should NOT be edited manually.\nexport default ${JSON.stringify(internalMetadata, null, 2)};`);
  logVerbose(`Internal metadata written to: ${outputPath}`, verbose);
}
