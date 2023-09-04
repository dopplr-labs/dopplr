// Porting from
// https://github.com/supabase/supabase/blob/master/studio/components/ui/CodeEditor/Providers/PgSQLSignatureHelpProvider.ts

import { RefObject } from 'react'
import BackwardIterator from './backward-iterator'

export default function getPgsqlSignatureHelpProvider(monaco: any, pgInfoRef: RefObject<any>) {
  return {
    signatureHelpTriggerCharacters: ['(', ','],
    provideSignatureHelp: function (model: any, position: any) {
      // position.column should minus 2 as it returns 2 for first char
      // position.lineNumber should minus 1
      const iterator = new BackwardIterator(model, position.column - 2, position.lineNumber - 1)

      const paramCount = iterator.readArguments()
      if (paramCount < 0) return null

      const ident = iterator.readIdent()
      if (!ident || ident.match(/^\".*?\"$/)) return null

      const fn = pgInfoRef.current.functions.find((f: any) => f.name.toLocaleLowerCase() === ident.toLocaleLowerCase())
      if (!fn) return null
      if (!fn.args || fn.args.length < paramCount) return null

      const activeSignature = 0
      const activeParameter = Math.min(paramCount, fn.args.length - 1)
      const signatures = []
      signatures.push({
        label: `${fn.name}( ${fn.args.join(' , ')} )`,
        documentation: fn.description,
        parameters: fn.args.map((v: any) => {
          return { label: v }
        }),
      })

      return { value: { signatures, activeSignature, activeParameter }, dispose: () => {} }
    },
  }
}
