import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { BACKEND_PATH, FETCH_METHOD } from "../Consts";
import List from "../utils/List";
import useFetchWithAuth from "../hooks/useFetchWithAuth";

const OrderCardAdmin = ({ order }) => {
  const orderStateTypes = {
    ACCEPTED: "Accepted",
    COMPLETED: "Completed",
    CANCELED: "Canceled",
  };

  const [fetchConfig, setFetchConfig] = useState({});
  const { loading, error, data } = useFetchWithAuth(fetchConfig);

  const [orderInfo, setOrderInfo] = useState(order);
  const [cancellationView, setCancellationView] = useState(false);

  const returnToAccepted = useRef(false);

  const changeOrderState = (state = orderStateTypes.ACCEPTED) => {
    setFetchConfig({
      url: `${BACKEND_PATH}/user/admin/order/${order.id}/state/`,
      method: FETCH_METHOD.POST,
      data: {
        state,
      },
    });
  };

  const cancelOrder = async (e) => {
    e.preventDefault();

    const { ["cancellation-reason"]: comment } = e.target;

    setCancellationView(false);

    setFetchConfig({
      url: `${BACKEND_PATH}/user/admin/order/${order.id}/cancel/`,
      method: FETCH_METHOD.POST,
      data: {
        comment: comment.value,
      },
    });
  };

  useEffect(() => {
    if (data) {
      returnToAccepted.current =
        data.state !== orderStateTypes.ACCEPTED;

      setOrderInfo({ ...data });
    }
  }, [data]);

  const orderHeader = ({
    id,
    created_date,
    customer_name,
    address,
  }) => {
    return (
      <div className="order-header">
        <div className="order-info">
          <span className="name">Заказ #{id}</span>
          <span className="date">
            {new Date(created_date)?.toLocaleDateString("ru-Ru", {
              year: "2-digit",
              month: "2-digit",
              day: "2-digit",
            })}
          </span>
        </div>

        <div className="order-customer-info">
          <span className="col-1">
            <span
              className="scrollable"
              style={{
                "--text-length": `${
                  customer_name ? customer_name.length * 0.5 : 0
                }em`,
              }}
            >
              {customer_name}
            </span>
          </span>
          <span className="icon col-2">
            <img
              src={require("../static/svg/AdminUserIcon.svg").default}
              alt="user"
            />
          </span>
          <span className="col-1">
            <span
              className="scrollable"
              style={{
                "--text-length": `${
                  address ? address.length * 0.5 : 0
                }em`,
              }}
            >
              {address}
            </span>
          </span>
          <span className="icon col-2">
            <img
              src={
                require("../static/svg/AdminAddressIcon.svg").default
              }
              alt="user"
            />
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={`order-item general`}>
        {orderHeader(orderInfo)}
        <List
          data={orderInfo.products}
          renderItem={(item) => (
            <>
              <img
                src={`${BACKEND_PATH}/media/images/${item.photo}`}
                alt={item.name}
              />
              <div className="product-info">
                <span>{item.collection_name}</span>
                <span>{item.name}</span>
                <span>
                  {item.type} {item.item_size}
                </span>
              </div>
              <span
                style={{ width: "3em", textAlign: "end" }}
              >{`${item.count} шт.`}</span>
            </>
          )}
          listClassName="order-products"
        />
        <footer>
          {loading ? (
            <div
              className="loading lds-dual-ring"
              style={{ width: "80px" }}
            ></div>
          ) : error ? (
            <div className="error">{JSON.stringify(error)}</div>
          ) : orderInfo &&
            orderInfo.state !== orderStateTypes.ACCEPTED ? (
            <div className="order-unchanged-state">
              {orderInfo.state === orderStateTypes.COMPLETED
                ? "Заказ выдан"
                : orderInfo.state === orderStateTypes.CANCELED
                ? "Заказ был отменён"
                : "С заказом произошло что-то непонятное."}
            </div>
          ) : (
            <>
              <button
                className="complete"
                disabled={
                  error ||
                  loading ||
                  orderInfo.state !== orderStateTypes.ACCEPTED ||
                  cancellationView
                }
                onClick={() =>
                  changeOrderState(orderStateTypes.COMPLETED)
                }
              >
                Заказ выдан
              </button>
              <button
                disabled={
                  error ||
                  loading ||
                  orderInfo.state !== orderStateTypes.ACCEPTED ||
                  cancellationView
                }
                onClick={() => setCancellationView(true)}
                className="danger"
              >
                Отменить заказ
              </button>
            </>
          )}
        </footer>
      </div>

      <div
        className={`action-cancellation order-item abs ${
          orderInfo &&
          orderInfo.state === orderStateTypes.COMPLETED &&
          returnToAccepted.current
            ? "visible"
            : "unvisible"
        }`}
      >
        {orderHeader(orderInfo)}
        <div
          className="order-state"
          style={{
            textAlign: "center",
          }}
        >
          {orderInfo
            ? orderInfo.state === orderStateTypes.ACCEPTED
              ? "Заказ в рассмотрении"
              : orderInfo.state === orderStateTypes.COMPLETED
              ? "Заказ передан"
              : orderInfo.state === orderStateTypes.CANCELED
              ? "Заказ отменён"
              : "Отмена последнего действия"
            : "Отмена последнего действия"}
        </div>

        <div
          className="warning"
          style={{
            textAlign: "center",
            color: "var(--admin-additional-color)",
          }}
        >
          После обновления страницы не будет возможности отменить
          действие. Заказ будет отмечен соответствующим состоянием.
        </div>

        <footer>
          {loading ? (
            <div
              className="loading lds-dual-ring"
              style={{ width: "80px", "--loader-color": "gray" }}
            ></div>
          ) : error ? (
            <div className="error">{JSON.stringify(error)}</div>
          ) : (
            <button
              className="close"
              onClick={() =>
                changeOrderState(orderStateTypes.ACCEPTED)
              }
            >
              Отменить действие
            </button>
          )}
        </footer>
      </div>

      <div
        className={`order-item order-cancellation abs ${
          cancellationView ? "visible" : "unvisible"
        }`}
      >
        <form onSubmit={cancelOrder}>
          <div className="body">
            <div
              className="action-state"
              style={{ textAlign: "center", color: "#713737" }}
            >
              Отклонение заказа #{orderInfo.id}
            </div>
            <textarea
              type="text"
              name="cancellation-reason"
              required
              placeholder="Напишите причину отклонения заказа."
              rows={8}
              maxLength={200}
            />
          </div>
          <footer>
            <button className="warning" type={"submit"}>
              Отменить заказ
            </button>
            <button
              className="close"
              onClick={() => setCancellationView(false)}
              type={"button"}
            >
              Закрыть окно
            </button>
          </footer>
        </form>
      </div>
    </>
  );
};

OrderCardAdmin.propTypes = {
  order: PropTypes.object.isRequired,
};

export default OrderCardAdmin;
