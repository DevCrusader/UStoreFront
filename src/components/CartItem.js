import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  BACKEND_PATH,
  CART_COUNT_ACTION,
  FETCH_METHOD,
} from "../Consts";

import "../static/css/cartItemStyles.css";
import { Link } from "react-router-dom";
import NumberWithUcoin from "../utils/NumberWithUcoin";
import useFetchWithAuth from "../hooks/useFetchWithAuth";
import { useDispatch } from "react-redux";
import {
  deleteCartItem,
  setErrorCartItem,
  startFetchCartItem,
  updateUserCart,
} from "../redux/actions/userReducerDispatches/cartActions";

const CartItem = ({ item }) => {
  if (!item || (item && !Object.keys(item).length)) {
    return <div>Nothing to see.</div>;
  }

  if (!item) {
    return <div>Current cart item does not exist.</div>;
  }

  const dispatch = useDispatch();

  const [fetchConfig, setFetchConfig] = useState({});
  const { loading, error, data } = useFetchWithAuth(fetchConfig);

  const deleteItem = (cartItemId) => {
    if (
      typeof cartItemId !== "number" &&
      typeof cartItemId !== "string"
    ) {
      throw new TypeError(
        `CartItemId must be a number or a string, ${typeof cartItemId} instead.`
      );
    }

    setFetchConfig({
      url: `${BACKEND_PATH}/store/cart/manage/${cartItemId}/`,
      method: FETCH_METHOD.DELETE,
    });
  };

  const changeItemCount = (cartItemId, action) => {
    console.log("Start change cartItem");
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

    setFetchConfig({
      url: `${BACKEND_PATH}/store/cart/manage/${cartItemId}/`,
      method: FETCH_METHOD.POST,
      data: {
        action,
      },
    });
  };

  useEffect(() => {
    if (loading) dispatch(startFetchCartItem(item.id));
  }, [loading]);

  useEffect(() => {
    if (error) dispatch(setErrorCartItem(item.id, error));
  }, [error]);

  useEffect(() => {
    if (data) {
      if (data.id) {
        dispatch(updateUserCart(data));
      } else {
        dispatch(deleteCartItem(data));
      }
    }
  }, [data]);

  return (
    <div className="cart-item">
      <div className="item__photo">
        <img
          src={`${BACKEND_PATH}/media/images/${item.photo}`}
          alt="Фото товара"
        />
      </div>
      <div className="item__info">
        <Link
          className="pure"
          to={`/product?productId=${item.product_id}&type=${item.type}`}
        >
          {item.name}
        </Link>
        {item.item_size && <span>Размер: {item.item_size}</span>}
        <NumberWithUcoin number={item.price} />
        <div className="count-manage">
          <button
            onClick={() =>
              changeItemCount(item.id, CART_COUNT_ACTION.REMOVE)
            }
            disabled={item.count === 1 || item.error || item.loading}
            className="decrease-btn"
          >
            −
          </button>
          <span className="count">{item.count}</span>
          <button
            onClick={() =>
              changeItemCount(item.id, CART_COUNT_ACTION.ADD)
            }
            disabled={item.count === 10 || item.error || item.loading}
            className="increase-btn"
          >
            +
          </button>
        </div>
      </div>
      <div className="item__delete">
        <button
          onClick={() => deleteItem(item.id)}
          disabled={item.error || item.loading}
        ></button>
        {item && item.loading && (
          <div
            className="lds-dual-ring"
            style={{ width: "100%" }}
          ></div>
        )}
      </div>
      {item && item.error && (
        <div className="error">{JSON.stringify(item.error)}</div>
      )}
    </div>
  );
};

CartItem.propTypes = {
  item: PropTypes.object.isRequired,
};

export default CartItem;
