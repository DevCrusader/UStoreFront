import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import NumberWithUcoin from "../utils/NumberWithUcoin";
import useFetchWithAuth from "../hooks/useFetchWithAuth";
import { BACKEND_PATH, FETCH_METHOD } from "../Consts";

const UserCardAdmin = ({ user }) => {
  const cardViewTypes = {
    WRTITE_OFF: "WRITE_OFF",
    REPLENISHMENT: "REPLENISHMENT",

    DELETED: "DELETED",
    WARNING: "WARNING",

    DEFAULT: "DEFAULT",
  };

  const [userInfo, setUserInfo] = useState(user);

  if (!userInfo) {
    return <div>Нет информации.</div>;
  }

  const [fetchConfig, setFetchConfig] = useState({});
  const { loading, error, data } = useFetchWithAuth(fetchConfig);

  const [cardView, setCardView] = useState(cardViewTypes.DEFAULT);

  const changeUserPermission = (userId, withAdminPermission) => {
    setFetchConfig({
      url: `${BACKEND_PATH}/user/admin/customer/${userId}/permission/`,
      method: FETCH_METHOD.POST,
      data: {
        permission: withAdminPermission,
      },
    });
  };

  const changeUserBalance = (e) => {
    e.preventDefault();

    const { comment, balance, userId, initialBalance, action } =
      e.target;

    setFetchConfig({
      url: `${BACKEND_PATH}/user/admin/customer/${userId.value}/balance/`,
      method: FETCH_METHOD.POST,
      data: {
        comment: comment.value,
        newBalance:
          Number(initialBalance.value) +
          (action.value === cardViewTypes.REPLENISHMENT
            ? Number(balance.value)
            : action.value === cardViewTypes.WRTITE_OFF
            ? -1 * Number(balance.value)
            : 0),
      },
    });
  };

  const deleteUser = (userId) => {
    setFetchConfig({
      url: `${BACKEND_PATH}/user/admin/customer/${userId}/delete/`,
      method: FETCH_METHOD.DELETE,
    });
  };

  useEffect(() => {
    setCardView(cardViewTypes.DEFAULT);
  }, [fetchConfig]);

  useEffect(() => {
    if (data) {
      setUserInfo(data);

      if (!data.id) {
        setCardView(cardViewTypes.DELETED);
      }
    }
  }, [data]);

  return (
    <div
      className={`user-card-admin ${
        cardView !== cardViewTypes.DEFAULT ? "managed" : ""
      }`}
    >
      <div className="card-header">
        <div
          className={`role ${
            userInfo.admin_permission ? "admin" : ""
          }`}
        >
          {userInfo.admin_permission
            ? "Администратор"
            : "Пользователь"}
        </div>

        <div className="name">{userInfo.name}</div>

        <NumberWithUcoin number={userInfo.balance} />
      </div>

      <div className="card-body">
        {cardView === cardViewTypes.DEFAULT ? (
          <>
            {loading ? (
              <div
                className="lds-dual-ring"
                style={{ width: "80px", height: "80px" }}
              ></div>
            ) : error ? (
              <div style={{ color: "red" }}>
                {JSON.stringify(error, null, 2)}
              </div>
            ) : (
              <>
                <button
                  onClick={() =>
                    setCardView(cardViewTypes.REPLENISHMENT)
                  }
                  className="close"
                >
                  Начислить юкойны
                </button>
                <button
                  onClick={() =>
                    setCardView(cardViewTypes.WRTITE_OFF)
                  }
                  className="close"
                >
                  Списать юкойны
                </button>
                <button
                  onClick={() =>
                    changeUserPermission(
                      userInfo.id,
                      !userInfo.admin_permission
                    )
                  }
                  className="close"
                >
                  {userInfo.admin_permission ? "Забрать" : "Выдать"}{" "}
                  права администратора
                </button>

                <button
                  onClick={() => setCardView(cardViewTypes.WARNING)}
                  className="danger"
                  style={{ marginTop: "auto" }}
                >
                  Убрать
                </button>
              </>
            )}
          </>
        ) : cardView === cardViewTypes.DELETED ? (
          <div style={{ textAlign: "center" }}>
            Пользователь был удалён с сервиса.
          </div>
        ) : cardView === cardViewTypes.WARNING ? (
          <>
            <div
              className="warning-header"
              style={{
                fontSize: "1.5em",
                color: "red",
                textAlign: "center",
              }}
            >
              WARNING!!!
            </div>
            <div
              className="warning-body"
              style={{
                color: "#9c9c9c",
                textAlign: "center",
                fontSize: ".8em",
              }}
            >
              Действие приведёт к тому, что у пользователя очистится
              история изменений баланса, заказы и запросы.
              <br />
              <span style={{ fontSize: "1.1em", color: "black" }}>
                Действие нельзя будет отменить.
              </span>
            </div>
            <button
              onClick={() => deleteUser(userInfo.id)}
              className="warning"
            >
              Всё равно удалить
            </button>
            <button
              className="close"
              onClick={() => setCardView(cardViewTypes.DEFAULT)}
            >
              Закрыть окно
            </button>
          </>
        ) : (
          <>
            <form onSubmit={changeUserBalance}>
              <input
                type="hidden"
                name="initialBalance"
                value={userInfo.balance}
              />
              <input
                type="hidden"
                name="userId"
                value={userInfo.id}
              />
              <input type={"hidden"} name="action" value={cardView} />
              <textarea
                name="comment"
                maxLength={200}
                rows={5}
                placeholder="Причина"
                required
              />
              <NumberWithUcoin
                number={
                  <input
                    type="number"
                    name="balance"
                    max={
                      cardView === cardViewTypes.WRTITE_OFF
                        ? userInfo.balance
                        : 200
                    }
                    min={"1"}
                    step={"0.5"}
                    defaultValue={"1"}
                  />
                }
              />
              <button type="submit" className="warning">
                Отправить
              </button>
              <button
                type="button"
                className="close"
                onClick={() => setCardView(cardViewTypes.DEFAULT)}
              >
                Закрыть это
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

UserCardAdmin.propTypes = {
  user: PropTypes.object.isRequired,
};

export default UserCardAdmin;
