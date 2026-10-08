import fs from 'fs';
import { Locator } from '@playwright/test';
import { Logger } from '../Logger';

export class FileUploadActions {
  constructor(private readonly logger: Logger) {}

  async uploadFile(locator: Locator, files: string | string[]): Promise<void> {
    const paths = Array.isArray(files) ? files : [files];
    const missing = paths.filter((file) => !fs.existsSync(file));
    if (missing.length) {
      throw new Error(`Upload file not found: ${missing.join(', ')}`);
    }
    this.logger.debug(`Uploading ${paths.join(', ')}`);
    await locator.setInputFiles(paths);
  }
}
