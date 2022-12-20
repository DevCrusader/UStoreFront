import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import UpdateBalanceComponent from "../../components/UpdateBalanceComponent";
import { clearUserCart } from "../../redux/actions/userReducerDispatches/cartActions";

import "../../static/css/orderStyles.css";
import List from "../../utils/List";

const Order = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearUserCart());
  }, []);

  useEffect(() => {
    console.log(state);
  }, []);

  return (
    <>
      <UpdateBalanceComponent />

      <div className="container order-wrapper">
        <img
          className="decoration"
          src={
            require("../../static/svg/OrderDecoration.svg").default
          }
          alt="Декорация заказа"
        />
        <div className="order-info">
          <header>
            Заказ #
            {state && state.orderInfo && state.orderInfo.id
              ? state.orderInfo.id
              : "ID"}
            <br /> успешно оформлен
          </header>

          <div className="main">
            <img
              className="icon address col-1"
              src={
                require("../../static/svg/AdminAddressIcon.svg")
                  .default
              }
              alt="Адрес"
            />
            <span className="address col-2">
              {state && state.orderInfo && state.orderInfo.address
                ? state.orderInfo.address
                : "Адресс заказа"}
            </span>

            <img
              className="icon date col-1"
              src={
                require("../../static/svg/AdminDateIcon.svg").default
              }
              alt="Адрес"
            />
            <span className="date col-2">
              {(state &&
              state.orderInfo &&
              state.orderInfo.created_date
                ? new Date(state.orderInfo.created_date)
                : new Date()
              ).toLocaleDateString("ru-Ru", {
                year: "numeric",
                month: "long",
                day: "2-digit",
              })}
            </span>

            <List
              data={
                state && state.orderInfo && state.orderInfo.products
                  ? [
                      ...new Set(
                        state.orderInfo.products.map((item) =>
                          [
                            item.name,
                            item.type,
                            item.item_size ? item.item_size : "",
                            item.count,
                            "шт.",
                          ].join(" ")
                        )
                      ),
                    ]
                  : ["Товар 1", "Товар 2", "Товар 3"]
              }
              renderItem={(item) => <>{item}</>}
              listClassName="col-2 products"
            />
          </div>

          <Link to="/store">Вернуться в магазин</Link>
        </div>
      </div>
    </>
  );
};

export default Order;
