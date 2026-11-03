import { ApiResponse, BaseApiClient } from '@core/api/BaseApiClient';

// Response shapes as observed on api.practicesoftwaretesting.com (sprint5). Only the fields tests rely on
// are listed as required; the API returns a few more (see GET /api/documentation).

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface Address {
  street: string;
  house_number: string | null;
  city: string;
  state: string | null;
  country: string;
  postal_code: string | null;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  dob: string | null;
  address: Address;
  totp_enabled: boolean;
  created_at: string;
}

export interface ProductImage {
  id: string;
  title: string;
  file_name: string;
  by_name: string;
  by_url: string;
  source_name: string;
  source_url: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string | null;
}

export interface Brand {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  in_stock: boolean;
  is_rental: boolean;
  is_eco_friendly: boolean;
  is_location_offer: boolean;
  co2_rating: string;
  product_image: ProductImage;
  category: Category;
  brand: Brand;
}

export interface ProductSpec {
  id: string;
  product_id: string;
  spec_name: string;
  spec_value: string;
  spec_unit: string | null;
}

export interface ProductDetail extends Product {
  specs: ProductSpec[];
}

/** Laravel-style page: GET /products and GET /products/search return 9 items per page. */
export interface Paginated<T> {
  current_page: number;
  data: T[];
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

export class ToolshopApiClient extends BaseApiClient {
  login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return this.post<LoginResponse>('/users/login', { email, password }, { withStatus: true });
  }

  getMe(): Promise<ApiResponse<User>> {
    return this.get<User>('/users/me', { withStatus: true });
  }

  getProducts(page = 1): Promise<ApiResponse<Paginated<Product>>> {
    return this.get<Paginated<Product>>('/products', { params: { page }, withStatus: true });
  }

  getProduct(id: string): Promise<ApiResponse<ProductDetail>> {
    return this.get<ProductDetail>(`/products/${id}`, { withStatus: true });
  }

  searchProducts(query: string): Promise<ApiResponse<Paginated<Product>>> {
    return this.get<Paginated<Product>>('/products/search', { params: { q: query }, withStatus: true });
  }
}
