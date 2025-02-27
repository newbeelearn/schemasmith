// src/metadata_processor.ts
import { Metadata } from "./types.ts";
import * as path from "https://deno.land/std@0.208.0/path/mod.ts";
import { fileExists, logVerbose } from "./utils.ts";

export async function processMetadata(metadataPath: string, verbose: boolean | undefined): Promise<Metadata> {
  const absoluteMetadataPath = path.resolve(Deno.cwd(), metadataPath);

  if (await fileExists(absoluteMetadataPath)) {
    try {
      const metadataText = Deno.readTextFileSync(absoluteMetadataPath);

      try {
        const metadata = JSON.parse(metadataText);
        return metadata;
      } catch {
        const metadataFn = new Function(`return (${metadataText});`);
        const metadata = metadataFn();
        return metadata;
      }

    } catch (error) {
      console.error(`Error reading or parsing metadata file: ${absoluteMetadataPath}`, error);
      throw error;
    }
  } else {
    logVerbose(`Metadata file not found: ${absoluteMetadataPath}. Using internal metadata.`, verbose);
    return {};
  }
}
