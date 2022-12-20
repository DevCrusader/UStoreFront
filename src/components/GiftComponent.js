import React, { useState, useEffect } from "react";
import {
  BACKEND_PATH,
  CONTAINER_MAX_SIZE,
  FETCH_METHOD,
} from "../Consts";
import useFetchWithAuth from "../hooks/useFetchWithAuth";
import Popup from "../utils/Popup";

import NumberWithUcoin from "../utils/NumberWithUcoin";

import PropTypes from "prop-types";
import UserSearch from "./UserSearch";
import List from "../utils/List";
import { useSelector } from "react-redux";

import "../static/css/giftComponentStyles.css";
import "../static/css/sendGiftComponentStyles.css";
import UpdateBalanceComponent from "./UpdateBalanceComponent";

const GiftComponent = () => {
  const [incomingGifts, setIncomingGifts] = useState(null);

  const [fetchConfig, setFetchConfig] = useState({});
  const { data } = useFetchWithAuth(fetchConfig);

  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (!Array.isArray(incomingGifts)) {
      setFetchConfig({
        url: `${BACKEND_PATH}/user/customer/gifts/`,
      });
    }
  }, [incomingGifts]);

  useEffect(() => {
    if (data) {
      setIncomingGifts(data);
    }
  }, [data]);

  // May be add some notification to unserstand? that user have some new Gifts
  return (
    <>
      <button
        onClick={() => setOpened(true)}
        className={`gift-btn ${
          Array.isArray(incomingGifts) && incomingGifts.length
            ? "accept"
            : "send"
        }`}
        type={"button"}
      >
        <img
          src={require("../static/svg/GiftIcon.svg").default}
          alt="Иконка подарков"
        />
        <span>
          {Array.isArray(incomingGifts) && incomingGifts.length
            ? "Вам подарили подарок"
            : "Отправить подарок"}
        </span>
      </button>

      {opened &&
        Array.isArray(incomingGifts) &&
        Boolean(incomingGifts.length) && (
          <Popup
            popupClassName="incoming-gifts"
            closePopup={() => {
              setOpened(false);
              setIncomingGifts(null);
            }}
            header={"Вам прислали подарки"}
            body={<AcceptGiftView gifts={incomingGifts} />}
            containerMaxSize={CONTAINER_MAX_SIZE.MEDIUM}
          />
        )}

      {opened &&
        Array.isArray(incomingGifts) &&
        Boolean(!incomingGifts.length) && (
          <Popup
            closePopup={() => setOpened(false)}
            popupClassName={"send-gift-popup"}
            header={"Отправить подарок"}
            body={<SendGiftComponent />}
            containerMaxSize={CONTAINER_MAX_SIZE.MEDIUM}
          />
        )}
    </>
  );
};

export default GiftComponent;

const AcceptGiftView = ({ gifts }) => {
  const giftStateTypes = {
    SENT: "Sent",
    ACCEPTED: "Accepted",
  };

  const [giftsList, setGiftsList] = useState(gifts);
  const [currentGiftIndex, setCurrentGiftIndex] = useState(0);

  const [fetchConfig, setFetchConfig] = useState({});
  const { data } = useFetchWithAuth(fetchConfig);

  useEffect(() => {
    if (giftsList) {
      if (
        giftsList[currentGiftIndex].state !== giftStateTypes.ACCEPTED
      ) {
        setFetchConfig({
          url: `${BACKEND_PATH}/user/customer/gifts/${giftsList[currentGiftIndex].id}/`,
          method: FETCH_METHOD.POST,
          data: {},
        });
      }
    }
  }, [currentGiftIndex]);

  useEffect(() => {
    if (data) {
      if (Array.isArray(giftsList)) {
        setGiftsList(
          giftsList.map((gift) => (gift.id === data.id ? data : gift))
        );
      }
    }
  }, [data]);

  return (
    <>
      <div className="gifts-wrapper">
        <List
          data={giftsList}
          styles={{
            left: `-${currentGiftIndex * 100}%`,
            width: Array.isArray(giftsList)
              ? `${giftsList.length}00%`
              : "100%",
          }}
          listClassName={""}
          renderItem={(item) => (
            <>
              <div className="count">
                <NumberWithUcoin number={item.count} />
              </div>
              <div className="comment">{item.comment}</div>
              <div className="sender">{item.from_customer_name}</div>
            </>
          )}
        />
      </div>

      <div className="gift-manage-wrapper">
        <button
          className="prev-btn abs btn"
          onClick={() =>
            setCurrentGiftIndex((prev) => (prev > 0 ? prev - 1 : 0))
          }
          disabled={currentGiftIndex === 0}
        ></button>

        <div className="current number-with-custom-font">
          {currentGiftIndex + 1} / {giftsList.length}
        </div>
        <button
          className="next-btn abs btn"
          onClick={() =>
            setCurrentGiftIndex((prev) =>
              prev < giftsList.length - 1 ? prev + 1 : prev
            )
          }
          disabled={currentGiftIndex === giftsList.length - 1}
        ></button>
      </div>
    </>
  );
};

AcceptGiftView.propTypes = {
  gifts: PropTypes.array.isRequired,
};

const SendGiftComponent = () => {
  const { balance, user_id: id } = useSelector(
    (state) => state.user.info
  );

  const formStep = {
    USER_SEARCH: "userSearch",
    FORM_VIEW: "formView",
    DATA_VIEW: "dataView",
  };

  const [componentView, setComponentView] = useState(
    formStep.USER_SEARCH
  );
  const [pinnedUser, setPinnedUser] = useState(null);

  const [fetchConfig, setFetchConfig] = useState({});
  const { error, loading, data } = useFetchWithAuth(fetchConfig);

  useEffect(() => {
    if (data) {
      console.log("DATA:", data);
    }
  }, [data]);

  const submitForm = (e) => {
    e.preventDefault();

    const { to_customer_id, count, comment } = e.target;

    console.log({
      count: count.value,
      comment: comment.value,
    });

    setFetchConfig({
      url: `${BACKEND_PATH}/user/customer/gifts/create/`,
      method: FETCH_METHOD.POST,
      data: {
        to_customer_id: to_customer_id.value,
        count: Number(count.value),
        comment: comment.value,
      },
    });
  };

  useEffect(() => {
    if (data) {
      setComponentView(formStep.DATA_VIEW);
    }
  }, [data]);

  useEffect(() => {
    if (componentView === formStep.USER_SEARCH) {
      setPinnedUser(false);
    }
  }, [componentView]);

  return (
    <>
      {componentView === formStep.USER_SEARCH ? (
        <div className="user-search-view">
          <UserSearch onChoose={setPinnedUser} />

          <div
            className="pinned-user-info"
            style={{
              height: "200px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {pinnedUser ? (
              <>
                Подарок будет отправлен пользователю: <br />
                <span style={{ fontSize: "1.2em" }}>
                  {pinnedUser.name}
                </span>
              </>
            ) : (
              'Если неизвестен какой-либо параметр из ФИО, поставьте на его место "*"; Все данные вводить с заглавной буквы и в правильном порядке (ФИО).'
            )}
          </div>

          {pinnedUser && pinnedUser.id === id && (
            <div style={{ color: "red" }}>
              Вы не можете отправить подарок самому себе.
            </div>
          )}

          <button
            onClick={() => setComponentView(formStep.FORM_VIEW)}
            disabled={
              !pinnedUser || (pinnedUser && pinnedUser.id === id)
            }
            style={{ width: "100%" }}
            className="complete"
          >
            Далее
          </button>
        </div>
      ) : componentView === formStep.FORM_VIEW ? (
        <form onSubmit={submitForm} className="send-gift-form">
          <input
            type="hidden"
            name="to_customer_id"
            value={pinnedUser.id}
          />
          <label htmlFor="id-customer-name">
            Имя получателя
            <input
              id="id-customer-name"
              type="text"
              name="customer_name"
              defaultValue={pinnedUser.name}
              disabled
            />
          </label>
          <label id="id-gift-count">
            Количество юкоинов
            <input
              type="number"
              min={"0"}
              max={balance}
              defaultValue={"1"}
              name="count"
              id="id-gift-count"
            />
          </label>
          <label id="id-gift-comment">
            Ваш комментарий
            <textarea
              rows={"4"}
              maxLength={"250"}
              placeholder="Комментарий к подарку, максимум 250 символов."
              name="comment"
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
              style={{
                width: "42px",
                height: "42px",
                marginBottom: "5px",
              }}
              className="lds-dual-ring"
            ></div>
          ) : (
            <div className="btn-wrapper">
              <button
                type="button"
                className="close"
                onClick={() => setComponentView(formStep.USER_SEARCH)}
              >
                Назад
              </button>
              <button type="submit" className="complete">
                Отправить
              </button>
            </div>
          )}
        </form>
      ) : componentView === formStep.DATA_VIEW ? (
        <div className="sent-gift">
          <UpdateBalanceComponent />
          <img
            className="decoration"
            src={
              require("../static/svg/SendGiftDecoration.svg").default
            }
            alt="Декорация отправленного подарка"
          />
          <div className="gift-info">
            <header>Подарок отправлен</header>
            <button
              className="link-imitation"
              onClick={() => setComponentView(formStep.USER_SEARCH)}
            >
              Отправить ещё один
            </button>
          </div>
        </div>
      ) : (
        <div>ERROR</div>
      )}
    </>
  );
};
