import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import useFetchWithAuth from "../hooks/useFetchWithAuth";
import NumberWithUcoin from "../utils/NumberWithUcoin";
import { BACKEND_PATH, FETCH_METHOD } from "../Consts";

const RequestCardAdmin = ({ request }) => {
  if (!request) {
    return <div>No reqest info.</div>;
  }

  const requestStateTypes = {
    ACCEPTED: "Accepted",
    REJECTED: "Rejected",
    SENT: "Sent",
  };

  const cardViewTypes = {
    DEFAULT: "DEFAULT",
    REJECTED: "REJECTED",
    ACCEPTED: "ACCEPTED",
    READONLY: "READONLY",
  };

  const [requestInfo, setRequestInfo] = useState(request);

  const [fetchConfig, setFetchConfig] = useState({});
  const { loading, error, data } = useFetchWithAuth(fetchConfig);

  const [cardView, setCardView] = useState(cardViewTypes.DEFAULT);

  const submitForm = (e) => {
    e.preventDefault();

    const { newState, adminComment, count } = e.target;

    setFetchConfig({
      url: `${BACKEND_PATH}/user/admin/requests/${requestInfo.id}/`,
      method: FETCH_METHOD.POST,
      data: {
        newState: newState.value,
        adminComment: adminComment.value,
        count: Number(count.value),
      },
    });

    setCardView(cardViewTypes.DEFAULT);
  };

  useEffect(() => {
    if (data) setRequestInfo(data);
  }, [data]);

  useEffect(() => {
    if (requestInfo) {
      if (requestInfo.state !== requestStateTypes.SENT) {
        setCardView(cardViewTypes.READONLY);
      }
    }
  }, [requestInfo]);

  return (
    <div className={`request-card-admin`}>
      <div className="header">
        <span className="name">Заказ #{requestInfo.id}</span>
        <span className="reason">{requestInfo.header}</span>
      </div>
      <div className="customer-body">
        <div className="header">
          {requestInfo.customer_name}{" "}
          {new Date(requestInfo.created_date)?.toLocaleDateString(
            "ru-Ru",
            {
              year: "2-digit",
              month: "2-digit",
              day: "2-digit",
            }
          )}
        </div>
        <textarea
          className="comment"
          readOnly
          defaultValue={requestInfo.comment}
        ></textarea>
      </div>
      <form className="admin-body" onSubmit={submitForm}>
        <input
          type={"hidden"}
          value={
            cardView === cardViewTypes.REJECTED
              ? requestStateTypes.REJECTED
              : cardView === cardViewTypes.ACCEPTED
              ? requestStateTypes.ACCEPTED
              : "Неизвестное состояние"
          }
          name="newState"
        />
        <label htmlFor="adminComment">
          <span>Ваш комментарий</span>
          <textarea
            id="adminComment"
            name="adminComment"
            maxLength={250}
            readOnly={
              cardView === cardViewTypes.READONLY || loading || error
            }
            defaultValue={requestInfo.admin_comment}
            placeholder={"Ваш комментарий, максимум 250 символов."}
            required
          ></textarea>
        </label>
        <label htmlFor="amdinCount">
          <span>Количество начисляемых юкоинов</span>
          <NumberWithUcoin
            number={
              <input
                min={cardView === cardViewTypes.ACCEPTED ? 1 : 0}
                type={"number"}
                defaultValue={requestInfo.count}
                readOnly={
                  cardView === cardViewTypes.READONLY ||
                  loading ||
                  error
                }
                name="count"
                disabled={cardView !== cardViewTypes.ACCEPTED}
                required={cardView === cardViewTypes.ACCEPTED}
              />
            }
          />
        </label>
        <div className="footer">
          {cardView === cardViewTypes.DEFAULT ? (
            <>
              {loading ? (
                <div
                  className="lds-dual-ring"
                  style={{ width: "80px", height: "80px" }}
                ></div>
              ) : error ? (
                <div style={{ color: "red" }}>
                  {error.additionalInfo
                    ? error.additionalInfo.detail
                    : "Произошла ошибка запроса, попробуйте перезагрузить страницу и повторить действие."}
                </div>
              ) : (
                <div className="btn-wrapper">
                  <button
                    type="button"
                    className="close"
                    onClick={() =>
                      setCardView(cardViewTypes.REJECTED)
                    }
                  >
                    Отклонить
                  </button>
                  <button
                    type="button"
                    className="close"
                    onClick={() =>
                      setCardView(cardViewTypes.ACCEPTED)
                    }
                  >
                    Одобрить
                  </button>
                </div>
              )}
            </>
          ) : cardView === cardViewTypes.READONLY ? (
            <div className="state">
              Запрос был{" "}
              {requestInfo.state === requestStateTypes.ACCEPTED
                ? "Одобрен"
                : requestInfo.state === requestStateTypes.REJECTED
                ? "Отклонён"
                : "*Неизвестное состояние*"}
              <br />
              {new Date(requestInfo.updated_date)?.toLocaleDateString(
                "ru-Ru",
                { year: "2-digit", month: "2-digit", day: "2-digit" }
              )}
            </div>
          ) : cardView === cardViewTypes.REJECTED ||
            cardView === cardViewTypes.ACCEPTED ? (
            <div className="danger">
              <span>
                Заказ будет{" "}
                {cardView === cardViewTypes.ACCEPTED
                  ? "Одобрен"
                  : cardView === cardViewTypes.REJECTED
                  ? "Отклонён"
                  : "*Неизвестное состояние*"}
              </span>
              <span>Действие нельзя будет отменить.</span>
              <div className="btn-wrapper">
                <button
                  type={"button"}
                  className="warning"
                  onClick={() => setCardView(cardViewTypes.DEFAULT)}
                >
                  Вернуться
                </button>
                <button type={"submit"} className="complete">
                  Отправить
                </button>
              </div>
            </div>
          ) : (
            <div>Неизвестное представление запроса.</div>
          )}
        </div>
      </form>
    </div>
  );
};

RequestCardAdmin.propTypes = {
  request: PropTypes.object.isRequired,
};

export default RequestCardAdmin;
