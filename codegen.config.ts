// codegen.config.ts
export default {
    schema: {
        path: './src/db/schema.sql', // or path to migration directory
    },
    metadata: './src/metadata.ts',
    templates: './src/templates/',
    output: './src/generated/',
    options: {
        overwriteExisting: false,
        skipExisting: true,
    }
};
