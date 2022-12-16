import { USER_TYPES } from "../../types";

export const uploadCart = (cartItems) => {
  if (!Array.isArray(cartItems)) {
    throw new TypeError(
      `The passed cartItems must be an array, ${typeof cartItems} instead.`
    );
  }

  if (cartItems.some((item) => typeof item !== "object")) {
    throw new TypeError(
      "The passed cartItems must be an array of objects."
    );
  }

  return {
    type: USER_TYPES.CART.UPLOAD,
    payload: cartItems,
  };
};

export const updateUserCart = (cartItem) => {
  if (typeof cartItem !== "object") {
    throw new TypeError(
      `The passed cartItem must be an object, ${typeof item} instead.`
    );
  }

  return {
    type: USER_TYPES.CART.UPDATE,
    payload: cartItem,
  };
};

export const deleteCartItem = ({
  product_id: productId,
  type,
  item_size: size,
}) => {
  return {
    type: USER_TYPES.CART.DELETE,
    payload: {
      productId,
      type,
      size,
    },
  };
};

export const clearUserCart = () => {
  return {
    type: USER_TYPES.CART.CLEAR,
  };
};

export const startFetchCartItem = (cartItemId) => {
  if (
    typeof cartItemId !== "string" &&
    typeof cartItemId !== "number"
  ) {
    throw new TypeError(
      `The passed cartItemId must be a string or a number, ${typeof cartItemId} instead.`
    );
  }

  return {
    type: USER_TYPES.CART.START_FETCH,
    payload: cartItemId,
  };
};

export const finishFetchCartItem = (cartItemId) => {
  if (
    typeof cartItemId !== "string" &&
    typeof cartItemId !== "number"
  ) {
    throw new TypeError(
      `The passed cartItemId must be a string or a number, ${typeof cartItemId} instead.`
    );
  }

  return {
    type: USER_TYPES.CART.FINISH_FETCH,
    payload: cartItemId,
  };
};

export const setErrorCartItem = (cartItemId, error) => {
  if (
    typeof cartItemId !== "string" &&
    typeof cartItemId !== "number"
  ) {
    throw new TypeError(
      `The passed cartItemId must be a string or a number, ${typeof cartItemId} instead.`
    );
  }

  return {
    type: USER_TYPES.CART.SET_ERROR,
    payload: {
      id: cartItemId,
      error,
    },
  };
};
