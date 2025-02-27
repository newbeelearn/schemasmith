function getPrimaryKeyColumnName(tableName, schema) {
  const table = schema.tables[tableName];
  if (!table) {
    return '';
  }

  for(const column of Object.values(table.columns)) {
    if (column.pk === 1) {
      return column.name;
    }
  }
  return '';
}

// Helper function to map SQL types to OpenAPI types
function mapSqlTypeToOpenApiType(sqlType) {
  const lowerType = sqlType.toLowerCase();
  if (lowerType.includes('int')) {
    return { type: 'integer' };
  } else if (lowerType.includes('decimal') || lowerType.includes('numeric') || lowerType.includes('real') || lowerType.includes('float') || lowerType.includes('double')) {
    return { type: 'number' };
  } else if (lowerType.includes('bool')) {
    return { type: 'boolean' };
  } else if (lowerType.includes('date')) {
    return { type: 'string', format: 'date' };
  } else if (lowerType.includes('time')) {
    if (lowerType.includes('timestamp')) {
      return { type: 'string', format: 'date-time' };
    }
    return { type: 'string', format: 'time' };
  } else if (lowerType.includes('blob')) {
    return { type: 'string', format: 'binary' };
  } else {
    return { type: 'string' };
  }
}

function generate(schema, metadata) {
  const tableNames = Object.keys(schema.tables);
  
  // Start building the OpenAPI document
  let openApiSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Generated API',
      description: 'Auto-generated API from database schema',
      version: '1.0.0'
    },
    servers: [
      {
        url: '/api',
        description: 'API Server'
      }
    ],
    paths: {},
    components: {
      schemas: {},
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  };

  // Generate schemas and paths for each table
  tableNames.forEach(tableName => {
    const table = schema.tables[tableName];
    const tableMeta = metadata[tableName]?.tableMeta || {};
    const columnsMeta = metadata[tableName]?.columns || {};
    const pk = getPrimaryKeyColumnName(tableName, schema);
    
    // Skip tables that are not exposed
    if (tableMeta.expose === 'out' || tableMeta.expose === 'inout' || !tableMeta.expose) {
      // Generate schema components
      generateSchemaComponents(tableName, table, columnsMeta, pk, openApiSpec);
      
      // Generate path operations
      generatePathOperations(tableName, table, columnsMeta, pk, tableMeta, openApiSpec);
    }
  });

  return JSON.stringify(openApiSpec, null, 2);
}

function generateSchemaComponents(
  tableName,
  table,
  columnsMeta,
  pk,
  openApiSpec
) {
  // Base schema for responses
  const responseSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' }
    },
    required: ['id']
  };

  // Input schema for POST/PUT requests
  const inputSchema = {
    type: 'object',
    properties: {},
    required: []
  };

  // Process each column
  Object.keys(table.columns).forEach(colName => {
    const column = table.columns[colName];
    const meta = columnsMeta[colName] || {};
    
    // Add to response schema if column is exposed for output
    if (meta.expose === 'out' || meta.expose === 'inout') {
      const exposedName = meta.expose || colName;
      const typeInfo = mapSqlTypeToOpenApiType(column.type);
      
      responseSchema.properties[exposedName] = {
        ...typeInfo,
        description: meta.label || colName
      };
      
      // Add to required fields if not nullable
      if (column.notnull === 1 && colName !== pk) {
        responseSchema.required.push(exposedName);
      }
    }
    
    // Add to input schema if column is exposed for input
    if (meta.expose === 'in' || meta.expose === 'inout') {
      const exposedName = meta.expose || colName;
      const typeInfo = mapSqlTypeToOpenApiType(column.type);
      
      inputSchema.properties[exposedName] = {
        ...typeInfo,
        description: meta.label || colName
      };
      
      // Add validation if available
      if (meta.validation) {
        inputSchema.properties[exposedName].pattern = meta.validation;
      }
      
      if (meta.maxLength) {
        inputSchema.properties[exposedName].maxLength = meta.maxLength;
      }
      
      if (meta.options) {
        inputSchema.properties[exposedName].enum = meta.options;
      }
      
      // Add to required fields if not nullable and required
      if (column.notnull === 1 && meta.required !== false && colName !== pk) {
        inputSchema.required.push(exposedName);
      }
    }
  });
  
  // Add schemas to components
  openApiSpec.components.schemas[`${capitalize(tableName)}Response`] = responseSchema;
  openApiSpec.components.schemas[`${capitalize(tableName)}Input`] = inputSchema;
  
  // Add array response schema
  openApiSpec.components.schemas[`${capitalize(tableName)}ArrayResponse`] = {
    type: 'array',
    items: {
      $ref: `#/components/schemas/${capitalize(tableName)}Response`
    }
  };
}

function generatePathOperations(
  tableName,
  table,
  columnsMeta,
  pk,
  tableMeta,
  openApiSpec
) {
  const resourcePath = `/${tableName.toLowerCase()}`;
  const itemPath = `${resourcePath}/{id}`;
  
  // Set up the paths object if it doesn't exist
  if (!openApiSpec.paths[resourcePath]) {
    openApiSpec.paths[resourcePath] = {};
  }
  
  if (!openApiSpec.paths[itemPath]) {
    openApiSpec.paths[itemPath] = {};
  }
  
  // GET all operation
  openApiSpec.paths[resourcePath].get = {
    summary: `Retrieve all ${tableName} records`,
    description: `Returns a list of all ${tableMeta.displayName || tableName} entries`,
    operationId: `getAll${capitalize(tableName)}`,
    tags: [tableName],
    responses: {
      '200': {
        description: 'Successful operation',
        content: {
          'application/json': {
            schema: {
              $ref: `#/components/schemas/${capitalize(tableName)}ArrayResponse`
            }
          }
        }
      },
      '401': {
        description: 'Unauthorized'
      },
      '403': {
        description: 'Forbidden'
      }
    }
  };
  
  // POST operation (create)
  openApiSpec.paths[resourcePath].post = {
    summary: `Create a new ${tableName} record`,
    description: `Creates a new ${tableMeta.displayName || tableName} entry`,
    operationId: `create${capitalize(tableName)}`,
    tags: [tableName],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: `#/components/schemas/${capitalize(tableName)}Input`
          }
        }
      }
    },
    responses: {
      '201': {
        description: 'Created successfully',
        content: {
          'application/json': {
            schema: {
              $ref: `#/components/schemas/${capitalize(tableName)}Response`
            }
          }
        }
      },
      '400': {
        description: 'Invalid input'
      },
      '401': {
        description: 'Unauthorized'
      },
      '403': {
        description: 'Forbidden'
      }
    }
  };
  
  // GET one operation
  openApiSpec.paths[itemPath].get = {
    summary: `Retrieve a ${tableName} record by ID`,
    description: `Returns a specific ${tableMeta.displayName || tableName} entry`,
    operationId: `getOne${capitalize(tableName)}`,
    tags: [tableName],
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        description: `ID of the ${tableName} to retrieve`,
        schema: {
          type: 'string'
        }
      }
    ],
    responses: {
      '200': {
        description: 'Successful operation',
        content: {
          'application/json': {
            schema: {
              $ref: `#/components/schemas/${capitalize(tableName)}Response`
            }
          }
        }
      },
      '401': {
        description: 'Unauthorized'
      },
      '403': {
        description: 'Forbidden'
      },
      '404': {
        description: 'Not found'
      }
    }
  };
  
  // PUT operation (update)
  openApiSpec.paths[itemPath].put = {
    summary: `Update a ${tableName} record`,
    description: `Updates an existing ${tableMeta.displayName || tableName} entry`,
    operationId: `update${capitalize(tableName)}`,
    tags: [tableName],
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        description: `ID of the ${tableName} to update`,
        schema: {
          type: 'string'
        }
      }
    ],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: `#/components/schemas/${capitalize(tableName)}Input`
          }
        }
      }
    },
    responses: {
      '200': {
        description: 'Updated successfully',
        content: {
          'application/json': {
            schema: {
              $ref: `#/components/schemas/${capitalize(tableName)}Response`
            }
          }
        }
      },
      '400': {
        description: 'Invalid input'
      },
      '401': {
        description: 'Unauthorized'
      },
      '403': {
        description: 'Forbidden'
      },
      '404': {
        description: 'Not found'
      }
    }
  };
  
  // DELETE operation
  openApiSpec.paths[itemPath].delete = {
    summary: `Delete a ${tableName} record`,
    description: `Deletes an existing ${tableMeta.displayName || tableName} entry`,
    operationId: `delete${capitalize(tableName)}`,
    tags: [tableName],
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        description: `ID of the ${tableName} to delete`,
        schema: {
          type: 'string'
        }
      }
    ],
    responses: {
      '200': {
        description: 'Deleted successfully'
      },
      '401': {
        description: 'Unauthorized'
      },
      '403': {
        description: 'Forbidden'
      },
      '404': {
        description: 'Not found'
      }
    }
  };
}

// Helper function to capitalize the first letter of a string
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
