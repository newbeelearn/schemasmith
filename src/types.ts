// src/types.ts

export interface ColumnSchema {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: any;
  pk: number;
}

export interface IndexSchema {
  seq: number;
  name: string;
  unique: number;
  origin: string;
  partial: number;
  columns: string[];
}

export interface TableSchema {
  name: string;
  columns: Record<string, ColumnSchema>;
  indexes: Record<string, IndexSchema>;
}

export interface Schema {
  version: string;
  tables: Record<string, TableSchema>;
}

export interface ColumnMetadata {
  label?: string;
  expose?: 'in' | 'out' | 'inout';
  readOnly?: boolean;
  uiComponent?: string;
  validation?: string;
  required?: boolean;
  maxLength?: number;
  options?: string[];
  relatedTable?: string;
  foreignKey?: string;
  prefix?: string;
  [key: string]: any; // Allow for custom metadata
}

export interface IndexMetadata {
  unique?: boolean;
  expose?: boolean;
}

export interface TableMetadata {
  displayName?: string;
  permissions?: string[];
  expose?: 'in' | 'out' | 'inout';
  preTx?: string;
  postTx?: string;
  [key: string]: any; // Allow for custom metadata
}

export interface Metadata {
  [table: string]: {
    tableMeta?: TableMetadata;
    columns?: Record<string, ColumnMetadata>;
    indexes?: Record<string, IndexMetadata>;
  };
}

export interface Config {
  schema: {
    path: string;
  };
  metadata: string;
  templates: string;
  output: string;
  options: {
    overwriteExisting: boolean;
    skipExisting: boolean;
  };
}

export interface CliOptions {
  schema?: string;
  metadata?: string;
  templates?: string;
  output?: string;
  dryRun?: boolean;
  verbose?: boolean;
  merge?: boolean;
  stitchedSqlOutput?: string;
  schemaJsonOutput?: string;
  defaults?: boolean;
}
