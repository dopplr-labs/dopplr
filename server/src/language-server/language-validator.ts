export interface ISqlDetails {
  statement: string
  line: number
  column: number
  readonly lines: string[]
}

export class Validator {
  /**
   * We need to track the following:
   *  - Each Statement
   *  - Starting Line
   *  - Starting Column
   */

  public static * prepareSql(sql: string): IterableIterator<ISqlDetails> {
    const lines = sql.split(/\r?\n/)
    let startLine = 0
    let startColumn = 0
    let commandLines: string[] = []

    let inStatement = false
    let inLineComment = false
    let inBlockComment = false
    let inIdentifier = false
    let inQuote = false

    for (let currentLine = 0; currentLine < lines.length; currentLine++) {
      for (const data of Validator.sqlSplit(lines[currentLine])) {
        if (!inStatement && !inLineComment && !inBlockComment) {
          if (
            data.first !== '--' &&
            data.first !== '/*' &&
            data.contents.trim().length > 0
          ) {
            startColumn = data.start
            startLine = currentLine
            inStatement = true
            commandLines = []
          }
        }

        if (!inLineComment && !inBlockComment && !inIdentifier && !inQuote) {
          if (data.first === '--') inLineComment = true
          else if (data.first === '/*') inBlockComment = true
          else if (data.first === '"') inIdentifier = true
          else if (data.first === "'") inQuote = true
        }

        commandLines.push(
          (data.first ? data.first : '') +
            data.contents +
            (data.last ? data.last : ''),
        )

        if (
          !inLineComment &&
          !inBlockComment &&
          !inIdentifier &&
          !inQuote &&
          inStatement &&
          data.last === ';'
        ) {
          inStatement = false
          yield {
            statement: commandLines.join('\n'),
            line: startLine,
            column: startColumn,
            lines: commandLines,
          }
        }

        if (inBlockComment && data.last === '*/') inBlockComment = false
        if (inIdentifier && data.last === '""') inIdentifier = false
        if (inQuote && data.last === "''") inQuote = false
      }
      inLineComment = false
    }
    if (inStatement && !inBlockComment && !inIdentifier && !inQuote) {
      commandLines.push(';')
    }
    if (inStatement) {
      yield {
        statement: commandLines.join('\n'),
        line: startLine,
        column: startColumn,
        lines: commandLines,
      }
    }
  }

  public static * sqlSplit(sql: string) {
    const bookends = [';', '"', '""', "'", "''", '--', '/*', '*/']
    let lastBookendFound = null
    let start = 0

    if (sql) {
      while (start <= sql.length) {
        const results = Validator.getNextOccurence(sql, start, bookends)
        if (!results) {
          yield {
            first: lastBookendFound,
            last: null,
            contents: sql.substr(start),
            start,
            end: start + sql.substr(start).length,
          }
          start = sql.length + 1 // ? is this right?
        } else {
          yield {
            first: lastBookendFound,
            last: results.bookend,
            contents: sql.substring(start, results.end),
            start,
            end: results.end,
          }
          start = results.end + results.bookend.length + 1
          lastBookendFound = results.bookend !== ';' ? results.bookend : null
        }
      }
    }
  }

  private static getNextOccurence(
    haystack: string,
    offset: number,
    needles: string[],
  ) {
    const firstCharMap = {}
    needles.forEach(n => {
      firstCharMap[n[0]] = n
    })
    const firstChars = Object.keys(firstCharMap)
    if (haystack) {
      while (offset < haystack.length) {
        if (firstChars.indexOf(haystack[offset]) >= 0) {
          const possibleNeedle = firstCharMap[haystack[offset]]
          if (
            haystack.substr(offset, possibleNeedle.length) === possibleNeedle
          ) {
            return { end: offset, bookend: possibleNeedle }
          }
        }
        offset++
      }
    }
    return null
  }
}
