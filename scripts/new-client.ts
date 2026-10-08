import fs from 'fs';
import path from 'path';

const name = process.argv[2];
if (!name || !/^[a-z][a-z0-9-]*$/.test(name)) {
  console.error('Usage: npm run new-client <name>   (lowercase letters, digits and dashes)');
  process.exit(1);
}

const clientsDir = path.resolve(__dirname, '..', 'clients');
const source = path.join(clientsDir, 'example');
const target = path.join(clientsDir, name);
if (fs.existsSync(target)) {
  console.error(`Client "${name}" already exists at ${target}`);
  process.exit(1);
}

const pascalName = name
  .split('-')
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join('');

fs.cpSync(source, target, { recursive: true });

for (const dir of ['ui', 'api']) {
  const testDir = path.join(target, 'tests', dir);
  fs.rmSync(testDir, { recursive: true, force: true });
  fs.mkdirSync(testDir, { recursive: true });
}

fs.writeFileSync(
  path.join(target, 'tests', 'ui', 'placeholder.spec.ts'),
  `import { test } from '../../fixtures';

test.fixme('replace with real ui tests', async ({ dynamicPage }) => {
  await dynamicPage.goto('login');
});
`,
);
fs.writeFileSync(
  path.join(target, 'tests', 'api', 'placeholder.spec.ts'),
  `import { test } from '../../fixtures';

test.fixme('replace with real api tests', async ({ api }) => {
  await api.get('/');
});
`,
);

function rename(dir: string): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const current = path.join(dir, entry.name);
    const renamed = path.join(dir, entry.name.replace(/Example/g, pascalName));
    if (renamed !== current) {
      fs.renameSync(current, renamed);
    }
    if (entry.isDirectory()) {
      rename(renamed);
    } else {
      const content = fs.readFileSync(renamed, 'utf8');
      fs.writeFileSync(renamed, content.replace(/Example/g, pascalName).replace(/'example'/g, `'${name}'`));
    }
  }
}

rename(target);

console.log(`Created clients/${name}

Next steps:
  1. Set baseUrl and apiBaseUrl in clients/${name}/client.ts
  2. Replace the page configs in clients/${name}/pages with your application's pages
  3. Implement login in clients/${name}/auth/${pascalName}Auth.ts, or remove auth from client.ts
  4. Add endpoint methods to clients/${name}/api/${pascalName}ApiClient.ts
  5. Add credentials to env/.env.<TEST_ENV>
  6. Write specs in clients/${name}/tests and run: CLIENT=${name} npm test
`);
