import {
  ADD_PRODUCT_TO_SHOPPING_CART,
  DELETE_PRODUCTS_FROM_SHOPPING_CART,
  DELETE_PRODUCTS_WITH_STOCK_ZERO,
  DELETE_PRODUCT_FROM_SHOPPING_CART,
} from "./ShoppingCartActions";

export interface IShoppingCardProducts {
  id: string;
  name: string;
  units: number;
  price: string;
  image: string;
}

export function shoppingCardReducer(
  state: IShoppingCardProducts[],
  action: any
) {
  const { type, payload } = action;
  switch (type) {
    case ADD_PRODUCT_TO_SHOPPING_CART:
      const productSearchIndex = state.findIndex(
        (product) => product.id === payload.id
      );
      // if products exists add 1 unit
      if (productSearchIndex !== -1) {
        state[productSearchIndex].units++;
        return [...state];
      }
      return [...state, payload];
    case DELETE_PRODUCT_FROM_SHOPPING_CART:
      const products = state.filter((product) => product.id !== payload.id);
      return [...products];

    case DELETE_PRODUCTS_WITH_STOCK_ZERO:
      // if product with stock 0 is in state be remove
      const productsForBuy = state.filter(
        (product) => !payload.includes(product.id)
      );
      return [...productsForBuy];
    case DELETE_PRODUCTS_FROM_SHOPPING_CART:
      return [];
    default:
      return state;
  }
}
