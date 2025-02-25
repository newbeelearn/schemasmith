// src/templates/example.template.ts

export function generate(schema: any, metadata: any): string {
    let output = `// Generated code - ${new Date().toISOString()}\n\n`;

    for (const tableName in schema.tables) {
        const tableMetadata = metadata[tableName] || {};
        output += `export const ${tableName} = {\n`;
        output += `  fields: ${JSON.stringify(schema.tables[tableName].columns, null, 2)},\n`;
        output += `  tableMetadata: ${JSON.stringify(tableMetadata.tableMeta || {}, null, 2)},\n`;
        output += `  columnMetadata: ${JSON.stringify(tableMetadata.columns || {}, null, 2)},\n`;
        output += `  indexes: ${JSON.stringify(schema.tables[tableName].indexes, null, 2)},\n`; // Add indexes
        output += `  indexMetadata: ${JSON.stringify(tableMetadata.indexes || {}, null, 2)},\n`;
        output += `};\n\n`;
    }

    return output;
}
