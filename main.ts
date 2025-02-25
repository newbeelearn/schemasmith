// main.ts
import { parse } from "https://deno.land/std@0.208.0/flags/mod.ts";
import { generate } from "./src/cli.ts";
import { scaffoldMetadata } from "./src/cli.ts";
import { inspect } from "./src/cli.ts";
import { init } from "./src/cli.ts";

const parsedArgs = parse(Deno.args);

async function main() {
  const command = parsedArgs._[0];
  const config = parsedArgs.config;

  switch (command) {
        case 'generate':
          await generate({...parsedArgs, config});
          break;
        case 'scaffold-metadata':
          await scaffoldMetadata({...parsedArgs, config});
          break;
        case 'inspect':
          await inspect({...parsedArgs, config});
          break;
        case 'init':
          await init(parsedArgs);
          break;
        default:
          console.log('Unknown command. Available commands: generate, scaffold-metadata, inspect, init');
          Deno.exit(1);
  }
}
main();
