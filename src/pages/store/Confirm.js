import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CartItem from "../../components/CartItem";

import "../../static/css/confirmPageStyles.css";
import List from "../../utils/List";
import PropTypes from "prop-types";
import {
  BACKEND_PATH,
  FETCH_METHOD,
  OFFICE_ADDRESSES,
  PAYMENT_METHOD,
} from "../../Consts";
import NumberWithUcoin from "../../utils/NumberWithUcoin";
import { Link, useNavigate } from "react-router-dom";
import RadioWithAnotherAnswer from "../../utils/RadioWithAnotherAnswer";
import useFetchWithAuth from "../../hooks/useFetchWithAuth";
import { uploadCart } from "../../redux/actions/userReducerDispatches/cartActions";

const Confirm = () => {
  const cart = useSelector((state) => state.user.cart);
  const dispatch = useDispatch();

  const [fetchConfig, setFetchConfig] = useState(null);
  const { loading, error, data } = useFetchWithAuth(fetchConfig);

  useEffect(() => {
    if (data) dispatch(uploadCart(data));
  }, [data]);

  useEffect(() => {
    setFetchConfig({
      url: `${BACKEND_PATH}/store/cart/get/`,
    });
  }, []);

  return (
    <div className="confirm-page container">
      {loading || !cart ? (
        <div className="cart-wrapper loading">
          <div className="cart-item-moki">
            <div
              className="lds-dual-ring"
              style={{ width: "50px", "--loader-color": "gray" }}
            ></div>
          </div>
          <div className="cart-item-moki">
            <div
              className="lds-dual-ring"
              style={{ width: "50px", "--loader-color": "gray" }}
            ></div>
          </div>
          <div className="cart-item-moki">
            <div
              className="lds-dual-ring"
              style={{ width: "50px", "--loader-color": "gray" }}
            ></div>
          </div>
        </div>
      ) : error ? (
        <></>
      ) : (
        <List
          data={cart ? Object.values(cart) : []}
          renderItem={(item) => <CartItem item={item} />}
          listClassName="cart-wrapper"
        />
      )}
      <FormComponent
        totalCount={
          cart
            ? Object.values(cart).reduce(
                (accumulator, item) =>
                  accumulator + item.price * item.count,
                0
              )
            : 0
        }
      />
    </div>
  );
};

const FormComponent = ({ totalCount }) => {
  const userBalance = useSelector((state) =>
    state.user.info?.balance ? state.user.info.balance : 0
  );

  const [fetchConfig, setFetchConfig] = useState({});
  const {
    loading,
    error,
    data: orderInfo,
  } = useFetchWithAuth(fetchConfig);

  const navigate = useNavigate();

  const submitForm = (e) => {
    e.preventDefault();

    const { address, paymentMethod } = e.target;

    setFetchConfig({
      url: `${BACKEND_PATH}/user/customer/orders/create/`,
      method: FETCH_METHOD.POST,
      data: {
        address: address.value,
        paymentMethod: paymentMethod.value,
      },
    });
  };

  useEffect(() => {
    if (orderInfo) {
      navigate(`/order?orderId=${orderInfo.id}`, {
        state: {
          orderInfo,
        },
      });
    }
  }, [orderInfo]);

  return (
    <form onSubmit={submitForm} className="confirm-menu">
      <header>Оформление заказа</header>
      <RadioWithAnotherAnswer
        name="address"
        data={OFFICE_ADDRESSES}
        blockClassName="addresses-wrapper choice"
      />
      <List
        data={Object.entries(PAYMENT_METHOD)}
        renderItem={([key, value]) => (
          <label key={key}>
            <input
              type={"radio"}
              name="paymentMethod"
              value={value}
              id={value}
              defaultChecked={value === PAYMENT_METHOD.UCOINS}
            />
            {value}
          </label>
        )}
        listClassName={"payment-method-wrapper choice"}
      />

      <div className="order-price">
        <span>Суммма заказа: </span>
        <NumberWithUcoin number={totalCount} />
      </div>
      <div className="btns-wrapper">
        {loading ? (
          <div
            className="lds-dual-ring"
            style={{ width: "42px", marginBottom: "2em" }}
          ></div>
        ) : (
          <button
            type={"submit"}
            disabled={totalCount === 0 || userBalance < totalCount}
            data-disabled-reason={
              totalCount === 0
                ? "В вашей корзине нет товаров."
                : userBalance < totalCount
                ? "У вас недостаточно Ucoins."
                : ""
            }
          >
            Оформить заказ
          </button>
        )}

        <Link className="pure" to="/store">
          Вернуться в магазин
        </Link>
      </div>
      {error && (
        <div style={{ color: "red" }}>{JSON.stringify(error)}</div>
      )}
    </form>
  );
};

FormComponent.propTypes = {
  totalCount: PropTypes.number.isRequired,
};

export default Confirm;
