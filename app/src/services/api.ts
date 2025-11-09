import { IFeature, IItem, IngredientParserResult } from "@groceries/shared";

export class GroceriesApiError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export class GroceriesApiAuthError extends GroceriesApiError {
  constructor(msg: string) {
    super(msg);
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

function getUrl() {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8000';
  }
  return `${window.location.origin}/groceries/api`;
}

function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
}

async function call(method: HttpMethod, path: string, body: any = null) {
  var headers = new Headers();

  // Add auth header if token exists
  const token = getToken();
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  var opts: RequestInit = {
    method: method,
    headers: headers
  };

  if (body) {
    opts.body = JSON.stringify(body);
    headers.append('Content-Type', 'application/json');
  }

  return fetch(`${getUrl()}${path}`, opts)
    .then(resp => {
      if (resp.status === 401) {
        throw new GroceriesApiAuthError('Unauthorized');
      }
      if (!resp.ok) {
        throw new GroceriesApiError(resp.statusText)
      }
      return resp
    })
    .then(resp => resp.status != 204 ? resp.json() : "")
    .catch(err => {
      if (err instanceof GroceriesApiAuthError) {
        throw err;
      }
      throw new GroceriesApiError(err.message || 'API Error');
    });
}

export async function getItems(): Promise<IItem[]> {
  return call('GET', '/items');
}

export async function createItem(item: IItem): Promise<IItem> {
  const { id, ...data } = item;
  return call('POST', '/items', data);
}

export async function updateItem(item: IItem): Promise<IItem> {
  const { id, ...data } = item;
  return call('PUT', `/items/${item.id}`, data);
}

export async function deleteItem(item: IItem) {
  return call('DELETE', `/items/${item.id}`);
}

export async function batchDeleteItems(ids: string[]) {
  return call('POST', '/items:batchDelete', ids);
}

export async function getFeatures() {
  return call('GET', '/features');
}

export async function updateFeature(feature: IFeature) {
  const { id, ...data } = feature;
  return call('PUT', `/features/${feature.id}`, data);
}

export async function parseIngredientsWithText(recipeText: string): Promise<IngredientParserResult[]> {
  const response = await call('POST', '/ai/parse-ingredients', { recipeText });
  return response.items;
}

export async function parseIngredientsWithUrl(recipeUrl: string): Promise<IngredientParserResult[]> {
  const response = await call('POST', '/ai/parse-ingredients', { recipeUrl });
  return response.items;
}