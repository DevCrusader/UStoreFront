import { STORE_TYPES } from "../../types";

const initialState = null;

const _collectionInitialState = (collectionName) => ({
  name: collectionName,
  products: null,
});

export const collectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_TYPES.COLLECTIONS.UPLOAD:
      /**
       * Upload collectionList into store.store.collections object.
       *
       * payload: [ string ]
       *
       */
      return Object.fromEntries(
        action.payload.map((collection) => [
          collection,
          _collectionInitialState(collection),
        ])
      );

    case STORE_TYPES.COLLECTIONS.DELETE:
      /**
       * Delete collection from store.store.collections by passed name.
       *
       * payload: string
       *
       */
      return Object.fromEntries(
        Object.entries(state).filter(
          ([key]) => key !== action.payload
        )
      );

    case STORE_TYPES.COLLECTIONS.CLEAR:
      /**
       * Clear store.collections.
       *
       */
      return initialState;

    case STORE_TYPES.COLLECTIONS.SET_PRODUCTS:
      /**
       * Set list of product in colelction in store.store.colelctions by passed name.
       *
       * payload: {
       *    name: string
       *    products: [string]
       * }
       *
       */
      if (!state[action.payload.name]) {
        throw new Error(
          `CASE: COLLECTIONS-SET_PRODUCTS.
          Current state does not contain collection with passed name.`
        );
      }

      return {
        ...state,
        [action.payload.name]: {
          ...state[action.payload.name],
          products: action.payload.products,
          loaded: false,
          error: null,
        },
      };

    default:
      return state;
  }
};
