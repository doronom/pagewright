import { Logger } from './Logger';

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retry<T>(
  action: () => Promise<T>,
  label: string,
  logger: Logger,
  attempts = 3,
  baseDelayMs = 1000,
): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await action();
    } catch (error) {
      if (attempt >= attempts) {
        throw error;
      }
      const delay = baseDelayMs * 2 ** (attempt - 1);
      const message = error instanceof Error ? error.message : String(error);
      logger.warn(`${label} failed (attempt ${attempt}/${attempts}), retrying in ${delay}ms: ${message}`);
      await sleep(delay);
    }
  }
}
