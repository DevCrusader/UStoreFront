import {
  clearUserInfo,
  setUserInfo,
} from "./userReducerDispatches/userInfoActions";
import {
  clearUserTokens,
  setUserTokens,
} from "./userReducerDispatches/tokensActions";
import { clearUserCart } from "./userReducerDispatches/cartActions";

export const setUserInStore = (info, tokens) => {
  return async (dispatch) => {
    dispatch(setUserInfo(info));
    dispatch(setUserTokens(tokens));
  };
};

export const clearUserData = () => {
  return async (dispatch) => {
    dispatch(clearUserInfo());
    dispatch(clearUserTokens());
    dispatch(clearUserCart());
  };
};
