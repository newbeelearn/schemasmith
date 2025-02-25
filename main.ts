// main.ts
import { parse } from "https://deno.land/std@0.208.0/flags/mod.ts";
import { generate } from "./src/cli.ts";
import { scaffoldMetadata } from "./src/cli.ts";
import { inspect } from "./src/cli.ts";

const parsedArgs = parse(Deno.args);

async function main() {
    const command = parsedArgs._[0];

    switch (command) {
        case 'generate':
            await generate(parsedArgs);
            break;
        case 'scaffold-metadata':
            await scaffoldMetadata(parsedArgs);
            break;
        case 'inspect':
            await inspect(parsedArgs);
            break;
        default:
            console.log('Unknown command. Available commands: generate, scaffold-metadata, inspect');
            Deno.exit(1);
    }
}
main();
