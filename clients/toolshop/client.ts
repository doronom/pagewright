import { ClientDefinition } from '@core/client/ClientDefinition';
import { ToolshopApiClient } from './api/ToolshopApiClient';
import { ToolshopAuth } from './auth/ToolshopAuth';
import { accountPage } from './pages/AccountPage.config';
import { cartPage } from './pages/CartPage.config';
import { loginPage } from './pages/LoginPage.config';
import { productDetailPage } from './pages/ProductDetailPage.config';
import { productsPage } from './pages/ProductsPage.config';

const client: ClientDefinition = {
  name: 'toolshop',
  baseUrl: () => 'https://practicesoftwaretesting.com',
  apiBaseUrl: () => 'https://api.practicesoftwaretesting.com',
  defaultHeaders: { Accept: 'application/json' },
  pages: {
    login: loginPage,
    account: accountPage,
    products: productsPage,
    productDetail: productDetailPage,
    cart: cartPage,
  },
  auth: new ToolshopAuth(() => client),
  createApiClient: (logger) => new ToolshopApiClient(client, logger),
};

export default client;
