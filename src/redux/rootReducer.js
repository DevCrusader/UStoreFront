import { combineReducers } from "redux";
import { storeReducer } from "./reducers/storeReducer";
import { userReducer } from "./reducers/userReducer";

export const rootReducer = combineReducers({
  store: storeReducer,
  user: userReducer,
});
