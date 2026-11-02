import { ClientDefinition } from '@core/client/ClientDefinition';
import { ExampleApiClient } from './api/ExampleApiClient';
import { ExampleAuth } from './auth/ExampleAuth';
import { cartPage } from './pages/CartPage.config';
import { inventoryPage } from './pages/InventoryPage.config';
import { loginPage } from './pages/LoginPage.config';

const client: ClientDefinition = {
  name: 'example',
  baseUrl: () => 'https://www.saucedemo.com',
  apiBaseUrl: () => 'https://jsonplaceholder.typicode.com',
  defaultHeaders: { Accept: 'application/json' },
  pages: {
    login: loginPage,
    inventory: inventoryPage,
    cart: cartPage,
  },
  auth: new ExampleAuth(() => client),
  createApiClient: (logger) => new ExampleApiClient(client, logger),
};

export default client;
