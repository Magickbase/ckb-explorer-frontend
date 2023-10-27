export class PersistenceService {
  get<T = unknown>(key: string, defaultValue: T): T
  get<T = unknown>(key: string, defaultValue?: T): T | undefined {
    const jsonStr = localStorage.getItem(key)
    if (!jsonStr) return defaultValue
    try {
      return JSON.parse(jsonStr) as T
    } catch (err) {
      // Here, it can only be a serialization error, which should be treated as data corruption that cannot be auto fixed.
      // Swallowing this error should have no impact.
      return defaultValue
    }
  }

  set<T = unknown>(key: string, value: T): T {
    localStorage.setItem(key, JSON.stringify(value))
    return value
  }

  // TODO: Consider providing a change event or changeEvent$.
}

export const persistenceService = new PersistenceService()
