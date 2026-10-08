import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { ClientDefinition } from '../client/ClientDefinition';
import { testEnv } from '../env';
import { Logger } from '../Logger';
import { sleep } from '../RetryHelper';

export interface ApiResponse<T> {
  data: T;
  status: number;
}

export interface RequestOptions {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  withStatus?: boolean;
  expectError?: boolean;
}

type WithStatus = RequestOptions & ({ withStatus: true } | { expectError: true });
type RetryableConfig = InternalAxiosRequestConfig & { retryCount?: number };

const MAX_RETRIES = 3;
const RETRYABLE_CODES = ['ECONNRESET', 'ECONNABORTED'];
const SENSITIVE_HEADER = /authorization|token|secret|api-key|cookie/i;

export class BaseApiClient {
  protected readonly http: AxiosInstance;

  constructor(
    client: ClientDefinition,
    protected readonly logger: Logger,
  ) {
    if (!client.apiBaseUrl) {
      throw new Error(`Client "${client.name}" does not define apiBaseUrl`);
    }
    this.http = axios.create({
      baseURL: client.apiBaseUrl(testEnv),
      timeout: process.env.CI ? 90000 : 30000,
      headers: { 'Content-Type': 'application/json', ...client.defaultHeaders },
    });
    this.http.interceptors.request.use((config) => {
      this.logger.debug(this.toCurl(config));
      return config;
    });
    this.http.interceptors.response.use(undefined, (error: AxiosError) => this.retryRequest(error));
  }

  setAuthToken(token: string): void {
    this.http.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  get<T>(url: string, options: WithStatus): Promise<ApiResponse<T>>;
  get<T>(url: string, options?: RequestOptions): Promise<T>;
  get<T>(url: string, options?: RequestOptions): Promise<T | ApiResponse<T>> {
    return this.send<T>({ method: 'GET', url }, options);
  }

  post<T>(url: string, data: unknown, options: WithStatus): Promise<ApiResponse<T>>;
  post<T>(url: string, data: unknown, options?: RequestOptions): Promise<T>;
  post<T>(url: string, data: unknown, options?: RequestOptions): Promise<T | ApiResponse<T>> {
    return this.send<T>({ method: 'POST', url, data }, options);
  }

  put<T>(url: string, data: unknown, options: WithStatus): Promise<ApiResponse<T>>;
  put<T>(url: string, data: unknown, options?: RequestOptions): Promise<T>;
  put<T>(url: string, data: unknown, options?: RequestOptions): Promise<T | ApiResponse<T>> {
    return this.send<T>({ method: 'PUT', url, data }, options);
  }

  patch<T>(url: string, data: unknown, options: WithStatus): Promise<ApiResponse<T>>;
  patch<T>(url: string, data: unknown, options?: RequestOptions): Promise<T>;
  patch<T>(url: string, data: unknown, options?: RequestOptions): Promise<T | ApiResponse<T>> {
    return this.send<T>({ method: 'PATCH', url, data }, options);
  }

  delete<T>(url: string, options: WithStatus): Promise<ApiResponse<T>>;
  delete<T>(url: string, options?: RequestOptions): Promise<T>;
  delete<T>(url: string, options?: RequestOptions): Promise<T | ApiResponse<T>> {
    return this.send<T>({ method: 'DELETE', url }, options);
  }

  private async send<T>(
    config: AxiosRequestConfig,
    options: RequestOptions = {},
  ): Promise<T | ApiResponse<T>> {
    try {
      const response = await this.http.request<T>({
        ...config,
        params: options.params,
        headers: options.headers,
        ...(options.expectError && { validateStatus: () => true }),
      });
      this.logger.info(`${config.method} ${config.url} -> ${response.status}`);
      return options.withStatus || options.expectError
        ? { data: response.data, status: response.status }
        : response.data;
    } catch (error) {
      this.logError(error, config);
      throw error;
    }
  }

  private async retryRequest(error: AxiosError): Promise<unknown> {
    const config = error.config as RetryableConfig | undefined;
    const status = error.response?.status ?? 0;
    const retryable = status >= 500 || RETRYABLE_CODES.includes(error.code ?? '');
    if (!config || !retryable || (config.retryCount ?? 0) >= MAX_RETRIES) {
      throw error;
    }
    config.retryCount = (config.retryCount ?? 0) + 1;
    const delay = Math.min(1000 * 2 ** config.retryCount, 10000);
    this.logger.warn(
      `${config.method?.toUpperCase()} ${config.url} retry ${config.retryCount}/${MAX_RETRIES} in ${delay}ms`,
    );
    await sleep(delay);
    return this.http.request(config);
  }

  private logError(error: unknown, config: AxiosRequestConfig): void {
    const details = axios.isAxiosError(error)
      ? {
          status: error.response?.status,
          code: error.code,
          data: error.response?.data,
          message: error.message,
        }
      : { message: String(error) };
    this.logger.error(JSON.stringify({ method: config.method, url: config.url, ...details }));
  }

  private toCurl(config: InternalAxiosRequestConfig): string {
    const url = axios.getUri(config);
    const headers = Object.entries(config.headers.toJSON())
      .map(([key, value]) => `-H "${key}: ${SENSITIVE_HEADER.test(key) ? this.mask(String(value)) : value}"`)
      .join(' ');
    const body = config.data
      ? ` -d '${typeof config.data === 'string' ? config.data : JSON.stringify(config.data)}'`
      : '';
    return `curl -X ${config.method?.toUpperCase()} "${url}" ${headers}${body}`;
  }

  private mask(value: string): string {
    return value.length <= 8 ? '****' : `${value.slice(0, 4)}****${value.slice(-4)}`;
  }
}
