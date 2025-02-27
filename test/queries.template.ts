function getPrimaryKeyColumnName(tableName, schema) {
  const table = schema.tables[tableName];
  if (!table) {
    return '';
  }

  for(const column of Object.values(table.columns)) {
    if (column.pk === 1) {
      return column.name
    }
  }
  return '';
}

function generate(schema, metadata) {
  let output = `// Generated code - ${new Date().toISOString()}\n\n`;
  const tbls = Object.keys(schema.tables);
  output +=
  `
import { sql, InferModel, eq, and, isNotNull } from 'drizzle-orm'
import * as qstypes from '../../server/db/gen.qtypes'
import { ${tbls.join(', ')} } from '../../server/db/schema';
import { ulidFactory } from "ulid-workers";
const ulid = ulidFactory();
`
  
  for (const tableName in schema.tables) {
    const tableMetadata = metadata[tableName] || {};
    const tname = tableName.charAt(0).toUpperCase() + tableName.slice(1)
    const pk = getPrimaryKeyColumnName(tableName, schema)
    const orgid = `eq(${tableName}.orgId, obj.orgId ? obj.orgId : '')`

    output +=`\n // ${tableName} queries`
    output +=
      `\n
const create${tname}Qry = async (obj: qstypes.${tableName}type, db: any) => {
  obj.${pk} = ulid()
  return db.insert(${tableName}).values(obj).returning().get();
}`

    output +=
      `\n
const getAll${tname}Qry = async (obj: qstypes.${tableName}type, db: any) => {
  return db.select().from(${tableName}).where(
    and(
      ${pk !== 'orgId' ? orgid : ''}
      isNotNull(${tableName}.${pk})
      )
     ).all();
}`

    output +=
      `\n
const getOne${tname}Qry = async (obj: qstypes.${tableName}type, db: any) => {
  return db.select().from(${tableName}).where(
    and(
      ${pk !== 'orgId' ? orgid : ''}
      eq(${tableName}.${pk}, obj.${pk} ? obj.${pk} : '')
  )).get();
}`

    output +=
  `\n
const update${tname}Qry = async (obj: qstypes.${tableName}type, db: any) => {
  return db.update(${tableName}).set(obj).where(
    and(
      ${pk !== 'orgId' ? orgid : ''}
      eq(${tableName}.${pk}, obj.${pk} ? obj.${pk} : '')
  )).returning().get();
}`

    output +=
  `\n
const delete${tname}Qry = async (obj: qstypes.${tableName}type, db: any) => {
  return db.delete(${tableName}).where(
    and(
      ${pk !== 'orgId' ? orgid : ''}
      eq(${tableName}.${pk}, obj.${pk} ? obj.${pk} : '')
  )).returning().get();
}`

    output +=`\n // ${tableName} queries end \n`
  }

  output +=`\n
const performQueryOne = async (db: any, Query: string) => {
  const result = await db.get(sql.raw(Query))
  return result;
}

const performQueryAll = async (db: any, Query: string) => {
  const result = await db.all(sql.raw(Query))
  return result;
}

// export queries
export {
`

  for (const tableName in schema.tables) {
    const tableMetadata = metadata[tableName] || {};
    const tname = tableName.charAt(0).toUpperCase() + tableName.slice(1)
    output += `\n
create${tname}Qry,
getAll${tname}Qry,
getOne${tname}Qry,
update${tname}Qry,
delete${tname}Qry,`
  }

  output += `
}`
  return output;
}
