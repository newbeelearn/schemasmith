// src/cli.ts
import { parseSchema } from "./schema_parser.ts";
import { processMetadata } from "./metadata_processor.ts";
import { processTemplates } from "./template_engine.ts";
import { generateFiles } from "./file_generator.ts";
import { scaffoldMetadata as scaffold } from "./metadata_scaffolder.ts";
import { logVerbose, fileExists } from "./utils.ts";
import * as path from "https://deno.land/std@0.208.0/path/mod.ts";
import { CliOptions, Config } from "./types.ts";
import { ensureDir } from "https://deno.land/std@0.208.0/fs/ensure_dir.ts";

async function loadConfig(configPath?: string): Promise<{ config: Partial<Config>; configDir: string }> {
  let absoluteConfigPath = configPath
    ? path.resolve(Deno.cwd(), configPath)
    : path.resolve(Deno.cwd(), "codegen.config.ts");

  try {
    const { default: userConfig } = await import(path.toFileUrl(absoluteConfigPath).href);
    const configDir = path.dirname(absoluteConfigPath);
    return { config: userConfig, configDir };
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return { config: {}, configDir: Deno.cwd() };
    } else {
      console.error(`Error loading config file: ${absoluteConfigPath}`, error);
      throw error;
    }
  }
}

function mergeConfigAndOptions(config: Partial<Config>, options: CliOptions): Required<CliOptions> {
  const merged = {
    schema: options.schema ?? config.schema?.path,
    metadata: options.metadata ?? config.metadata,
    templates: options.templates ?? config.templates,
    output: options.output ?? config.output,
    verbose: options.verbose ?? false,
    dryRun: options.dryRun ?? false,
    merge: options.merge ?? false,
    stitchedSqlOutput: options.stitchedSqlOutput,
    schemaJsonOutput: options.schemaJsonOutput,
    defaults: options.defaults,
  };

  if (!merged.metadata) {
    delete (merged as any).metadata;
  }

  return merged as any;
}

export async function generate(args: CliOptions & { config?: string }): Promise<void> {
  const { config, configDir } = await loadConfig(args.config);
  const options = mergeConfigAndOptions(config, args);

  if (!options.schema || !options.templates || !options.output) {
    console.error("Error: Missing required arguments.  Please provide --schema, --metadata, --templates, and --output, or set them in a config file.");
    Deno.exit(1);
  }

  const absoluteSchemaPath = path.resolve(configDir, options.schema);
  const absoluteTemplatesPath = path.resolve(configDir, options.templates);
  const absoluteOutputPath = path.resolve(configDir, options.output);
  const absoluteStitchedSqlOutputPath = options.stitchedSqlOutput ? path.resolve(configDir, options.stitchedSqlOutput) : undefined;
  const absoluteSchemaJsonOutputPath = options.schemaJsonOutput ? path.resolve(configDir, options.schemaJsonOutput) : undefined;
  const absoluteMetadataPath = options.metadata ? path.resolve(configDir, options.metadata) : undefined;

  logVerbose(`Schema path: ${absoluteSchemaPath}`, options.verbose);
  logVerbose(`Templates path: ${absoluteTemplatesPath}`, options.verbose);
  logVerbose(`Output path: ${absoluteOutputPath}`, options.verbose);
  if (absoluteMetadataPath) {
    logVerbose(`Metadata path: ${absoluteMetadataPath}`, options.verbose);
  }

  const schemaData = await parseSchema(absoluteSchemaPath, absoluteOutputPath, options.verbose,  absoluteStitchedSqlOutputPath, absoluteSchemaJsonOutputPath);

  if (options.dryRun) {
    console.log("Dry run complete.  Schema parsed successfully. No files written.");
    Deno.exit(0);
  }

  let metadataData: any = {};
  if(absoluteMetadataPath) {
    metadataData = await processMetadata(absoluteMetadataPath, options.verbose);
  }
  const generatedFiles = await processTemplates(absoluteTemplatesPath, schemaData, metadataData, options.verbose);
  await generateFiles(absoluteOutputPath, generatedFiles, true, false, options.verbose);
}

export async function scaffoldMetadata(args: CliOptions & { config?: string }): Promise<void> {
  const { config, configDir } = await loadConfig(args.config);
  const options = mergeConfigAndOptions(config, args);

  if (!options.schema || !options.output) {
    console.error("Error: Missing required arguments.  Please provide --schema and --output.");
    Deno.exit(1);
  }

  const absoluteSchemaPath = path.resolve(configDir, options.schema);
  const absoluteOutputPath = path.resolve(configDir, options.output);
  const absoluteStitchedSqlOutputPath = options.stitchedSqlOutput ? path.resolve(Deno.cwd(), options.stitchedSqlOutput) : undefined;
  const absoluteSchemaJsonOutputPath = options.schemaJsonOutput ? path.resolve(Deno.cwd(), options.schemaJsonOutput) : undefined;


  await scaffold(absoluteSchemaPath, absoluteOutputPath, options.merge, options.verbose, absoluteStitchedSqlOutputPath, absoluteSchemaJsonOutputPath);
}

export async function inspect(args: CliOptions & { config?: string }): Promise<void> {
  const { config, configDir } = await loadConfig(args.config); // Get config and dir
  const options = mergeConfigAndOptions(config, args);

  if (!options.schema) {
    console.error("Error: Missing required argument: --schema");
    Deno.exit(1);
  }

  const absoluteSchemaPath = path.resolve(configDir, options.schema);
  const absoluteMetadataPath = options.metadata ? path.resolve(configDir, options.metadata) : undefined;
  const absoluteOutputPath = options.output ? path.resolve(configDir, options.output) : Deno.cwd();
  const absoluteStitchedSqlOutputPath = options.stitchedSqlOutput ? path.resolve(Deno.cwd(), options.stitchedSqlOutput) : undefined;
  const absoluteSchemaJsonOutputPath = options.schemaJsonOutput ? path.resolve(Deno.cwd(), options.schemaJsonOutput) : undefined;

  const schemaData = await parseSchema(absoluteSchemaPath, absoluteOutputPath, options.verbose, absoluteStitchedSqlOutputPath, absoluteSchemaJsonOutputPath);
  console.log("Parsed Schema:");
  console.log(JSON.stringify(schemaData, null, 2));

  if (absoluteMetadataPath) {
    const metadataData = await processMetadata(absoluteMetadataPath, options.verbose);
    console.log("\nParsed Metadata:");
    console.log(JSON.stringify(metadataData, null, 2));
  }
}

export async function init(args: { _: (string | number)[]; output?: string }): Promise<void> {
  const targetDir = args.output ? path.resolve(Deno.cwd(), args.output) : Deno.cwd();
  const configFilePath = path.join(targetDir, "codegen.config.ts");

  if (await fileExists(configFilePath)) {
    console.log(`codegen.config.ts already exists in ${targetDir}.`);
    return;
  }
  await ensureDir(targetDir);

  const defaultConfigContent = `export default {
    schema: {
        path: './src/db/schema.sql', // Or path to migrations directory
    },
    metadata: './src/metadata.ts',
    templates: './src/templates/',
    output: './src/generated/',
};`;

  await Deno.writeTextFile(configFilePath, defaultConfigContent);
  console.log(`Created codegen.config.ts in ${targetDir}`);
}
