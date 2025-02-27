// src/metadata_scaffolder.ts
import { parseSchema } from "./schema_parser.ts";
import { logVerbose, fileExists } from "./utils.ts";
import * as path from "https://deno.land/std@0.208.0/path/mod.ts";
import { ensureDir } from "https://deno.land/std@0.208.0/fs/ensure_dir.ts";
import { Metadata } from "./types.ts";

export async function scaffoldMetadata(schemaPath: string, outputPath: string, merge: boolean | undefined, verbose: boolean | undefined, stitchedSqlOutput:string, schemaJsonOutput: string) {
    const outputDir = path.dirname(outputPath);
    const schema = await parseSchema(schemaPath, outputDir, verbose, stitchedSqlOutput, schemaJsonOutput);

    const internalMetadataPath = path.join(outputDir, '_internal_metadata.json');
    const absoluteInternalMetadataPath = path.resolve(Deno.cwd(), internalMetadataPath); // Absolute path


    if (!(await fileExists(absoluteInternalMetadataPath))) {
        console.error(`Error: Internal metadata file not found: ${absoluteInternalMetadataPath}`);
        console.error("Please run the 'generate' command first to create the internal metadata.");
        Deno.exit(1);
    }
    const internalMetadataText = Deno.readTextFileSync(absoluteInternalMetadataPath);
    const internalMetadata = JSON.parse(internalMetadataText);

    if (merge) {
        const absoluteOutputPath = path.resolve(Deno.cwd(), outputPath); // Absolute path
        if (await fileExists(absoluteOutputPath)) {
          let existingMetadata: Metadata = {};
	  const existingText = Deno.readTextFileSync(absoluteOutputPath);

	  try {
            existingMetadata = JSON.parse(existingText);
          } catch(e) {
            const metadataFn = new Function(`return (${existingText});`);
            existingMetadata = metadataFn();
          }

	  const mergedMetadata = mergeMetadata(existingMetadata, internalMetadata);
          await writeMetadata(absoluteOutputPath, mergedMetadata, verbose);

        } else {
            console.warn(`Merge requested, but metadata file does not exist: ${absoluteOutputPath}.  Creating new file.`);
            await writeMetadata(absoluteOutputPath, internalMetadata, verbose);
        }

    } else {
        const absoluteOutputPath = path.resolve(Deno.cwd(), outputPath); // Absolute path
        if(await fileExists(absoluteOutputPath)) {
            console.warn(`Metadata file exists and --merge is set to false.  Overwriting file.`)
        }
        await writeMetadata(absoluteOutputPath, internalMetadata, verbose);
    }
}


function mergeMetadata(existing: Metadata, generated: Metadata): Metadata {
    const merged: Metadata = structuredClone(existing); // Deep copy

    for (const tableName in generated) {
        if (!merged[tableName]) {
            merged[tableName] = generated[tableName]; // Add new table
        } else {
            // Merge columns
            if (generated[tableName].columns) {
                if (!merged[tableName].columns) {
                  merged[tableName].columns = {};
                }
                for (const columnName in generated[tableName].columns) {
                    if (!merged[tableName].columns![columnName]) {
		  // @ts-ignore
                        merged[tableName].columns![columnName] = generated[tableName].columns[columnName]; // Add new column
                    }
                }
            }

            // Merge indexes
            if(generated[tableName].indexes) {
              if(!merged[tableName].indexes) {
                merged[tableName].indexes = {};
              }
              for(const indexName in generated[tableName].indexes) {
                if(!merged[tableName].indexes![indexName]) {
		  // @ts-ignore
                  merged[tableName].indexes![indexName] = generated[tableName].indexes[indexName]; // Add new index
                }
              }
            }

            // Merge table metadata (prefer existing)
            merged[tableName].tableMeta = { ...generated[tableName].tableMeta, ...(merged[tableName].tableMeta || {}) };
        }
    }

    // Check for structural differences (beyond added/removed entities)
    for (const tableName in merged) {
      if(generated[tableName]) {
        if (merged[tableName].columns && generated[tableName].columns) {
            for(const columnName in merged[tableName].columns!) {
              if(generated[tableName].columns![columnName]) {
                for(const key in merged[tableName].columns![columnName]) {
                  if (typeof merged[tableName].columns![columnName][key] !== typeof generated[tableName].columns![columnName][key]) {
                        console.warn(`Warning: Type mismatch for ${tableName}.${columnName}.${key} during merge.  Using existing value.`);
                    }
                }
              }
            }
        }
      }
    }
    return merged;
}


async function writeMetadata(outputPath: string, metadata: Metadata, verbose: boolean | undefined) {
    await ensureDir(path.dirname(outputPath));
    if(outputPath.endsWith('.json')) {
      await Deno.writeTextFile(outputPath, `${JSON.stringify(metadata, null, 2)}`);
    } else {
      await Deno.writeTextFile(outputPath, `export default ${JSON.stringify(metadata, null, 2)};`);
    }
    logVerbose(`Metadata file written to: ${outputPath}`, verbose);
}
