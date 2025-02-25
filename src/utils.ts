// src/utils.ts
import * as path from "https://deno.land/std@0.208.0/path/mod.ts";

export function logVerbose(message: string, verbose: boolean | undefined): void {
    if (verbose) {
        console.log(message);
    }
}

export async function fileExists(filePath: string): Promise<boolean> {
    try {
        await Deno.stat(filePath);
        return true;
    } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
            return false;
        } else {
            throw error; // Re-throw unexpected errors
        }
    }
}

export function getSqliteFilename(filePath: string): string {
  // Use a hash of file path as filename
  const hash = Array.from(new Uint8Array(Deno.digest("sha256", new TextEncoder().encode(filePath)))) // Corrected line
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  return `.tmp_${hash}.sqlite`;
}
