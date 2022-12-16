import { USER_TYPES } from "../../types";

export const setUserTokens = (tokens) => {
  return {
    type: USER_TYPES.TOKENS.SET,
    payload: tokens,
  };
};

export const clearUserTokens = () => {
  return {
    type: USER_TYPES.TOKENS.CLEAR,
  };
};
