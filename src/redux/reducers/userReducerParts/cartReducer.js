import { USER_TYPES } from "../../types";

const initialState = null;

const validateCartItem = (item) => {
  if (typeof item !== "object") {
    throw new TypeError("The passed item must be an object.");
  }

  const itemRequiredFields = [
    "id",
    "count",
    "item_size",
    "type",
    "photo",
    "in_stock",
    "product_id",
    "name",
    "price",
  ];

  const missingFields = itemRequiredFields.filter(
    (field) => item[field] === undefined
  );

  if (missingFields.length) {
    throw new TypeError(
      `The passed item does not contain fields: ${missingFields.join(
        ", "
      )}.`
    );
  }

  return true;
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_TYPES.CART.UPLOAD:
      /**
       *
       * Uploads  fetched list of cart items into store.user.cart
       * Validate all items by validateCartItem method
       *
       * payload: [object]
       */
      try {
        action.payload.filter((item) => validateCartItem(item));
      } catch (err) {
        console.error(err);
        return state;
      }

      return Object.fromEntries(
        action.payload.map((item) => [
          item.id,
          { ...item, loading: false, error: null },
        ])
      );

    case USER_TYPES.CART.UPDATE:
      /**
       * Add or update the passed cartItem by id
       *
       * payload: object
       */

      try {
        validateCartItem(action.payload);
      } catch (err) {
        console.error(err);
        return state;
      }

      return {
        ...state,
        [action.payload.id]: {
          ...action.payload,
          loading: false,
          error: null,
        },
      };

    case USER_TYPES.CART.DELETE: {
      /**
       * Deletes item from store.user.cart by id.
       *
       * payload: {
       *     productId: string | number,
       *     type: string,
       *     size: string | null
       * }
       */

      if (!action.payload.productId && !action.payload.type) {
        throw new Error(
          `The passed payload may contain productId, type and size in some cases.`
        );
      }

      const itemEntry = Object.entries(state).filter(
        ([, value]) =>
          value.product_id == action.payload.productId &&
          value.type === action.payload.type &&
          value.item_size === action.payload.size
      )[0];

      if (!itemEntry) {
        throw new Error(
          `Item with passed fields ${action.payload} does not exist.`
        );
      }

      return Object.fromEntries(
        Object.entries(state).filter(([key]) => key !== itemEntry[0])
      );
    }

    case USER_TYPES.CART.CLEAR:
      /**
       * Clears store.user.cart.
       *
       */
      return initialState;

    case USER_TYPES.CART.START_FETCH:
      /**
       * Sets laoded field to true of cart item by id.
       *
       * payload: string | number
       */
      if (!state[action.payload]) {
        throw new Error(
          `Cart does not contain item by ${action.payload} ID.`
        );
      }

      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          loading: true,
        },
      };

    case USER_TYPES.CART.FINISH_FETCH:
      /**
       * Sets loading field to false of cart item by id.
       *
       * payload: string | number
       */

      if (!state[action.payload]) {
        throw new Error(
          `Cart does not contain item by ${action.payload} ID.`
        );
      }

      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          loading: true,
        },
      };

    case USER_TYPES.CART.SET_ERROR:
      /**
       * Sets error field of cart item by id.
       *
       * payload: {
       *  id: string | number,
       *  error: any
       * }
       */

      if (!action.payload.error && !action.payload.id) {
        throw new Error(
          "The payload must contain error and id fields."
        );
      }

      if (!state[action.payload.id]) {
        throw new Error(
          `Cart does not contain item by ${action.payload.id} ID.`
        );
      }

      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          loading: false,
          error: action.payload.error,
        },
      };

    default:
      return state;
  }
};
