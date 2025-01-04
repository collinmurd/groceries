import { IFeature, IItem } from "@groceries/shared";

export class GroceriesApiError extends Error {
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

async function call(method: HttpMethod, path: string, body: any = null) {
  var headers = new Headers();
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
      if (!resp.ok) {
        throw new GroceriesApiError(resp.statusText)
      }
      return resp
    })
    .then(resp => resp.status != 204 ? resp.json() : "")
    .catch(err => {throw new GroceriesApiError(err)});
}

export async function getItems(): Promise<IItem[]> {
  return call('GET', '/items');
}

export async function createItem(item: IItem): Promise<IItem> {
  const { id, ...data} = item;
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