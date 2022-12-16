import { USER_TYPES } from "../../types";

const initialState = null;

export const tokensReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_TYPES.TOKENS.SET:
      if (typeof action.payload !== "object") {
        throw new TypeError(
          `The passed payload must be an object, ${typeof action.payload} instead.`
        );
      }

      if (typeof action.payload.access !== "string") {
        throw new TypeError(
          `The passed accessToken must be a string, ${typeof action
            .payload.access} instead.`
        );
      }

      if (typeof action.payload.refresh !== "string") {
        throw new TypeError(
          `The passed refreshToken must be a string, ${typeof action
            .payload.refresh} instead.`
        );
      }

      if (Object.keys(action).length !== 2) {
        throw new Error(
          `The passed payload can contains only access and refresh fields.`
        );
      }

      return {
        ...action.payload,
      };

    case USER_TYPES.TOKENS.CLEAR:
      return initialState;

    default:
      return state;
  }
};
