import { useMemo } from "react";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector, Provider } from "react-redux";
import globalReducer from "@/state";
import productsReducer from "@/state/productSlice";

/* REDUX STORE */
const rootReducer = combineReducers({
  global: globalReducer,
  products: productsReducer,
});

const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

/* REDUX TYPES */
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/* PROVIDER */
export default function StoreProvider({ children }: { children: React.ReactNode }) {
  // Ensure store is created only once
  const store = useMemo(() => makeStore(), []);

  return <Provider store={store}>{children}</Provider>;
}





