import React, { useEffect, useRef, useState } from "react";

import PropTypes from "prop-types";
import List from "../utils/List";
import useFetchWithAuth from "../hooks/useFetchWithAuth";
import useElementOnScreen from "../hooks/useElementOnScreen";
import { BACKEND_PATH } from "../Consts";
import { useSelector } from "react-redux";

import "../static/css/historyStyles.css";

const HISTORY_VIEWS = {
  balance: {
    name: "balance",
    ru_name: "Баланс",
    stateFilterOptions: (
      <>
        <option value="Any" defaultChecked>
          Все
        </option>
        <option value="Replenishments">Пополнения</option>
        <option value="Write_offs">Списания</option>
      </>
    ),
    renderItem: (item) => (
      <ItemViewComponent
        count={item.count}
        state={
          item.type === "replenishment"
            ? ITEM_STATE.GREEN
            : item.type === "write_off"
            ? ITEM_STATE.RED
            : ITEM_STATE.YELLOW
        }
        shortName={
          item.type === "replenishment"
            ? "Пополнение"
            : item.type === "write_off"
            ? "Списание"
            : "Неизвестно"
        }
        date={item.date ? new Date(item.date) : new Date()}
        addHeader={item.header}
        addMain={item.comment}
      />
    ),
  },
  orders: {
    name: "orders",
    ru_name: "Заказы",
    stateFilterOptions: (
      <>
        <option value="Any" defaultChecked>
          Все
        </option>
        <option value="Accepted">В ожидании</option>
        <option value="Completed">Выданные</option>
        <option value="Canceled">Отменённые</option>
      </>
    ),
    renderItem: (item) => (
      <ItemViewComponent
        count={item.total_count}
        state={
          item.type === "Accepted" || item.type === "Completed"
            ? ITEM_STATE.RED
            : item.type === "Canceled"
            ? ITEM_STATE.GREEN
            : ITEM_STATE.YELLOW
        }
        shortName={`Заказ #${item.id}`}
        date={
          item.updated_date ? new Date(item.updated_date) : new Date()
        }
        addHeader={`Адрес: ${item.address}`}
        addMain={item.products_str}
      />
    ),
  },
  requests: {
    name: "requests",
    ru_name: "Запросы",
    stateFilterOptions: (
      <>
        <option value="Any" defaultChecked>
          Все
        </option>
        <option value="Sent">В ожидании</option>
        <option value="Accepted">Принятые</option>
        <option value="Rejected">Отклонённые</option>
      </>
    ),
    renderItem: (item) => (
      <ItemViewComponent
        count={item.count}
        state={
          item.state === "Accepted"
            ? ITEM_STATE.GREEN
            : item.state === "Rejected"
            ? ITEM_STATE.RED
            : ITEM_STATE.YELLOW
        }
        shortName={`Запрос #${item.id}`}
        date={
          item.updated_date ? new Date(item.updated_date) : new Date()
        }
        addHeader={item.header}
        addMain={
          <>
            {item.comment}
            {item.admin_comment && (
              <div>
                <br />
                {item.admin_comment}
              </div>
            )}
          </>
        }
      />
    ),
  },
  gifts: {
    name: "gifts",
    ru_name: "Подарки",
    stateFilterOptions: (
      <>
        <option value="Any" defaultChecked>
          Все
        </option>
        <option value="Incoming">Полученные</option>
        <option value="Outgoing">Отравленные</option>
      </>
    ),
    renderItem: (item, userId) => (
      <ItemViewComponent
        count={item.count}
        state={
          item.to_customer_id == userId
            ? ITEM_STATE.GREEN
            : ITEM_STATE.RED
        }
        shortName={`Подарок #${item.id}`}
        date={
          item.created_date ? new Date(item.created_date) : new Date()
        }
        addHeader={`Подарок ${
          item.to_customer_id == userId ? "от" : "для"
        }: ${
          item.to_customer_id == userId
            ? item.from_customer_name
            : item.to_customer_name
        }`}
        addMain={item.comment}
      />
    ),
  },
};

const HistoryComponent = () => {
  const [currentFilters, setCurrentFilters] = useState({
    item: "balance",
  });

  const fetchData = (e) => {
    e.preventDefault();

    const { item, state, ordering } = e.target;

    setCurrentFilters({
      item: item.value,
      state: state.value,
      ordering: ordering.value,
    });
  };

  return (
    <div>
      <FilterDataComponent onSubmitForm={fetchData} />
      <FetchDataComponent filters={currentFilters} />
    </div>
  );
};

export default HistoryComponent;

const FetchDataComponent = ({ filters }) => {
  const itemsPerPage = 10;
  const { user_id: userId } = useSelector((state) => state.user.info);

  const [itemsList, setItemsList] = useState(null);

  const [fetchConfig, setFetchConfig] = useState({});
  const { error, loading, data } = useFetchWithAuth(fetchConfig);

  const [containerRef, isVisible] = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: "0.5",
  });

  const fetchIsLastRef = useRef(false);

  useEffect(() => {
    fetchIsLastRef.current = false;
    setItemsList(null);
  }, [filters]);

  useEffect(() => {
    if (!Array.isArray(itemsList)) {
      const searchParams = new URLSearchParams({
        ...filters,
        page: 1,
        "per-page": itemsPerPage,
      });

      setFetchConfig({
        url: `${BACKEND_PATH}/user/customer/history/${
          HISTORY_VIEWS[filters.item].name
        }/?${searchParams.toString()}`,
      });
    }
  }, [itemsList]);

  useEffect(() => {
    if (
      isVisible &&
      Array.isArray(itemsList) &&
      !fetchIsLastRef.current
    ) {
      const searchParams = new URLSearchParams({
        ...filters,
        page: Math.floor(itemsList.length / itemsPerPage) + 1,
        "per-page": itemsPerPage,
      });

      setFetchConfig({
        url: `${BACKEND_PATH}/user/customer/history/${
          HISTORY_VIEWS[filters.item].name
        }/?${searchParams.toString()}`,
      });
    }
  }, [isVisible]);

  useEffect(() => {
    if (Array.isArray(data)) {
      fetchIsLastRef.current = data.length < itemsPerPage;

      if (itemsList) {
        setItemsList([...itemsList, ...data]);
      } else {
        setItemsList([...data]);
      }
    }
  }, [data]);

  return (
    <>
      {Array.isArray(itemsList) ? (
        <>
          <List
            data={itemsList}
            renderItem={(item) =>
              HISTORY_VIEWS[filters.item].renderItem(item, userId)
            }
            renderEmpty={
              <div style={{ textAlign: "center" }}>Список пуст</div>
            }
            listClassName="fetch-data-wrapper"
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
                ref={containerRef}
              >
                Try to load another data.
              </div>
            ) : (
              <div>Вся информация была загружена.</div>
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

FetchDataComponent.propTypes = {
  filters: PropTypes.object.isRequired,
};

const ITEM_STATE = {
  RED: "- ",
  YELLOW: "...",
  GREEN: "+ ",
};

const ItemViewComponent = ({
  count = 0,
  state = ITEM_STATE.YELLOW,
  shortName = "Item",
  date,
  addHeader = "Дополнительный загловок",
  addMain = "Дополнительный блок",
}) => {
  const [opened, setOpened] = useState(false);

  return (
    <div className={`history-item ${opened ? "opened" : "closed"}`}>
      <div
        className={`count col-1 number-with-custom-font ${
          state === ITEM_STATE.RED
            ? "red"
            : state === ITEM_STATE.GREEN
            ? "green"
            : "yellow"
        }`}
      >{`${state}${count}`}</div>
      <div className="main col-2">
        <button
          onClick={() => setOpened((prev) => !prev)}
          className={`short-name additional-toggle ${
            opened ? "opened" : "closed"
          }`}
        >
          <span>{shortName}</span>
          <img
            src={require("../static/svg/ArrowExpandIcon.svg").default}
            alt={"Expand"}
            className="icon"
          ></img>
        </button>
        <div className="date">
          {(date ? date : new Date()).toLocaleDateString("ru-Ru", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
          })}
        </div>
      </div>
      {opened && (
        <div className="additional col-2">
          <header>{addHeader}</header>
          <div className="main">{addMain}</div>
        </div>
      )}
    </div>
  );
};

ItemViewComponent.propTypes = {
  count: PropTypes.number,
  state: PropTypes.string,
  shortName: PropTypes.string,
  date: PropTypes.object.isRequired,
  addHeader: PropTypes.string,
  addMain: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
};

const FilterDataComponent = ({ onSubmitForm = () => {} }) => {
  const [currentView, setCurrentView] = useState(
    HISTORY_VIEWS.balance
  );

  return (
    <form onSubmit={onSubmitForm} className="filter-form">
      <select
        name="item"
        onChange={(e) =>
          setCurrentView(HISTORY_VIEWS[e.target.value])
        }
        className="view-change"
      >
        {Object.entries(HISTORY_VIEWS).map(([key, value], index) => (
          <option value={key} key={index}>
            {value.ru_name}
          </option>
        ))}
      </select>

      <select name="state">
        {currentView ? currentView.stateFilterOptions : <></>}
      </select>

      <select name="ordering">
        <option value="desc">Сначала новые</option>
        <option value="asc">Сначала старые</option>
      </select>
      <button type="submit">Применить</button>
    </form>
  );
};

FilterDataComponent.propTypes = {
  onSubmitForm: PropTypes.func,
};
