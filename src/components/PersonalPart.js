import React, { useEffect, useRef, useState } from "react";
import Popup from "../utils/Popup";

import "../static/css/personalPartStyles.css";
import useFetchWithAuth from "../hooks/useFetchWithAuth";
import {
  BACKEND_PATH,
  CONTAINER_MAX_SIZE,
  FETCH_METHOD,
} from "../Consts";
import GiftComponent from "./GiftComponent";
import HistoryComponent from "./HistoryComponent";
import { useSelector } from "react-redux";
import NumberWithUcoin from "../utils/NumberWithUcoin";

const PersonalPart = () => {
  const { name, balance } = useSelector((state) => state.user.info);

  return (
    <div className="personal-part container">
      <div className="balance-part">
        <div className="header">{name}, у вас</div>
        <div className="balance">
          <NumberWithUcoin number={balance ? balance : 0} />
        </div>
      </div>
      <div className="manage-part">
        <BalanceHistory />
        <GiftComponent />
        <RequestComponent />
      </div>

      <HintComponent />
    </div>
  );
};

export default PersonalPart;

const HintComponent = () => {
  const hintRef = useRef(null);

  useEffect(() => {
    const scrollHandler = () => {
      if (window.scrollY > 200) {
        hintRef.current.classList.add("hidden");
      } else {
        hintRef.current.classList.remove("hidden");
      }
    };

    window.addEventListener("scroll", scrollHandler);

    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);
  return (
    <div className="hint" ref={hintRef}>
      <span className="icon">
        <img
          className="outer"
          alt={"Mouse"}
          src={require("../static/svg/HintMouseIcon.svg").default}
        />
        <img
          className="inner"
          alt={"Scroll"}
          src={require("../static/svg/HintScrollIcon.svg").default}
        />
      </span>
      <span>Чтобы узнать про юкойны</span>
    </div>
  );
};

const BalanceHistory = () => {
  const [opened, setOpened] = useState();

  return (
    <>
      <button
        onClick={() => setOpened(true)}
        className="history-btn"
        type="button"
      >
        <img
          src={require("../static/svg/HistoryIcon.svg").default}
          alt="Иконка истории профиля"
        />
        <span>История профиля</span>
      </button>

      {opened && (
        <Popup
          closePopup={() => setOpened(false)}
          popupClassName={"history-popup"}
          header={"История вашего баланса"}
          body={<HistoryComponent />}
        />
      )}
    </>
  );
};

const RequestComponent = () => {
  const viewTypes = {
    FORM: "formView",
    DATA: "dataView",
  };

  const [opened, setOpened] = useState(false);

  const [fetchConfig, setFetchConfig] = useState({});
  const { loading, error, data } = useFetchWithAuth(fetchConfig);

  const [componentView, setComponentView] = useState(viewTypes.FORM);

  const submitForm = (e) => {
    e.preventDefault();

    const { header, comment } = e.target;

    setFetchConfig({
      url: `${BACKEND_PATH}/user/customer/requests/create/`,
      method: FETCH_METHOD.POST,
      data: {
        header: header.value,
        comment: comment.value,
      },
    });
  };

  useEffect(() => {
    if (data) setComponentView(viewTypes.DATA);
  }, [data]);

  return (
    <>
      <button
        onClick={() => setOpened(true)}
        className="request-btn"
        type={"button"}
      >
        <img
          src={require("../static/svg/RequestIcon.svg").default}
          alt="Иконка запросов"
        />
        <span>Отправить запрос на пополнение</span>
      </button>

      {opened && (
        <Popup
          closePopup={() => setOpened(false)}
          header={"Работа с запросами"}
          containerMaxSize={CONTAINER_MAX_SIZE.MEDIUM}
          popupClassName="request-popup"
          body={
            <>
              {componentView === viewTypes.FORM ? (
                <form className="" onSubmit={submitForm}>
                  <label htmlFor="id-header">
                    Заголовок
                    <input
                      type="text"
                      name="header"
                      id="id-header"
                      placeholder="Заголовок запроса"
                      maxLength={"100"}
                      required
                    />
                  </label>
                  <label htmlFor="id-comment">
                    Комментарий
                    <textarea
                      name="comment"
                      id="id-comment"
                      rows="4"
                      maxLength={"250"}
                      placeholder="Введите комментарий к запросу."
                      required
                    />
                  </label>

                  {error && (
                    <div style={{ color: "red" }}>
                      {JSON.stringify(error)}
                    </div>
                  )}

                  {loading ? (
                    <div
                      className="lds-dual-ring"
                      style={{ width: "42px" }}
                    ></div>
                  ) : (
                    <button type="submit">Отправить запрос</button>
                  )}
                </form>
              ) : componentView === viewTypes.DATA ? (
                <div className="data-view">
                  <div
                    className="main"
                    style={{ textAlign: "center" }}
                  >
                    Запрос{" "}
                    <span style={{ color: "var(--main-color)" }}>
                      #{data.id}
                    </span>{" "}
                    был успешно отправлен. Состояние Вашего запроса мы
                    можете отслеживаить в истории профиля во вкладке
                    &quot;Запросы&quot;.
                    <br />
                    Вы можете отправить ещё один запрос.
                  </div>
                  <button
                    className="back"
                    onClick={() => setComponentView(viewTypes.FORM)}
                  >
                    Вернуться к форме
                  </button>
                </div>
              ) : (
                <div>
                  Ошибка. Попробуйте перезагрузить страницу и
                  повторить действие.
                </div>
              )}
            </>
          }
        />
      )}
    </>
  );
};
