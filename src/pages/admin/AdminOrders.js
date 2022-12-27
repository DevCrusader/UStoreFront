import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BACKEND_PATH } from "../../Consts";
import useElementOnScreen from "../../hooks/useElementOnScreen";
import List from "../../utils/List";

import "../../static/css/adminOrdersStyles.css";
import OrderCardAdmin from "../../components/OrderCardAdmin";
import useFetchWithAuth from "../../hooks/useFetchWithAuth";

const AdminOrders = () => {
  return (
    <div className="admin-orders">
      <header>Управление заказами.</header>

      <FormComponent />
      <OrdersComponent />
    </div>
  );
};

export default AdminOrders;

const OrdersComponent = () => {
  const [fetchConfig, setFetchConfig] = useState({});
  const { loading, error, data } = useFetchWithAuth(fetchConfig);

  const ordersPerPageCount = 12;
  const { search } = useLocation();

  const [ordersList, setOrdersList] = useState(null);
  const fetchIsLastRef = useRef(false);

  const [containerRef, isVisible] = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: "0.5",
  });

  useEffect(() => {
    fetchIsLastRef.current = false;
    setOrdersList(null);
  }, [search]);

  useEffect(() => {
    if (!Array.isArray(ordersList)) {
      const searchParams = new URLSearchParams(search);
      searchParams.append("page", 1);
      searchParams.append("per-page", ordersPerPageCount);

      setFetchConfig({
        url: `${BACKEND_PATH}/user/admin/orders/?${searchParams.toString()}`,
      });
    }
  }, [ordersList]);

  useEffect(() => {
    if (
      isVisible &&
      Array.isArray(ordersList) &&
      !fetchIsLastRef.current
    ) {
      const searchParams = new URLSearchParams(search);
      searchParams.append(
        "page",
        Math.floor(ordersList.length / ordersPerPageCount) + 1
      );
      searchParams.append("per-page", ordersPerPageCount);

      setFetchConfig({
        url: `${BACKEND_PATH}/user/admin/orders/?${searchParams.toString()}`,
      });
    }
  }, [isVisible]);

  useEffect(() => {
    if (Array.isArray(data)) {
      fetchIsLastRef.current = data.length < ordersPerPageCount;

      if (Array.isArray(ordersList)) {
        setOrdersList([...ordersList, ...data]);
      } else {
        setOrdersList([...data]);
      }
    }
  }, [data]);

  return (
    <>
      {Array.isArray(ordersList) ? (
        <>
          <List
            data={ordersList}
            renderItem={(item) => <OrderCardAdmin order={item} />}
            renderEmpty={
              <div style={{ textAlign: "center" }}>
                Список искомых заказов пуст
              </div>
            }
            listClassName="orders-wrapper"
          />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              height: "100px",
            }}
          >
            {loading ? (
              <div
                className="lds-dual-ring"
                style={{ height: "80%" }}
              ></div>
            ) : error ? (
              <pre style={{ color: "red" }}>
                {JSON.stringify(error, null, 2)}
              </pre>
            ) : !fetchIsLastRef.current ? (
              <div
                className="lds-dual-ring additional-fetch"
                style={{ height: "80%" }}
                ref={containerRef}
              ></div>
            ) : (
              <div style={{ color: "#D9D9D9", margin: "30px 0" }}>
                Все заказы были загружены.
              </div>
            )}
          </div>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            height: "100px",
          }}
        >
          {loading ? (
            <div
              className="lds-dual-ring"
              style={{ height: "80%" }}
            ></div>
          ) : error ? (
            <pre style={{ color: "red" }}>
              {JSON.stringify(error, null, 2)}
            </pre>
          ) : (
            <div>Не удалось загрузить заказы.</div>
          )}
        </div>
      )}
    </>
  );
};

const FormComponent = () => {
  const navigate = useNavigate();

  const submitForm = (e) => {
    e.preventDefault();

    const { state, ordering } = e.target;

    const _search = new URLSearchParams();
    _search.append("state", state.value);
    _search.append("ordering", ordering.value);

    navigate(`/admin/orders?${_search.toString()}`);
  };

  return (
    <form onSubmit={submitForm} className="search-settings-form">
      <select name="state">
        <option value="Any">Все</option>
        <option value="Accepted">В ожидании</option>
        <option value="Completed">Выданные</option>
        <option value="Canceled">Отменённые</option>
      </select>

      <select className="ordering" name="ordering">
        <option value="desc">Сначала новые</option>
        <option value="acs">Сначала старые</option>
      </select>

      <button type={"submit"} className="complete">
        Показать
      </button>
    </form>
  );
};
