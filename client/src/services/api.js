import { filterLocalProducts, getLocalProduct, getRelatedProducts } from '../data/products.js';

const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
const TOKEN_KEY = 'shopvista_token';

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable — session-only auth still works */
  }
};

async function request(path, { method = 'GET', body, auth = false, timeout = 9000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const headers = { Accept: 'application/json' };

  if (body) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      throw new ApiError(
        data?.message || `Request failed with status ${response.status}`,
        response.status,
      );
    }
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new ApiError('The request timed out. Please try again.', 0);
    }
    if (error instanceof ApiError) throw error;
    throw new ApiError('Could not reach the ShopVista API.', 0);
  } finally {
    clearTimeout(timer);
  }
}

const toQuery = (params) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 0) {
      query.set(key, value);
    }
  });
  return query.toString();
};

/**
 * Product data comes from the REST API when available. If the API is offline
 * the shared catalog is used so the storefront keeps working.
 */
export async function fetchProducts(params = {}) {
  try {
    const data = await request(`/products?${toQuery(params)}`, { timeout: 4500 });
    return {
      products: data.products ?? [],
      total: data.total ?? data.products?.length ?? 0,
      source: 'api',
    };
  } catch (error) {
    const all = filterLocalProducts({ ...params, limit: 0 });
    return {
      products: params.limit ? all.slice(0, Number(params.limit)) : all,
      total: all.length,
      source: 'local',
      error,
    };
  }
}

export async function fetchProduct(slug) {
  try {
    const data = await request(`/products/${encodeURIComponent(slug)}`, { timeout: 4500 });
    return { product: data.product, related: data.related ?? [], source: 'api' };
  } catch (error) {
    const product = getLocalProduct(slug);
    if (!product) throw new ApiError('We could not find that product.', 404);
    return {
      product,
      related: getRelatedProducts(product, 4),
      source: 'local',
      error,
    };
  }
}

export async function fetchCategories() {
  try {
    const data = await request('/products/categories', { timeout: 4000 });
    return { categories: data.categories ?? [], source: 'api' };
  } catch {
    return { categories: null, source: 'local' };
  }
}

export const registerUser = (payload) =>
  request('/auth/register', { method: 'POST', body: payload });

export const loginUser = (payload) =>
  request('/auth/login', { method: 'POST', body: payload });

export const fetchMe = () => request('/auth/me', { auth: true });

export const createOrder = (payload) =>
  request('/orders', { method: 'POST', body: payload, auth: true });

export const fetchMyOrders = () => request('/orders/mine', { auth: true });

export { request as apiRequest };
