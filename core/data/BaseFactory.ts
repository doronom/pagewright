export abstract class BaseFactory<T> {
  protected abstract defaults(): T;

  build(overrides: Partial<T> = {}): T {
    return { ...this.defaults(), ...overrides };
  }

  buildMany(count: number, overrides: Partial<T> = {}): T[] {
    return Array.from({ length: count }, () => this.build(overrides));
  }
}
