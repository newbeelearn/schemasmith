// src/file_generator.ts
import { logVerbose } from "./utils.ts";
import * as path from "https://deno.land/std@0.208.0/path/mod.ts";
import { ensureDir } from "https://deno.land/std@0.208.0/fs/ensure_dir.ts";
import { existsSync } from "https://deno.land/std@0.208.0/fs/exists.ts";


export async function generateFiles(outputDir: string, files: Record<string, string>, overwriteExisting: boolean, skipExisting: boolean, verbose: boolean | undefined): Promise<void> {
    await ensureDir(outputDir);

    for (const [filename, content] of Object.entries(files)) {
        const outputPath = path.join(outputDir, filename);
        logVerbose(`outputPath is ${outputPath}`, verbose)
        if (existsSync(outputPath)) {
            if (skipExisting) {
                logVerbose(`Skipping existing file: ${outputPath}`, verbose);
                continue;
            }
            if (!overwriteExisting) {
                console.error(`Error: File already exists: ${outputPath}. Use --overwrite to overwrite.`);
                Deno.exit(1);
            }
            logVerbose(`Overwriting existing file: ${outputPath}`, verbose);
        }
        await Deno.writeTextFile(outputPath, content);
        logVerbose(`Generated file: ${outputPath}`, verbose);
    }
}
