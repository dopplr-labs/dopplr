interface CustomEventMap {
  ['run-query']: CustomEvent<{ tabId: string }>
}
declare global {
  interface Document {
    // adds definition to Document, but you can do the same with HTMLElement
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void,
    ): void
    removeEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void,
    ): void
    dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void
  }
}

export function createRunQueryEvent(tabId: string) {
  const runQueryEvent = new CustomEvent('run-query', {
    detail: {
      tabId,
    },
  })

  return runQueryEvent
}
