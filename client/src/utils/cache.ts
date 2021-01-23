import { getDataFromLocalStorage } from './local-storage'

export abstract class CacheImplementation {
  abstract setData(key: string, value: any): void
  abstract getData<T extends any>(key: string, defaultValue: T): T
  abstract clearData(key: string): void
  abstract clearAllData(): void
}
export class Cache implements CacheImplementation {
  private data: Record<string, unknown>

  constructor() {
    this.data = {}
    this.setData = this.setData.bind(this)
    this.getData = this.getData.bind(this)
    this.clearData = this.clearData.bind(this)
  }

  setData(key: string, value: any) {
    this.data[key] = value
  }

  getData<T extends any>(key: string, defaultValue: T): T {
    // eslint-disable-next-line keyword-spacing
    return <T | undefined>this.data[key] || defaultValue
  }

  clearData(key: string) {
    delete this.data[key]
  }

  clearAllData() {
    this.data = {}
  }
}
export class LocalStorageCache implements CacheImplementation {
  constructor() {
    this.setData = this.setData.bind(this)
    this.getData = this.getData.bind(this)
  }

  setData(key: string, value: any) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      // do nothing
      // @TODO add logger to catch all the error messages
    }
  }

  getData<T extends any>(key: string, defaultValue: T): T {
    return getDataFromLocalStorage<T>(key, defaultValue)
  }

  clearData(key: string) {
    window.localStorage.removeItem(key)
  }

  clearAllData() {
    window.localStorage.clear()
  }
}
