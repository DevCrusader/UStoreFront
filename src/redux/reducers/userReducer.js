import { combineReducers } from "redux";
import { cartReducer } from "./userReducerParts/cartReducer";
import { tokensReducer } from "./userReducerParts/tokensReducer";
import { userInfoReducer } from "./userReducerParts/userInfoReducer";

export const userReducer = combineReducers({
  info: userInfoReducer,
  tokens: tokensReducer,
  cart: cartReducer,
});
