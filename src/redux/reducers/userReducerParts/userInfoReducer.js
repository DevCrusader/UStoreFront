import { USER_TYPES } from "../../types";

const initialState = {
  error: null,
};

export const userInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_TYPES.INFO.SET:
      return {
        ...action.payload,
        error: null,
      };

    case USER_TYPES.INFO.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case USER_TYPES.INFO.INFO:
      return {
        ...initialState,
      };

    default:
      return state;
  }
};
