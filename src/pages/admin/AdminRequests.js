import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RequestCardAdmin from "../../components/RequestCardAdmin";
import { BACKEND_PATH } from "../../Consts";
import useElementOnScreen from "../../hooks/useElementOnScreen";
import useFetchWithAuth from "../../hooks/useFetchWithAuth";
import List from "../../utils/List";

import "../../static/css/adminRequestsStyles.css";

const AdminRequests = () => {
  return (
    <div className="admin-requests">
      <header>Управление запросами на пополнение.</header>

      <FormComponent />
      <RequestsComponent />
    </div>
  );
};

export default AdminRequests;

const FormComponent = () => {
  const navigate = useNavigate();

  const submitForm = (e) => {
    e.preventDefault();

    const { state, ordering } = e.target;

    const _search = new URLSearchParams();
    _search.append("state", state.value);
    _search.append("ordering", ordering.value);

    navigate(`/admin/requests/?${_search.toString()}`);
  };

  return (
    <form className="search-settings-form" onSubmit={submitForm}>
      <select name="state">
        <option value="Any">Все</option>
        <option value="Accepted">Одобренные</option>
        <option value="Rejected">Отклонённые</option>
        <option value="Sent">На рассмотрении</option>
      </select>
      <select name="ordering">
        <option value="desc">Сначала новые</option>
        <option value="asc">Сначала старые</option>
      </select>
      <button type="submit" className="complete">
        Применить
      </button>
    </form>
  );
};

const RequestsComponent = () => {
  const requestsPerPageCount = 12;
  const { search } = useLocation();

  const [requestList, setRequestList] = useState(null);

  const [fetchConfig, setFetchConfig] = useState({});
  const { loading, error, data } = useFetchWithAuth(fetchConfig);

  const [containerRef, isVisible] = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: "0.5",
  });
  const fetchIsLastRef = useRef(false);

  useEffect(() => {
    fetchIsLastRef.current = false;
    setRequestList(null);
  }, [search]);

  useEffect(() => {
    if (!Array.isArray(requestList)) {
      const searchParams = new URLSearchParams(search);
      searchParams.append("page", 1);
      searchParams.append("per-page", requestsPerPageCount);

      setFetchConfig({
        url: `${BACKEND_PATH}/user/admin/requests/?${searchParams.toString()}`,
      });
    }
  }, [requestList]);

  useEffect(() => {
    if (
      isVisible &&
      Array.isArray(requestList) &&
      !fetchIsLastRef.current
    ) {
      const searchParams = new URLSearchParams(search);
      searchParams.append(
        "page",
        Math.floor(requestList.length / requestsPerPageCount) + 1
      );
      searchParams.append("per-page", requestsPerPageCount);

      setFetchConfig({
        url: `${BACKEND_PATH}/user/admin/requests/?${searchParams.toString()}`,
      });
    }
  }, [isVisible]);

  useEffect(() => {
    if (Array.isArray(data)) {
      fetchIsLastRef.current = data.length < requestsPerPageCount;

      if (Array.isArray(requestList)) {
        setRequestList([...requestList, ...data]);
      } else {
        setRequestList([...data]);
      }
    }
  }, [data]);

  return (
    <>
      {Array.isArray(requestList) ? (
        <>
          <List
            data={requestList}
            renderItem={(item) => <RequestCardAdmin request={item} />}
            renderEmpty={
              <div style={{ textAlign: "center" }}>
                Список искомых запросов пуст.
              </div>
            }
            listClassName="requests-wrapper"
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
                Все запросы были загружены.
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
            <div>Не удалось загрузить запросы.</div>
          )}
        </div>
      )}
    </>
  );
};
