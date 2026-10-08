export class SharedData {
  private readonly store: Record<string, unknown> = {};

  set(key: string, value: unknown): void {
    this.store[key] = value;
  }

  get<T = unknown>(key: string): T | undefined {
    return this.store[key] as T | undefined;
  }

  has(key: string): boolean {
    return key in this.store;
  }

  clear(): void {
    for (const key of Object.keys(this.store)) {
      delete this.store[key];
    }
  }
}
