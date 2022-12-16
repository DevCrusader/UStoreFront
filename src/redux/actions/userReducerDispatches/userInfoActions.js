import { USER_TYPES } from "../../types";

export const setUserInfo = (info) => {
  return {
    type: USER_TYPES.INFO.SET,
    payload: info,
  };
};

export function setUserError(error) {
  return {
    type: USER_TYPES.INFO.SET_ERROR,
    payload: error,
  };
}

export const clearUserInfo = () => {
  return {
    type: USER_TYPES.INFO.CLEAR,
  };
};
