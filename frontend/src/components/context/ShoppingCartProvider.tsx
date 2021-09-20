import { createContext, useContext, useReducer } from "react";
import {
  IShoppingCardProducts,
  shoppingCardReducer,
} from "./ShoppingCartReducer";

const ShoppingCardContext = createContext<IShoppingCardProducts[]>([]);
const ShoppingCardContextDispatch = createContext<any>({
  dispatch: () => null,
});

function ShopingCargProvider({ children }): JSX.Element {
  const [productsShopping, dispatch] = useReducer(shoppingCardReducer, []);

  return (
    <ShoppingCardContext.Provider value={productsShopping}>
      <ShoppingCardContextDispatch.Provider value={{ dispatch }}>
        {children}
      </ShoppingCardContextDispatch.Provider>
    </ShoppingCardContext.Provider>
  );
}

export const useShoppinCard = () => useContext(ShoppingCardContext);
export const useShoppinCardDispatch = () =>
  useContext(ShoppingCardContextDispatch);

export default ShopingCargProvider;
