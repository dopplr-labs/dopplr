'use strict'

export class SqlQueries {
  GetAllFunctions: string
}

const queries = {
  0: <SqlQueries>{
    GetAllFunctions: `SELECT n.nspname as "schema",
        p.proname as "name",
        d.description,
        pg_catalog.pg_get_function_result(p.oid) as "resultType",
        pg_catalog.pg_get_function_arguments(p.oid) as "argumentTypes",
      CASE
        WHEN p.proisagg THEN 'agg'
        WHEN p.proiswindow THEN 'window'
        WHEN p.prorettype = 'pg_catalog.trigger'::pg_catalog.regtype THEN 'trigger'
        ELSE 'normal'
      END as "type"
      FROM pg_catalog.pg_proc p
          LEFT JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
          LEFT JOIN pg_catalog.pg_description d ON p.oid = d.objoid
      WHERE n.nspname <> 'information_schema'
        AND pg_catalog.pg_function_is_visible(p.oid)
        AND p.prorettype <> 'pg_catalog.trigger'::pg_catalog.regtype
        AND has_schema_privilege(quote_ident(n.nspname), 'USAGE') = true
        AND has_function_privilege(p.oid, 'execute') = true
      ORDER BY 1, 2, 4;`,
  },
  110000: <SqlQueries>{
    GetAllFunctions: `
      SELECT n.nspname as "schema",
        p.proname as "name",
        d.description,
        pg_catalog.pg_get_function_result(p.oid) as "resultType",
        pg_catalog.pg_get_function_arguments(p.oid) as "argumentTypes",
      CASE
        WHEN p.prokind = 'a' THEN 'agg'
        WHEN p.prokind = 'w' THEN 'window'
        WHEN p.prorettype = 'pg_catalog.trigger'::pg_catalog.regtype THEN 'trigger'
        ELSE 'normal'
      END as "type"
      FROM pg_catalog.pg_proc p
          LEFT JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
          LEFT JOIN pg_catalog.pg_description d ON p.oid = d.objoid
      WHERE n.nspname <> 'information_schema'
        AND pg_catalog.pg_function_is_visible(p.oid)
        AND p.prorettype <> 'pg_catalog.trigger'::pg_catalog.regtype
        AND has_schema_privilege(quote_ident(n.nspname), 'USAGE') = true
        AND has_function_privilege(p.oid, 'execute') = true
      ORDER BY 1, 2, 4;`,
  },
}

export class SqlQueryManager {
  static getVersionQueries(versionNumber: number): SqlQueries {
    const versionKeys = Object.keys(queries).map(k => parseInt(k))
    versionKeys.sort((a, b) => a - b)

    const queryResult = new SqlQueries()
    for (const version of versionKeys) {
      if (version > versionNumber) break

      const queryKeys = Object.keys(queries[version])
      for (const queryKey of queryKeys) {
        if (queries[version][queryKey]) {
          queryResult[queryKey] = queries[version][queryKey]
        }
      }
    }
    return queryResult
  }
}
