export function requireBoolean(action: string, value: unknown): boolean {
  if (typeof value !== 'boolean') {
    throw new Error(`Action "${action}" expects true or false, got ${JSON.stringify(value)}`);
  }
  return value;
}
