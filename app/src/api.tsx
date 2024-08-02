import IItemDto from "@groceries/shared";

const GROCERIES_API_URL = "http://localhost:8000"

export class GroceriesApiError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export async function getItems(): Promise<IItemDto[]> {
  return fetch(`${GROCERIES_API_URL}/items`)
    .then(resp => {
      if (!resp.ok) {
        throw new GroceriesApiError(resp.statusText)
      }
      return resp
    })
    .then(resp => resp.json())
    .catch(err => {throw new GroceriesApiError(err)})
}