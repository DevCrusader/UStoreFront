import { STORE_TYPES } from "../../types";

export function uploadCollection(collectionList) {
  if (!Array.isArray(collectionList)) {
    throw new TypeError("The passed collectioList must be an array.");
  }

  if (!collectionList.every((item) => typeof item === "string")) {
    throw new TypeError(
      "The passed collectionList must be an erray of string."
    );
  }

  if (!collectionList.length) {
    throw new Error(
      "The passed collectionList must contain at least one element."
    );
  }

  return {
    type: STORE_TYPES.COLLECTIONS.UPLOAD,
    payload: collectionList,
  };
}

export function deleteCollection(collectionName) {
  if (typeof collectionName !== "string") {
    throw new TypeError(
      `The passed collectionName must be a string, get ${typeof collectionName} instead.`
    );
  }

  return {
    type: STORE_TYPES.COLLECTIONS.DELETE,
    payload: collectionName,
  };
}

export function clearCollections() {
  return {
    type: STORE_TYPES.COLLECTIONS.CLEAR,
  };
}

export function setCollectionProducts(collectionName, productsList) {
  if (typeof collectionName !== "string") {
    throw new TypeError(
      `The passed collectionName must be a string, get ${typeof collectionName} instead.`
    );
  }

  if (!Array.isArray(productsList)) {
    throw new TypeError(
      `The passed productsList must be an array of objects.`
    );
  }

  if (!productsList.every((item) => typeof item === "object")) {
    throw new TypeError(
      `The passed productsList must be an array of objects.`
    );
  }

  return {
    type: STORE_TYPES.COLLECTIONS.SET_PRODUCTS,
    payload: {
      name: collectionName,
      products: productsList,
    },
  };
}
