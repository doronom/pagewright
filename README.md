# qa-template

A small, client-extendable Playwright + TypeScript automation template. One generic engine (`core/`) drives any
number of applications under test (`clients/<name>/`). Pages are described as data (page configs), and specs drive
them through `DynamicPage` instead of calling Playwright locators directly.

## Folder model

```
core/                      Generic engine. Never edited per client.
  page/DynamicPage.ts      Config-driven page driver (goto, executeSection, getLocator, assertions)
  page/types.ts            PageConfig, SectionConfig, FieldConfig, ActionConfig, ActionType, ActionFunction
  actions/                 Built-in action implementations, plus optional packs (packs/mui.ts)
  api/BaseApiClient.ts     Axios client with retries, Bearer auth, masked curl logging
  auth/AuthStrategy.ts     Interface a client implements to log in
  client/                  ClientDefinition interface and loadClient (resolves clients/$CLIENT/client.ts)
  fixtures.ts              Playwright fixtures: client, logger, sharedData, dynamicPage, apiClient
  env.ts                   TEST_ENV / CLIENT resolution and env file loading
  Logger.ts, RetryHelper.ts, SharedData.ts
clients/
  toolshop/                Reference client (practicesoftwaretesting.com UI and its API)
    client.ts              Implements ClientDefinition; the only entry point core knows about
    pages/                 Page configs; the only place locators live (sections/ holds shared sections)
    auth/                  AuthStrategy implementation
    api/                   API client extending BaseApiClient
    data/factories/        Test data builders (faker)
    tests/                 auth.setup.ts, ui/**/*.spec.ts, api/**/*.spec.ts
env/.env.example           Template for env/.env.<TEST_ENV>
scripts/new-client.ts      Scaffolds a new client from clients/toolshop
```

## Quick start

```bash
npm install
npx playwright install chromium
cp env/.env.example env/.env.dev
npm test
```

| Script                       | Purpose                             |
| ---------------------------- | ----------------------------------- |
| `npm test`                   | All projects (setup, ui, api)       |
| `npm run test:ui`            | UI project only (runs setup first)  |
| `npm run test:api`           | API project only (no browser state) |
| `npm run test:headed`        | Headed browser                      |
| `npm run test:debug`         | Playwright inspector                |
| `npm run report`             | Open the last HTML report           |
| `npm run lint` / `typecheck` | ESLint / TypeScript checks          |
| `npm run new-client <name>`  | Scaffold a new client               |

Every script respects `CLIENT` and `TEST_ENV`, for example `CLIENT=shop TEST_ENV=staging npm run test:ui`.
Note that `test:ui` runs the `ui` project; for Playwright UI mode use `npx playwright test --ui`.

## Adding a new client

1. `npm run new-client shop` copies `clients/toolshop` to `clients/shop`, renames `Toolshop*` identifiers to
   `Shop*`, and replaces the Toolshop specs with one placeholder spec each for ui and api. It also copies
   `fixtures.ts` (see below).
2. In `clients/shop/client.ts`, set `name`, `baseUrl`, `apiBaseUrl` and `defaultHeaders`.
3. Replace the configs in `clients/shop/pages/` with your application's pages and register them in `pages`.
4. Implement `clients/shop/auth/ShopAuth.ts`, or delete it and remove `auth` from `client.ts`.
5. Add endpoint methods to `clients/shop/api/ShopApiClient.ts`.
6. Add credentials to `env/.env.<TEST_ENV>` (and to CI secrets).
7. Write specs in `clients/shop/tests/ui` and `clients/shop/tests/api`, then run `CLIENT=shop npm test`.

No changes to `core/` are needed.

### Client fixtures

Each client has a `fixtures.ts` that extends the core `test` with client-typed fixtures, such as its own API
client. Specs import `test` and `expect` from there rather than from `@core/fixtures`, so they get the core
fixtures (`client`, `logger`, `sharedData`, `dynamicPage`, `apiClient`) plus anything the client adds. The `api`
fixture narrows the core `apiClient` (built by `createApiClient`) to the client's type instead of building a
second one:

```ts
import { test as base } from '@core/fixtures';
import { ShopApiClient } from './api/ShopApiClient';

export const test = base.extend<{ api: ShopApiClient }>({
  api: async ({ apiClient }, use) => {
    if (!(apiClient instanceof ShopApiClient)) {
      throw new Error('apiClient is not a ShopApiClient (check CLIENT env)');
    }
    await use(apiClient);
  },
});

export { expect } from '@core/fixtures';
```

Add further client-wide fixtures (seeded data, extra page helpers) to the same file.

## Writing a page config

A page config is a function of `Page` that returns sections of named fields. Each field has a locator and an
ordered list of actions. `executeSection` walks the data object you pass and runs each field's actions with the
field's value, unless the action config defines its own `value`.

```ts
export const loginPage = (page: Page): PageConfig => ({
  url: '/accounts/${accountId}/login',
  sections: {
    form: {
      fields: {
        username: { locator: page.locator('[data-test="username"]'), actions: [{ action: 'fill' }] },
        remember: { locator: page.getByLabel('Remember me'), actions: [{ action: 'check' }] },
        submit: { locator: page.getByRole('button', { name: 'Sign in' }), actions: [{ action: 'click' }] },
      },
    },
  },
});
```

```ts
sharedData.set('accountId', '42');
await dynamicPage.goto('login');
await dynamicPage.executeSection('form', { username: 'jane', remember: true, submit: true });
```

- `url` is resolved against `client.baseUrl(TEST_ENV)`. `${key}` placeholders are filled from `SharedData`; a
  missing key fails fast.
- `goto(name, { skipNavigation: true })` loads a page config without navigating, for pages reached by a click.
- Built-in actions: `fill`, `click`, `check`, `radio`, `toggle`, `selectOption` (native select), `upload`,
  `waitForElement`, `getText` (stores the text in `SharedData` when the value is a key name).

## Adding a custom action

An action is `(locator, value) => Promise<unknown>`. Register it for the whole client in `client.ts`, where it is
merged over the built-ins (so it can also override one):

```ts
import { muiActions } from '@core/actions/packs/mui';

const client: ClientDefinition = {
  actions: {
    ...muiActions,
    fillDate: async (locator, value) => locator.pressSequentially(String(value)),
  },
};
```

Or register it for a single `DynamicPage` instance with `dynamicPage.registerAction(name, fn)`.

## Adding an auth strategy

Implement `AuthStrategy` and set it as `auth` in `client.ts`:

```ts
export class ShopAuth implements AuthStrategy {
  async login(page: Page, creds: { user: string; password: string }): Promise<void> {}
  async isLoggedIn(page: Page): Promise<boolean> {}
}
```

The `setup` project runs `tests/auth.setup.ts`, which calls `login` with `APP_EMAIL` / `APP_PASSWORD`, waits for
`isLoggedIn`, and saves the session to `.auth/<client>.json`. The `ui` project reuses that session. A client without
`auth` skips setup and runs ui tests without stored state. A spec that needs a clean session uses
`test.use({ storageState: { cookies: [], origins: [] } })`.

For per-page bootstrapping (cookies, feature flags, consent banners) use `onPageInit`, which runs once per page
before the first navigation.

## API clients

Extend `BaseApiClient` and pass the client definition; base URL and default headers come from it. Each of `get`,
`post`, `put`, `patch` and `delete` returns the response body, or `{ data, status }` with `{ withStatus: true }`.
For negative tests pass `{ expectError: true }`: any status resolves (no throw) and the call returns
`{ data, status }`, so a spec can assert `expect(status).toBe(404)` directly.
Requests retry on 5xx, `ECONNRESET` and `ECONNABORTED` with exponential backoff. Non-2xx responses throw an axios
error after a structured error log. Set `LOG_LEVEL=debug` to log every request as a masked curl command.

## Environment variables

| Variable                    | Default    | Purpose                                                     |
| --------------------------- | ---------- | ----------------------------------------------------------- |
| `CLIENT`                    | `toolshop` | Folder under `clients/` to run                              |
| `TEST_ENV`                  | `dev`      | Loads `env/.env.<TEST_ENV>` if present; passed to `baseUrl` |
| `APP_EMAIL`, `APP_PASSWORD` |            | Credentials used by `auth.setup.ts` and the Toolshop specs  |
| `LOG_LEVEL`                 | `info`     | winston log level                                           |
| `ALLURE`                    |            | `true` adds the allure-playwright reporter                  |
| `CI`                        |            | Enables forbidOnly, 1 retry, longer API timeouts            |

Variables already set in the process take precedence over the env file. Env files other than `.env.example` are
git-ignored.

## CI

`.github/workflows/test-execution.yml` is a reusable workflow (`workflow_call`) with inputs `client`, `env` and
`project`. It installs dependencies and Chromium, runs the tests, and uploads `playwright-report` and `test-results`
as artifacts. Node is taken from `.nvmrc`. Secrets are exposed to the tests as env vars; add any your client needs
to the `secrets` list under `workflow_call` and to the job's `env` block.

`.github/workflows/run-tests.yml` calls it on push to `main`, on pull requests, and on manual dispatch (with inputs),
defaulting to `toolshop` / `dev`. The Toolshop client's credentials are the public customer demo account, so
`run-tests.yml` passes them as literal values. A job that calls a reusable workflow cannot set `env`, so the values
travel through the `secrets` map; nothing needs to be configured in the repository.

Real clients must not hard-code credentials. Store them as repository or environment secrets and call the reusable
workflow with `secrets: inherit`:

```yaml
shop:
  uses: ./.github/workflows/test-execution.yml
  with:
    client: shop
    env: staging
  secrets: inherit
```

## Testing conventions

- Locators live only in `clients/<name>/pages/*.config.ts`. Specs use `dynamicPage.getLocator()`; ESLint blocks
  `page.locator` and `page.getByTestId` under `tests/`.
- Wait on element state, or on `page.waitForResponse` registered before the action that triggers the request.
  `waitForTimeout` and `waitForLoadState('networkidle')` are blocked by ESLint under `tests/`.
- `fill` verifies the field with `toHaveValue()` after filling.
- Tests are independent: no shared mutable state between tests, data built by factories.
- No emojis in code, config or logs. Keep comments minimal; explanations belong in this README.
