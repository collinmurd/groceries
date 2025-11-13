
export class TimeBoxedRecordStore<T> {
  private store: Map<string, { record: T; expiry: number }>;
  private cleanupInterval: NodeJS.Timeout;

  constructor(private timeBoxMs: number) {
    this.store = new Map();

    // Cleanup old entries periodically
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, { expiry }] of this.store.entries()) {
        if (now > expiry) {
          this.store.delete(key);
        }
      }
    }, timeBoxMs);
  }

  set(key: string, record: T) {
    const expiry = Date.now() + this.timeBoxMs;
    this.store.set(key, { record, expiry });
  }

  get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return undefined;
    }

    return entry.record;
  }

  delete(key: string) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }

  stopCleanup() {
    clearInterval(this.cleanupInterval);
  }
}