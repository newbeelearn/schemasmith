// src/metadata_processor.ts
import { Metadata } from "./types.ts";
import * as path from "https://deno.land/std@0.208.0/path/mod.ts";
import { fileExists, logVerbose } from "./utils.ts";

export async function processMetadata(metadataPath: string, verbose: boolean | undefined): Promise<Metadata> {
  const absoluteMetadataPath = path.resolve(Deno.cwd(), metadataPath);

  if (await fileExists(absoluteMetadataPath)) {
    const { default: metadata } = await import(path.toFileUrl(absoluteMetadataPath).href);
    return metadata;
  } else {
    logVerbose(`Metadata file not found: ${absoluteMetadataPath}. Using internal metadata.`, verbose);
    return {};
  }
}
