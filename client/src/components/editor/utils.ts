import ace from 'ace-builds'
import { SchemaResult } from 'types/schema'
import { capitalize } from 'lodash-es'

const languageTools = ace.require('ace/ext/language_tools')

/**
 * Global schema completions object. It contains the mapping from editorId to table, columns and tableColumn
 * completions.
 */
export const schemaCompletions: Record<
  string,
  {
    table: ace.Ace.Completion[]
    column: ace.Ace.Completion[]
    tableColumn: Record<string, ace.Ace.Completion[]>
  }
> = {}

/**
 * Update the global schema completions object for a particular editor with the schema object.
 *
 * @param editorId - The id of the editor
 * @param schema - The schema for the database selected for the editor
 */
export function updateCompletion(editorId: string, schema: SchemaResult[]) {
  schemaCompletions[editorId] = getCompletionsFromSchema(schema)
}

/**
 * Get all the table-columns completion keywords from the table schema
 *
 * @param table - Schema for a single table
 */
function getComlumnTableCompletions(table: SchemaResult): ace.Ace.Completion[] {
  const keywords: ace.Ace.Completion[] = []
  table.columns.forEach((column) => {
    const columnName = column.name
    keywords.push({
      name: `${table.name}.${columnName}`,
      value: `${table.name}.${columnName}`,
      score: 100,
      meta: capitalize(column.type ?? 'Column'),
    })
  })
  return keywords
}

/**
 * Get all the completion items (table, columns and table-columns) from the resource
 * schema.
 *
 * @param table - Schema for a single table
 */
export function getCompletionsFromSchema(schema: SchemaResult[]) {
  const tableKeywords: ace.Ace.Completion[] = []
  const columnKeywords: Record<string, string> = {}
  const tableColumnKeywords: Record<string, ace.Ace.Completion[]> = {}

  schema.forEach((table) => {
    tableKeywords.push({
      name: table.name,
      value: table.name,
      score: 100,
      meta: 'Table',
    })
    tableColumnKeywords[table.name] = getComlumnTableCompletions(table)
    table.columns.forEach((column) => {
      const columnName = column.name
      columnKeywords[columnName] = capitalize(column.type ?? 'Column')
    })
  })

  return {
    table: tableKeywords,
    column: Object.keys(columnKeywords).map((key) => ({
      name: key,
      value: key,
      score: 50,
      meta: columnKeywords[key],
    })),
    tableColumn: tableColumnKeywords,
  }
}

/**
 * ace completer for auto completing the table, column keywords
 */
const schemaCompleter: ace.Ace.Completer = {
  getCompletions: (
    editor: ace.Ace.Editor,
    session: ace.Ace.EditSession,
    pos: ace.Ace.Point,
    prefix: string,
    callback: ace.Ace.CompleterCallback,
  ) => {
    const editorId = editor.id
    const { table, column, tableColumn } = schemaCompletions[editorId] || {
      table: [],
      column: [],
      tableColumn: [],
    }

    if (prefix.length === 0 || table.length === 0) {
      callback(null, [])
      return
    }

    if (prefix[prefix.length - 1] === '.') {
      const tableName = prefix.substring(0, prefix.length - 1)
      callback(null, table.concat(tableColumn[tableName]))
    } else {
      callback(null, [...table, ...column])
    }
  },
}

languageTools.setCompleters([
  languageTools.snippetCompleter,
  languageTools.keyWordCompleter,
  languageTools.textCompleter,
  schemaCompleter,
])
