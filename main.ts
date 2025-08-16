import { parse } from "https://deno.land/std@0.208.0/flags/mod.ts";
import { generate, inspect, init } from "./src/cli.ts";

const parsedArgs = parse(Deno.args, {
  boolean: ["help", "verbose", "dryRun", "merge"],
  string: ["config", "schema", "metadata", "templates", "output"],
  alias: { h: "help" },
});

function displayHelp() {
  const helpText = `
SchemaSmith: A powerful code generation tool from your database schema.

USAGE:
  schemasmith <command> [options]

COMMANDS:
  generate    Generates files based on your schema, metadata, and templates.
  inspect     Parses and displays the schema and metadata as JSON for debugging.
  init        Initializes a new project with a config file and boilerplate directories.
  help        Displays this help message.

GLOBAL OPTIONS:
  --help, -h        Show this help message.
  --config=<path>   Path to a 'codegen.config.json' file.
  --verbose         Enable verbose logging for detailed output.

Run 'schemasmith <command> --help' for more information on a specific command.
`;
  console.log(helpText);
}

async function main() {
  const command = parsedArgs._[0];

  // If no command is given, or 'help' is requested, show help and exit.
  if (!command || command === 'help' || parsedArgs.help) {
    displayHelp();
    Deno.exit(0);
  }

  const config = parsedArgs.config;

  switch (command) {
    case 'generate':
      await generate({ ...parsedArgs, config });
      break;

    case 'inspect':
      await inspect({ ...parsedArgs, config });
      break;

    case 'init':
      await init(parsedArgs);
      break;

    default:
      console.error(`Error: Unknown command '${command}'.`);
      console.error("Run 'schemasmith --help' to see a list of available commands.");
      Deno.exit(1);
  }
}

main();
