import {
  CompletionItem,
  CompletionItemKind,
  createConnection,
  Diagnostic,
  DiagnosticSeverity,
  IConnection,
  InitializeResult,
  ParameterInformation,
  SignatureHelp,
  SignatureInformation,
  TextDocument,
  TextDocuments,
  TextDocumentSyncKind,
} from 'vscode-languageserver'
import * as TextDocumentImpl from 'vscode-languageserver-textdocument'
import * as rpc from 'vscode-ws-jsonrpc'
import { ResourcesService } from 'src/resources/resources.service'
import { PgClient } from './db-connection'
import {
  DBFunction,
  DBFunctionsRaw,
  DBSchema,
  DBTable,
  FieldCompletionItem,
  Ident,
} from './language-server.types'
import { Validator } from './language-validator'
import { SqlQueryManager } from './queries'
import { BackwardIterator } from './backword-iterator'

export function launch(
  socket: rpc.IWebSocket,
  resourcesService: ResourcesService,
) {
  const reader = new rpc.WebSocketMessageReader(socket)
  const writer = new rpc.WebSocketMessageWriter(socket)
  const connection = createConnection(reader, writer)
  const server = new SqlLanguageServer(connection, resourcesService)
  server.start()
  return server
}

export class SqlLanguageServer {
  protected readonly documents = new TextDocuments(
    TextDocumentImpl.TextDocument,
  )

  schemaCache: DBSchema[] = []
  tableCache: DBTable[] = []
  functionCache: DBFunction[] = []
  keywordCache: string[] = []
  databaseCache: string[] = []

  dbConnection: PgClient | undefined

  constructor(
    protected readonly connection: IConnection,
    private readonly resourcesService: ResourcesService,
  ) {
    this.documents.listen(this.connection)

    this.documents.onDidChangeContent(change => {
      this.validateTextDocument(change.document)
    })

    this.connection.onInitialize(this.handleConnectionInitialize)

    this.connection.onCompletion(this.handleCompletion)

    this.connection.onSignatureHelp(this.handleSignatureHelp)
  }

  handleConnectionInitialize = (params): InitializeResult => {
    const { initializationOptions = {} } = params
    const resourceId = initializationOptions.resourceId
    this.loadCompletionCache(resourceId)

    return {
      capabilities: {
        textDocumentSync: TextDocumentSyncKind.Full,
        completionProvider: {
          triggerCharacters: [' ', '.', '"'],
        },
        signatureHelpProvider: {
          triggerCharacters: ['(', ','],
        },
      },
    }
  }

  handleSignatureHelp = (positionParams): SignatureHelp => {
    const document = this.documents.get(positionParams.textDocument.uri)
    let activeSignature = null
    let activeParameter = null
    const signatures: SignatureInformation[] = []
    if (document) {
      const iterator = new BackwardIterator(
        document,
        positionParams.position.character - 1,
        positionParams.position.line,
      )

      const paramCount = iterator.readArguments()
      if (paramCount < 0) return null

      const ident = iterator.readIdent()
      if (!ident || ident.match(/^".*?"$/)) return null

      const fn = this.functionCache.find(
        f => f.name.toLocaleLowerCase() === ident.toLocaleLowerCase(),
      )
      if (!fn) return null

      const overloads = fn.overloads.filter(o => o.args.length >= paramCount)
      if (!overloads || !overloads.length) return null

      overloads.forEach(overload => {
        signatures.push({
          label: `${fn.name}( ${overload.args.join(' , ')} )`,
          documentation: overload.description,
          parameters: overload.args.map<ParameterInformation>(v => {
            return { label: v }
          }),
        })
      })

      activeSignature = 0
      activeParameter = Math.min(paramCount, overloads[0].args.length - 1)
    }
    return { signatures, activeSignature, activeParameter }
  }

  handleCompletion = (e: any): CompletionItem[] => {
    const items: FieldCompletionItem[] = []

    const document = this.documents.get(e.textDocument.uri)
    if (!document) return items

    const iterator = new BackwardIterator(
      document,
      e.position.character - 1,
      e.position.line,
    )

    if (e.context.triggerCharacter === '"') {
      const startingQuotedIdent = iterator.isFowardDQuote()
      if (!startingQuotedIdent) return items

      iterator.next() // get passed the starting quote
      if (iterator.isNextPeriod()) {
        // probably a field - get the ident
        let ident = iterator.readIdent()
        let isQuotedIdent = false
        if (ident.match(/^".*?"$/)) {
          isQuotedIdent = true
          ident = fixQuotedIdent(ident)
        }
        const table = this.tableCache.find(tbl => {
          return (
            (isQuotedIdent && tbl.tablename === ident) ||
            (!isQuotedIdent &&
              tbl.tablename.toLocaleLowerCase() === ident.toLocaleLowerCase())
          )
        })

        if (!table) return items
        table.columns.forEach(field => {
          items.push({
            label: field.attname,
            kind: CompletionItemKind.Property,
            detail: field.dataType,
          })
        })
      } else {
        // probably a table - list the tables
        this.tableCache.forEach(table => {
          items.push({
            label: table.tablename,
            kind: CompletionItemKind.Class,
          })
        })
      }
      return items
    }

    if (e.context.triggerCharacter === '.') {
      const idents = readIdents(iterator, 3)
      let pos = 0

      let schema = this.schemaCache.find(sch => {
        return (
          (idents[pos].isQuoted && sch.name === idents[pos].name) ||
          (!idents[pos].isQuoted &&
            sch.name.toLocaleLowerCase() ===
              idents[pos].name.toLocaleLowerCase())
        )
      })

      if (!schema) {
        schema = this.schemaCache.find(sch => {
          return sch.name === 'public'
        })
      } else {
        pos++
      }

      if (idents.length === pos) {
        this.tableCache.forEach(tbl => {
          if (tbl.schemaname !== schema.name) {
            return
          }
          items.push({
            label: tbl.tablename,
            kind: CompletionItemKind.Class,
            detail: tbl.schemaname !== 'public' ? tbl.schemaname : null,
          })
        })
        return items
      }

      const table = this.tableCache.find(tbl => {
        return (
          (tbl.schemaname === schema.name &&
            idents[pos].isQuoted &&
            tbl.tablename === idents[pos].name) ||
          (!idents[pos].isQuoted &&
            tbl.tablename.toLocaleLowerCase() ===
              idents[pos].name.toLocaleLowerCase())
        )
      })

      if (table) {
        table.columns.forEach(field => {
          items.push({
            label: field.attname,
            kind: CompletionItemKind.Property,
            detail: field.dataType,
          })
        })
      }

      return items
    }

    this.schemaCache.forEach(schema => {
      items.push({
        label: schema.name,
        kind: CompletionItemKind.Module,
      })
    })

    this.tableCache.forEach(table => {
      items.push({
        label: table.tablename,
        detail: table.schemaname !== 'public' ? table.schemaname : null,
        kind: table.isTable
          ? CompletionItemKind.Class
          : CompletionItemKind.Interface,
        insertText:
          table.schemaname === 'public'
            ? table.tablename
            : table.schemaname + '.' + table.tablename,
      })
      table.columns.forEach(field => {
        const foundItem = items.find(
          i =>
            i.label === field.attname &&
            i.kind === CompletionItemKind.Field &&
            i.detail === field.dataType,
        )
        if (foundItem) {
          foundItem.tables.push(table.tablename)
          foundItem.tables.sort()
          foundItem.documentation = foundItem.tables.join(', ')
        } else {
          items.push({
            label: field.attname,
            kind: CompletionItemKind.Field,
            detail: field.dataType,
            documentation: table.tablename,
            tables: [table.tablename],
          })
        }
      })
    })

    this.functionCache.forEach(fn => {
      items.push({
        label: fn.name,
        kind: CompletionItemKind.Function,
        detail: fn.resultType,
        documentation: fn.overloads[0].description,
      })
    })

    this.keywordCache.forEach(keyword => {
      items.push({
        label: keyword,
        kind: CompletionItemKind.Keyword,
      })
    })

    this.databaseCache.forEach(database => {
      items.push({
        label: database,
        kind: CompletionItemKind.Module,
      })
    })

    return items
  }

  start() {
    this.connection.listen()
  }

  stop() {
    if (this.dbConnection) {
      this.dbConnection.end()
    }
    this.connection.dispose()
  }

  loadCompletionCache = async (resourceId: number) => {
    const resource = await this.resourcesService.getResource(resourceId)
    this.dbConnection = new PgClient({
      host: resource.host,
      port: resource.port,
      user: resource.username,
      password: resource.password,
      database: resource.database,
    })

    this.dbConnection.connect()
    // setup database caches for schemas, functions, tables, and fields
    const vQueries = SqlQueryManager.getVersionQueries(
      this.dbConnection.pg_version,
    )
    try {
      const schemas = await this.dbConnection.query(`
        SELECT nspname as name
        FROM pg_namespace
        WHERE
          nspname not in ('information_schema', 'pg_catalog', 'pg_toast')
          AND nspname not like 'pg_temp_%'
          AND nspname not like 'pg_toast_temp_%'
          AND has_schema_privilege(oid, 'CREATE, USAGE')
        ORDER BY nspname;
        `)
      this.schemaCache = schemas.rows
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err.message)
    }

    try {
      const tablesAndColumns = await this.dbConnection.query(`
        SELECT
          tbl.schemaname,
          tbl.tablename,
          tbl.quoted_name,
          tbl.isTable,
          json_agg(a) as columns
        FROM
          (
            SELECT
              schemaname,
              tablename,
              (quote_ident(schemaname) || '.' || quote_ident(tablename)) as quoted_name,
              true as isTable
            FROM
              pg_tables
            WHERE
              schemaname not in ('information_schema', 'pg_catalog', 'pg_toast')
              AND schemaname not like 'pg_temp_%'
              AND schemaname not like 'pg_toast_temp_%'
              AND has_schema_privilege(quote_ident(schemaname), 'CREATE, USAGE') = true
              AND has_table_privilege(quote_ident(schemaname) || '.' || quote_ident(tablename), 'SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER') = true
            union all
            SELECT
              schemaname,
              viewname as tablename,
              (quote_ident(schemaname) || '.' || quote_ident(viewname)) as quoted_name,
              false as isTable
            FROM pg_views
            WHERE
              schemaname not in ('information_schema', 'pg_catalog', 'pg_toast')
              AND schemaname not like 'pg_temp_%'
              AND schemaname not like 'pg_toast_temp_%'
              AND has_schema_privilege(quote_ident(schemaname), 'CREATE, USAGE') = true
              AND has_table_privilege(quote_ident(schemaname) || '.' || quote_ident(viewname), 'SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER') = true
          ) as tbl
          LEFT JOIN (
            SELECT
              attrelid,
              attname,
              format_type(atttypid, atttypmod) as dataType,
              attnum,
              attisdropped
            FROM
              pg_attribute
          ) as a ON (
            a.attrelid = tbl.quoted_name::regclass
            AND a.attnum > 0
            AND NOT a.attisdropped
            AND has_column_privilege(tbl.quoted_name, a.attname, 'SELECT, INSERT, UPDATE, REFERENCES')
          )
        GROUP BY schemaname, tablename, quoted_name, isTable;
        `)
      this.tableCache = tablesAndColumns.rows
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err.message)
    }

    try {
      const functions = await this.dbConnection.query(vQueries.GetAllFunctions)

      functions.rows.forEach((fn: DBFunctionsRaw) => {
        // return new ColumnNode(this.connection, this.table, column);
        let existing = this.functionCache.find(f => f.name === fn.name)
        if (!existing) {
          existing = {
            name: fn.name,
            schema: fn.schema,
            resultType: fn.resultType,
            type: fn.type,
            overloads: [],
          }
          this.functionCache.push(existing)
        }
        const args = fn.argumentTypes
          .split(',')
          .filter(a => a)
          .map<string>(a => a.trim())
        existing.overloads.push({ args, description: fn.description })
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err.message)
    }

    try {
      const keywords = await this.dbConnection.query(
        'select * from pg_get_keywords();',
      )
      this.keywordCache = keywords.rows.map<string>(rw =>
        rw.word.toLocaleUpperCase(),
      )
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err.message)
    }

    try {
      const databases = await this.dbConnection.query(`
    SELECT datname
    FROM pg_database
    WHERE
      datistemplate = false
      AND has_database_privilege(quote_ident(datname), 'TEMP, CONNECT') = true
    ;`)
      this.databaseCache = databases.rows.map<string>(rw => rw.datname)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err.message)
    }
  }

  validateTextDocument = async (textDocument: TextDocument): Promise<void> => {
    const _NL = '\n'.charCodeAt(0)
    const diagnostics: Diagnostic[] = []
    // parse and find issues
    const sqlText = textDocument.getText()
    if (!sqlText) {
      this.connection.sendDiagnostics({ uri: textDocument.uri, diagnostics })
      return
    }
    for (const sql of Validator.prepareSql(sqlText)) {
      if (!sql.statement) continue
      let errColumnMod = 0
      if (
        sql.statement
          .trim()
          .toUpperCase()
          .startsWith('EXPLAIN ')
      ) {
        const match = sql.statement.match(/\s*?EXPLAIN\s/gi)
        if (match) {
          for (let i = 0; i < match[0].length; i++) {
            const ch = match[0].charCodeAt(i)
            errColumnMod++
            if (ch === _NL) {
              errColumnMod = 1
              sql.line++
            }
          }
          sql.statement = sql.statement.replace(/\s*?EXPLAIN\s/gi, '')
        }
      }
      try {
        await this.isDbInitialized()
        await this.dbConnection.query(`EXPLAIN ${sql.statement}`)
      } catch (err) {
        // can use err.position (string)
        // corresponds to full position in query "EXPLAIN ${sql.statement}"
        // need to parse out where in parsed statement and lines that it is
        let errPosition = parseInt(err.position) - 9 + errColumnMod // removes "EXPLAIN " and turn to zero based
        let errLine = 0
        while (errPosition > sql.lines[errLine].length) {
          errPosition -= sql.lines[errLine].length + 1
          errLine++
        }
        // should have the line - and column
        // find next space after position
        let spacePos = errPosition
        if (errPosition < sql.lines[errLine].length) {
          spacePos = sql.lines[errLine].indexOf(' ', errPosition)
          if (spacePos < 0) {
            spacePos = sql.lines[errLine].length
          }
        }
        if (errLine === 0) {
          errPosition += sql.column // add the column back in - only for first line
        }
        diagnostics.push({
          severity: DiagnosticSeverity.Error,
          range: {
            start: { line: sql.line + errLine, character: errPosition },
            end: { line: sql.line + errLine, character: spacePos },
          },
          message: err.message,
          source: 'dopplr',
        })
      }
    }
    this.connection.sendDiagnostics({ uri: textDocument.uri, diagnostics })
  }

  isDbInitialized = () => {
    return new Promise(resolve => {
      const check = () => {
        if (this.dbConnection) {
          resolve(true)
        } else {
          setTimeout(check, 100)
        }
      }

      check()
    })
  }
}

function fixQuotedIdent(str: string): string {
  return str
    .replace(/^"/, '')
    .replace(/"$/, '')
    .replace(/"/, '"')
}

function readIdents(iterator: BackwardIterator, maxlvl: number): Ident[] {
  return iterator.readIdents(maxlvl).map<Ident>(name => {
    let isQuoted = false
    if (name.match(/^".*?"$/)) {
      isQuoted = true
      name = fixQuotedIdent(name)
    }
    return { isQuoted: isQuoted, name: name }
  })
}
