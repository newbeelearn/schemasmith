// src/cli.ts
import { parseSchema } from "./schema_parser.ts";
import { processMetadata } from "./metadata_processor.ts";
import { processTemplates } from "./template_engine.ts";
import { generateFiles } from "./file_generator.ts";
import { scaffoldMetadata as scaffold } from "./metadata_scaffolder.ts";
import { logVerbose } from "./utils.ts";
import defaultConfig from "../codegen.config.ts";
import * as path from "https://deno.land/std@0.208.0/path/mod.ts";
import { CliOptions, Config } from "./types.ts";

async function loadConfig(configPath: string = "codegen.config.ts"): Promise<Config> {
    let config: Config;
    const absoluteConfigPath = path.resolve(Deno.cwd(), configPath); // Get absolute path

    try {
        const { default: userConfig } = await import(path.toFileUrl(absoluteConfigPath).href);
        config = { ...defaultConfig, ...userConfig };
    } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
            config = defaultConfig;
        } else {
             console.log(`Error loading config file: ${absoluteConfigPath}`, error)
            throw error;
        }
    }
    return config;
}

export async function generate(args: CliOptions): Promise<void> {
    const config = await loadConfig();

    const schemaPath = args.schema || config.schema.path;
    const metadataPath = args.metadata || config.metadata;
    const templatesPath = args.templates || config.templates;
    const outputPath = args.output || config.output;
    const verbose = args.verbose;
    const stitchedSqlOutput = args.stitchedSqlOutput || '_stitched_schema.sql';
    const schemaJsonOutput = args.schemaJsonOutput || '_schema.json';


    if (!schemaPath || !metadataPath || !templatesPath || !outputPath) {
        console.error("Error: Missing required arguments.  Please provide --schema, --metadata, --templates, and --output, or set them in codegen.config.ts.");
        Deno.exit(1);
    }

    logVerbose(`Schema path: ${schemaPath}`, verbose);
    logVerbose(`Metadata path: ${metadataPath}`, verbose);
    logVerbose(`Templates path: ${templatesPath}`, verbose);
    logVerbose(`Output path: ${outputPath}`, verbose);


    const schema = await parseSchema(schemaPath, outputPath, verbose, stitchedSqlOutput, schemaJsonOutput);

    if (args.dryRun) {
        console.log("Dry run complete.  Schema parsed successfully. No files written.");
        Deno.exit(0);
    }

    const metadata = await processMetadata(metadataPath, verbose);
    const generatedFiles = await processTemplates(templatesPath, schema, metadata, verbose);
    await generateFiles(outputPath, generatedFiles, config.options.overwriteExisting, config.options.skipExisting, verbose);
}

export async function scaffoldMetadata(args: CliOptions): Promise<void> {
    const config = await loadConfig();

    const schemaPath = args.schema || config.schema.path;
    const outputPath = args.output || config.metadata; // Default to metadata path
    const merge = args.merge;
    const verbose = args.verbose;
    const stitchedSqlOutput = args.stitchedSqlOutput || '_stitched_schema.sql';
    const schemaJsonOutput = args.schemaJsonOutput || '_schema.json';


    if (!schemaPath || !outputPath) {
      console.error('Error Missing required arguments. Please provide --schema and --output or set schema.path in codegen.config.ts')
      Deno.exit(1);
    }

    await scaffold(schemaPath, outputPath, merge, verbose, stitchedSqlOutput, schemaJsonOutput);
}


export async function inspect(args: CliOptions): Promise<void> {
    const config = await loadConfig();

    const schemaPath = args.schema || config.schema.path;
    const metadataPath = args.metadata || config.metadata;
    const verbose = args.verbose;
    const outputPath = args.output || config.output;
    const stitchedSqlOutput = args.stitchedSqlOutput || '_stitched_schema.sql';
    const schemaJsonOutput = args.schemaJsonOutput || '_schema.json';

    if (!schemaPath) {
        console.error("Error: Missing required argument: --schema");
        Deno.exit(1);
    }

    const schema = await parseSchema(schemaPath, outputPath, verbose, stitchedSqlOutput, schemaJsonOutput);
    console.log("Parsed Schema:");
    console.log(JSON.stringify(schema, null, 2));

    if (metadataPath) {
        const metadata = await processMetadata(metadataPath, verbose);
        console.log("\nParsed Metadata:");
        console.log(JSON.stringify(metadata, null, 2));
    }
}
