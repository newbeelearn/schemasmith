# SchemaSmith

**SchemaSmith** is a powerful and flexible command-line tool that automates code generation from your SQL database schema. It parses your schema, enriches it with custom metadata, and uses templates to generate any type of file you need, from ORM models and API routes to documentation.

## Features

*   **SQL Schema Parsing:** Automatically parses tables, columns, data types, constraints, and indexes from your SQL schema files.
*   **Metadata Enrichment:** Augment your schema with custom metadata to control the generated output with precision.
*   **Template-Driven:** Uses a powerful templating engine to generate any text-based file, giving you complete control over the output.
*   **Configuration-Based:** Simple project setup using a `codegen.config.json` file.
*   **Self-Documenting CLI:** An easy-to-use command-line interface.

## Installation

1.  Ensure you have [Deno](https://deno.land/manual/getting_started/installation) installed on your system.
2.  Install SchemaSmith directly from the GitHub repository:
    ```sh
    deno install --allow-read --allow-write -n schemasmith https://raw.githubusercontent.com/newbeelearn/schemasmith/master/main.ts
    ```
    This will install the `schemasmith` command globally.

## Quick Start Guide

Getting started with SchemaSmith is a simple, five-step process.

### 1. Initialize a Project

First, create a new directory for your project and run the `init` command.

```sh
mkdir my-project
cd my-project
schemasmith init
```

This will create a standard project structure for you:

```
my-project/
├── db/
│   └── schema.sql        # <-- Put your SQL schema here
├── templates/              # <-- Your code generation templates
├── generated/              # <-- Output files will be created here
├── codegen.config.json   # <-- Main configuration file
└── metadata.ts           # <-- Your manual metadata goes here
```

### 2. Add Your Schema

Place your database schema (e.g., `CREATE TABLE` statements) inside the `db/schema.sql` file.

### 3. Generate Your Code

Run the `generate` command for the first time.

```sh
schemasmith generate
```

This command performs two key actions:
1.  It generates output files in the `generated/` directory based on the default templates.
2.  It creates a crucial reference file named `_internal_metadata.json` inside your output directory. **This file is your guide** for creating your own metadata.

### 4. Customize Your Metadata

Open `metadata.ts`. This file is where you add custom information that can't be inferred from the SQL schema alone.

To know what to add, open the newly created `generated/_internal_metadata.json`. This file shows you the exact structure that SchemaSmith parsed from your `schema.sql`. You can copy parts of this structure into `metadata.ts` to enrich it with your own properties.

**Example:**
If your `_internal_metadata.json` shows a `users` table, you can add custom metadata to it in `metadata.ts`:

```typescript
// metadata.ts
export default {
  users: {
    tableMeta: {
      // Custom metadata for the 'users' table
      generateApiEndpoints: true,
      authLevel: "admin"
    },
    columns: {
      password: {
        // Custom metadata for the 'password' column
        isSensitive: true
      }
    }
  }
};
```

### 5. Customize Templates

Modify the files in the `templates/` directory to change the generated output. The data from your schema and metadata is available to you in these templates. Run `schemasmith generate` again to see your changes.

## Command-Line Interface

### `schemasmith init`

Initializes a new project with a config file and boilerplate directories.

### `schemasmith generate`

Generates files based on your schema, metadata, and templates. This is the main command you will use.

### `schemasmith inspect`

A powerful debugging tool. It parses your schema and metadata and prints the resulting JSON object to the console without writing any files. This is perfect for understanding the data available in your templates.

### Global Options

*   `--help`, `-h`: Show the help message.
*   `--config=<path>`: Specify a path to the `codegen.config.json` file.
*   `--verbose`: Enable verbose logging for detailed output.

---

## For Developers

Interested in contributing to SchemaSmith? Here's how to get started.

### Prerequisites

*   [Deno](https://deno.land/) (version 1.x)
*   Git

### Setup and Running Locally

1.  Clone the repository:
    ```sh
    git clone https://github.com/newbeelearn/schemasmith.git
    cd schemasmith
    ```

2.  Run the tool directly using `deno run`. You must provide read/write permissions.
    ```sh
    # Example of running the 'generate' command on a project in a different directory
    deno run --allow-read --allow-write main.ts generate /path/to/your/project
    ```

### Compiling a Standalone Executable

You can compile SchemaSmith into a single, self-contained executable.

```sh
deno compile --allow-read --allow-write --output schemasmith main.ts
```

This will create an executable file named `schemasmith` in your current directory that you can run anywhere.

### Contributing

Project is as is only fixes will be added no new feature will be added. Please add pull request for fixing issues only.

## License

This project is licensed under the MIT License.
