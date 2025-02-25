// src/template_engine.ts
import { Schema, Metadata } from "./types.ts";
import * as path from "https://deno.land/std@0.208.0/path/mod.ts";
import { logVerbose } from "./utils.ts";

export async function processTemplates(templateDir: string, schema: Schema, metadata: Metadata, verbose: boolean | undefined): Promise<Record<string, string>> {
    const results: Record<string, string> = {};
    const absoluteTemplateDir = path.resolve(Deno.cwd(), templateDir); // Get absolute path

    for await (const entry of Deno.readDir(absoluteTemplateDir)) {
        if (entry.isFile && entry.name.endsWith('.template.ts')) {
            const templatePath = path.join(absoluteTemplateDir, entry.name); // Already absolute
            logVerbose(`Processing template: ${templatePath}`, verbose);
            const { generate } = await import(path.toFileUrl(templatePath).href);

            if (typeof generate !== 'function') {
                console.error(`Error: Template ${templatePath} does not export a 'generate' function.`);
                Deno.exit(1);
            }

            try {
                const output = generate(schema, metadata);
                if (typeof output !== 'string') {
                  console.error(`Error generate function from template: ${templatePath} did not return a string`);
                  Deno.exit(1);
                }
                results[entry.name.replace('.template.ts', '.ts')] = output;

            } catch (error) {
                console.error(`Error running 'generate' function in template ${templatePath}:`, error);
                Deno.exit(1);
            }
        }
    }

    return results;
}
