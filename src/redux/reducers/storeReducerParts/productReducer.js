import { STORE_TYPES } from "../../types";

const initialState = {};

export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    // case STORE_TYPES.PRODUCTS.START_FETCH:
    //   /**
    //    * Create object in store.store.products with the passed productId as key.
    //    * Set loading field to true and error to empty string.
    //    *
    //    * payload: number
    //    *
    //    */
    //   if (state[action.payload]) {
    //     throw new Error(
    //       `The product with passed id ${action.payload.id} already exist, try to update the item.`
    //     );
    //   }

    //   return {
    //     ...state,
    //     [action.payload]: {
    //       loading: true,
    //       error: null,
    //     },
    //   };

    case STORE_TYPES.PRODUCTS.ADD_INFO:
      /**
       * Adds info about product by the passed productId.
       *
       * payload: {
       *    id: number,
       *    product: object
       * }
       *
       */

      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload.product,
        },
      };

    // case STORE_TYPES.PRODUCTS.FINISH_FETCH:
    //   /**
    //    * Set loading field of the product to false.
    //    *
    //    * payload: number
    //    */
    //   if (state[action.payload]) {
    //     throw new Error(`The product with passed id ${action.payload.id}
    //     already exist, try to update the item.`);
    //   }

    //   return {
    //     ...state,
    //     [action.payload]: {
    //       ...state[action.payload],
    //       loading: false,
    //     },
    //   };

    case STORE_TYPES.PRODUCTS.SET_ERROR:
      /**
       * Sets error field of the product.
       *
       * payload: {
       *    id: number,
       *    error: any
       * }
       *
       */
      if (state[action.payload.id]) {
        throw new Error(`The product with passed id ${action.payload.id} 
          already exist, try to update the item.`);
      }

      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          loading: false,
          error: action.payload.error,
        },
      };

    case STORE_TYPES.PRODUCTS.DELETE:
      /**
       * Deletes the product from store.store.products by the passed productId.
       *
       * payload: number
       *
       */
      return Object.fromEntries(
        Object.entries(state).filter(([key]) => key != action.payload)
      );

    case STORE_TYPES.PRODUCTS.CLEAR:
      /**
       * Clear store.products
       */
      return {};

    default:
      return state;
  }
};
