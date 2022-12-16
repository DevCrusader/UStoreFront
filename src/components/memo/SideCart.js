import React, { memo, useEffect, useState } from "react";

import List from "../../utils/List";
import NumberWithUcoin from "../../utils/NumberWithUcoin";
import CartItem from "../CartItem";

import "../../static/css/sideCartStyles.css";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useFetchWithAuth from "../../hooks/useFetchWithAuth";
import { BACKEND_PATH } from "../../Consts";
import { uploadCart } from "../../redux/actions/userReducerDispatches/cartActions";

const _SideCart = () => {
  const [opened, setOpened] = useState(false);

  const cartItems = useSelector((state) => state.user.cart);
  const dispatch = useDispatch();

  const [fetchConfig, setFetchConfig] = useState(null);
  const { loading, error, data } = useFetchWithAuth(fetchConfig);

  useEffect(() => {
    if (data) dispatch(uploadCart(data));
  }, [data]);

  useEffect(() => {
    if (cartItems === null) {
      setFetchConfig({
        url: `${BACKEND_PATH}/store/cart/get/`,
      });
    }
  }, [cartItems]);

  return (
    <>
      <button
        className={`open-cart-btn ${opened ? "opened" : "closed"}`}
        onClick={() => setOpened(true)}
        style={
          cartItems && Object.keys(cartItems).length
            ? {}
            : { display: "none" }
        }
      >
        <span className="icon"></span>
        <span className="text">Корзина</span>
      </button>
      <div className={`side-cart ${opened ? "opened" : "closed"}`}>
        <div className="header">
          <button onClick={() => setOpened(false)}>
            <span className="text">Закрыть</span>
            <span className="icon"></span>
          </button>
        </div>
        <div className="main">
          {cartItems ? (
            <List
              data={Object.values(cartItems)}
              renderItem={(item) => <CartItem item={item} />}
              renderEmpty={
                <div style={{ textAlign: "center" }}>
                  Корзина пуста
                </div>
              }
              listClassName="cart-items-wrapper"
            />
          ) : (
            <>Корзина пуста</>
          )}
          {loading && <div className="lds-dual-ring"></div>}
          {error && (
            <div
              className="error"
              style={{ color: "red", fontSize: ".9em" }}
            >
              {JSON.stringify(error)}
            </div>
          )}
        </div>
        <div className="footer">
          <span>
            Итого:{" "}
            <NumberWithUcoin
              number={
                cartItems
                  ? Object.entries(cartItems).reduce(
                      (accumulator, [, item]) =>
                        accumulator + item.price * item.count,
                      0
                    )
                  : 0
              }
            />
          </span>

          <Link to={"/confirm"}>Оформить заказ</Link>
        </div>
      </div>
    </>
  );
};

const SideCart = memo(_SideCart);

export default SideCart;
