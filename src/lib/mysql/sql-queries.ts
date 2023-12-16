export function getTableColumnsQuery(table?: string) {
  const sql = /* SQL */ `
  SELECT
    table_schema as schemaname,
    table_name as tablename,
    concat(table_schema, '.', table_name) as quoted_name,
    true as is_table,
    json_arrayagg(json_object(
        'attname', column_name,
        'data_type', data_type,
        'attnum', ordinal_position
    )) as columns
  FROM
      information_schema.columns
  WHERE
      table_schema not in ('information_schema', 'mysql', 'performance_schema', 'sys')
  ${table ? `AND table_name = '${table}'` : ''}
  GROUP BY table_schema, table_name
`.trim()

  return sql
}
