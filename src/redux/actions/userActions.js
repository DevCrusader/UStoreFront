import axios from "axios";
import { BACKEND_PATH, CART_COUNT_ACTION } from "../../Consts";
// import {
//   setErrorCart,
//   startFetchCart,
//   uploadCart,
//   addCartItem,
//   setErrorCartItem,
//   startFetchCartItem,
//   updateCartItem,
//   deleteCartItem,
// } from "./userReducerDispatches/cartActions";
import {
  clearUserInfo,
  setUserError,
  setUserInfo,
} from "./userReducerDispatches/userInfoActions";
import {
  clearUserTokens,
  setUserTokens,
} from "./userReducerDispatches/tokensActions";
import {
  clearUserCart,
  deleteCartItem,
  updateUserCart,
  uploadCart,
} from "./userReducerDispatches/cartActions";

export const setUserInStore = (info, tokens) => {
  return async (dispatch) => {
    dispatch(setUserInfo(info));
    dispatch(setUserTokens(tokens));
  };
};

export const fetchUserCart = ({ headers }) => {
  if (typeof headers !== "object") {
    throw new TypeError(
      `The passed headers must be an object, ${typeof headers} instead.`
    );
  }

  if (!headers["Authorization"] || !headers["Content-Type"]) {
    throw new Error(
      'The passed headers object must contain "Authorization" and "Content-Type" fields.'
    );
  }

  return async (dispatch) => {
    // FIXME: remove timeout
    setTimeout(
      () =>
        axios
          .get(`${BACKEND_PATH}/store/cart/get/`, {
            headers,
          })
          .then((res) => {
            console.log(res.data);
            dispatch(uploadCart(res.data));
          })
          .catch((err) => {
            if (err.response.status === 401) {
              dispatch(setUserError(err.message));
            }
          }),
      2000
    );
  };
};

export const fetchAddCartItem = ({
  productId,
  type,
  size,
  headers,
}) => {
  if (typeof headers !== "object") {
    throw new TypeError(
      `The passed headers must be an object, ${typeof headers} instead.`
    );
  }

  if (!headers["Authorization"] || !headers["Content-Type"]) {
    throw new Error(
      'The passed headers object must contain "Authorization" and "Content-Type" fields.'
    );
  }

  if (!productId || !type) {
    throw new Error("ProductId and type is required.");
  }

  return async (dispatch) => {
    axios
      .post(
        `${BACKEND_PATH}/store/cart/add/`,
        {
          productId,
          type,
          size,
        },
        {
          headers,
        }
      )
      .then((res) => dispatch(updateUserCart(res.data)))
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(setUserError(err.message));
        }
      });
  };
};

export const changeCartItem = ({ cartItemId, action, headers }) => {
  if (typeof headers !== "object") {
    throw new TypeError(
      `The passed headers must be an object, ${typeof headers} instead.`
    );
  }

  if (!headers["Authorization"] || !headers["Content-Type"]) {
    throw new Error(
      'The passed headers object must contain "Authorization" and "Content-Type" fields.'
    );
  }

  if (
    typeof cartItemId !== "number" &&
    typeof cartItemId !== "string"
  ) {
    throw new TypeError(
      `CartItemId must be a number or a string, ${typeof cartItemId} instead.`
    );
  }

  if (!Object.values(CART_COUNT_ACTION).includes(action)) {
    throw new TypeError(
      `Action must be "add" or "remove", ${action} instead.`
    );
  }

  return async (dispatch) => {
    axios
      .post(
        `${BACKEND_PATH}/store/cart/manage/${cartItemId}/`,
        { action },
        { headers }
      )
      .then((res) => dispatch(updateUserCart(cartItemId, res.data)))
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(setUserError(err.message));
        } else {
          console.log("IUQGWIO", err);
        }
      });
  };
};

export const fetchDeleteCartItem = ({ cartItemId, headers }) => {
  if (typeof headers !== "object") {
    throw new TypeError(
      `The passed headers must be an object, ${typeof headers} instead.`
    );
  }

  if (!headers["Authorization"] || !headers["Content-Type"]) {
    throw new Error(
      'The passed headers object must contain "Authorization" and "Content-Type" fields.'
    );
  }

  if (
    typeof cartItemId !== "number" &&
    typeof cartItemId !== "string"
  ) {
    throw new TypeError(
      `CartItemId must be a number or a string, ${typeof cartItemId} instead.`
    );
  }

  return async (dispatch) => {
    axios
      .delete(`${BACKEND_PATH}/store/cart/manage/${cartItemId}/`, {
        headers,
      })
      .then(() => dispatch(deleteCartItem(cartItemId)))
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(setUserError(err.message));
        }
      });
  };
};

export const clearUserData = () => {
  return async (dispatch) => {
    dispatch(clearUserInfo());
    dispatch(clearUserTokens());
    dispatch(clearUserCart());
  };
};
