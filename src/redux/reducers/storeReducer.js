import { combineReducers } from "redux";
import { collectionReducer } from "./storeReducerParts/collectionReducer";
import { productReducer } from "./storeReducerParts/productReducer";

export const storeReducer = combineReducers({
  collections: collectionReducer,
  products: productReducer,
});
