import { STORE_TYPES } from "../../types";

export function startProductFetch(productId) {
  if (typeof productId !== "number" && isNaN(productId)) {
    throw new TypeError(
      `The passed productId must be a number, get ${typeof productId} instead.`
    );
  }

  return {
    type: STORE_TYPES.PRODUCTS.START_FETCH,
    payload: Number(productId),
  };
}

export function addProductInfo(productId, product) {
  if (typeof productId !== "number" && isNaN(productId)) {
    throw new TypeError(
      `The passed productId must be a number, get ${typeof productId} instead.`
    );
  }

  if (typeof product !== "object" || !product) {
    throw new TypeError(
      `the passed product must be an object, get ${typeof product} instead.`
    );
  }

  return {
    type: STORE_TYPES.PRODUCTS.ADD_INFO,
    payload: {
      id: Number(productId),
      product,
    },
  };
}

export function finishProductFetch(productId) {
  if (typeof productId !== "number" && isNaN(productId)) {
    throw new TypeError(
      `The passed productId must be a number, get ${typeof productId} instead.`
    );
  }

  return {
    type: STORE_TYPES.PRODUCTS.FINISH_FETCH,
    payload: productId,
  };
}

export function setProductError(productId, error) {
  if (typeof productId !== "number" && isNaN(productId)) {
    throw new TypeError(
      `The passed productId must be a number, get ${typeof productId} instead.`
    );
  }

  return {
    type: STORE_TYPES.PRODUCTS.SET_ERROR,
    payload: {
      id: Number(productId),
      error,
    },
  };
}

export function deleteProduct(productId) {
  if (typeof productId !== "number" && isNaN(productId)) {
    throw new TypeError(
      `The passed productId must be a number, get ${typeof productId} instead.`
    );
  }

  return {
    type: STORE_TYPES.PRODUCTS.DELETE,
    payload: Number(productId),
  };
}

export function clearProductList() {
  return {
    type: STORE_TYPES.PRODUCTS.CLEAR,
  };
}
