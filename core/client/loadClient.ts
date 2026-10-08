import fs from 'fs';
import path from 'path';
import { clientName } from '../env';
import { ClientDefinition } from './ClientDefinition';

export function loadClient(name = clientName): ClientDefinition {
  const file = path.resolve(__dirname, '..', '..', 'clients', name, 'client.ts');
  if (!fs.existsSync(file)) {
    throw new Error(`Client "${name}" not found: expected ${file}`);
  }
  return require(file).default;
}
