import React, { useEffect, useRef, useState } from "react";
import {
  BACKEND_PATH,
  CONTAINER_MAX_SIZE,
  FETCH_METHOD,
} from "../../Consts";
import useElementOnScreen from "../../hooks/useElementOnScreen";
import useFetchWithAuth from "../../hooks/useFetchWithAuth";

import UserCardAdmin from "../../components/UserCardAdmin";
import List from "../../utils/List";
import Popup from "../../utils/Popup";

import "../../static/css/adminUsersStyles.css";
import capitalizeString from "../../utils/capitalizeString";

const AdminUsers = () => {
  return (
    <div className="admin-users">
      {/* <header>Управление пользователями.</header> */}
      <UserRegistration />
      <UserSearch />
    </div>
  );
};

export default AdminUsers;

const UserRegistration = () => {
  const [fetchConfig, setFetchConfig] = useState({});
  const { error, loading, data } = useFetchWithAuth(fetchConfig);

  const [opened, setOpened] = useState(false);

  const registerUser = (e) => {
    e.preventDefault();

    const { "user-name": userName, balance, permission } = e.target;

    const [lastName, firstName, patronymic] =
      userName.value.split(" ");

    setFetchConfig({
      url: `${BACKEND_PATH}/user/admin/customers/create/`,
      method: FETCH_METHOD.POST,
      data: {
        firstName: firstName,
        lastName: lastName,
        patronymic: patronymic,
        balance: balance.value,
        permission: permission.checked,
      },
    });
  };

  useEffect(() => {
    if (data) console.log("DATA:", data);
  }, [data]);

  return (
    <>
      <button
        onClick={() => setOpened(true)}
        className="user-registration complete"
      >
        + Зарегистрировать нового пользователя
      </button>
      {opened && (
        <Popup
          closePopup={() => setOpened(false)}
          popupClassName="user-registration-form"
          containerMaxSize={CONTAINER_MAX_SIZE.MEDIUM}
          header={"Регистрация нового пользователя"}
          body={
            <form
              onSubmit={registerUser}
              className={`${opened ? "opened" : ""}`}
            >
              <label htmlFor={`id-user-name`}>
                {"ФИО через пробел с заглавной буквы"}
                <input
                  type="text"
                  id={`id-user-name`}
                  name={"user-name"}
                  placeholder={"Иванов Иван Иванович"}
                  required
                  pattern={"[А-ЯЁ]+[а-яё А-ЯЁ]*"}
                />
              </label>

              <label htmlFor="id-balance">
                Баланс
                <input
                  type={"number"}
                  min="0"
                  defaultValue={0}
                  name="balance"
                  id="id-balance"
                />
              </label>
              <label
                htmlFor="id-permission"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  name="permission"
                  id="id-permission"
                />{" "}
                Выдать права администратора
              </label>

              {data ? (
                <div>
                  Пользователь был {data.name} успешно
                  зарегистрирован.
                </div>
              ) : error ? (
                <div style={{ color: "red" }}>
                  {error.additionalInfo
                    ? error.additionalInfo.detail
                    : "Произошла ошибка при создании пользователя, перезагрузите страницу и повторите попытку."}
                </div>
              ) : (
                <></>
              )}

              {loading ? (
                <div
                  className="lds-dual-ring"
                  style={{ width: "42px", marginTop: "20px" }}
                ></div>
              ) : (
                <button type={"submit"} className="complete">
                  Зарегистрировать
                </button>
              )}
            </form>
          }
        />
      )}
    </>
  );
};

const UserSearch = () => {
  const userPerPage = 10;

  const [userList, setUserList] = useState(null);

  const [fetchConfig, setFetchConfig] = useState({});
  const { error, loading, data } = useFetchWithAuth(fetchConfig);

  const [search, setSearch] = useState("");

  const [containerRef, isVisible] = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: "0.5",
  });
  const fetchIsLastRef = useRef(false);

  useEffect(() => {
    fetchIsLastRef.current = false;
    setUserList(null);
  }, [search]);

  useEffect(() => {
    let timeoutId;

    const trimmedSearch = search.trim();

    if (isVisible && trimmedSearch) {
      const currentLength = Array.isArray(userList)
        ? userList.length
        : 0;
      const nextPage = Math.ceil(currentLength / userPerPage) + 1;

      const [lastName, firstName, patronymic] = trimmedSearch
        .split(" ")
        .map((value) => capitalizeString(value));

      timeoutId = setTimeout(
        () =>
          setFetchConfig({
            url: `${BACKEND_PATH}/user/admin/customers/?${new URLSearchParams(
              {
                firstName: firstName ? firstName : "*",
                lastName: lastName ? lastName : "*",
                patronymic: patronymic ? patronymic : "*",
                page: nextPage,
                "per-page": userPerPage,
              }
            ).toString()}`,
          }),
        1500
      );
    }

    return () => clearTimeout(timeoutId);
  }, [isVisible, search]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      if (data.length < userPerPage) {
        fetchIsLastRef.current = true;
      }

      if (userList) {
        setUserList([...userList, ...data]);
      } else {
        setUserList(data);
      }
    }
  }, [data]);

  return (
    <div className="user-search">
      <div className="search-field">
        <input
          type="text"
          className="search-field"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={"Фамилия Имя Отчество"}
        />
        <span className="icon"></span>
      </div>
      {search ? (
        <>
          {userList ? (
            <List
              data={userList}
              renderItem={(item) => <UserCardAdmin user={item} />}
              renderEmpty={
                <div style={{ textAlign: "center" }}>
                  По данному запросу не удалось найти пользователей.
                </div>
              }
              listClassName={"users-wrapper"}
            />
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
                  style={{ width: "80px", height: "80px" }}
                ></div>
              ) : error ? (
                <pre style={{ color: "red" }}>
                  {JSON.stringify(error, null, 2)}
                </pre>
              ) : !fetchIsLastRef.current ? (
                <div
                  className="lds-dual-ring additional-fetch"
                  style={{ width: "80px", height: "80px" }}
                  ref={containerRef}
                ></div>
              ) : (
                <div>Все запросы были загружены.</div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="instruction">
          <div style={{ color: "#767676" }}>
            <p style={{ color: "black" }}>
              Для поиска наберите в порядке: Фамилия Имя Отчество.
              <br />
              Введите запрос и через две секунды увидите результат.
              <br />
              Если ничего не появилось, значит искомые пользователи не
              найдены.
            </p>

            <p>
              Вы можете набрать только
              <span style={{ color: "var(--main-color)" }}>
                {" "}
                Фамилию
              </span>
              , тогда получите всех пользователей с данной фамилией.
            </p>
            <p>
              Вы можете набрать:
              <span style={{ color: "var(--main-color)" }}>
                {" "}
                Фамилия Имя
              </span>
              , тогда получите всех соответствующих пользователей.
            </p>
            <p>
              В остальных случаях впишите
              <span style={{ color: "var(--main-color)" }}>
                {" "}
                полное ФИО
              </span>
              .
            </p>
            <p>
              Если Вам неизвестны некоторые параметры из ФИО, то
              поставьте на их место
              <span style={{ color: "var(--main-color)" }}>
                {" "}
                &quot;*&quot;
              </span>
              . К примеру:
            </p>

            <ol>
              <li style={{ marginBottom: "5px" }}>
                Запрос
                <span style={{ color: "var(--main-color)" }}>
                  {" "}
                  &quot;Япрынцев * Максимович&quot;{" "}
                </span>
                вернёт всех пользователей с фамилией Япрынцев и
                отчеством Максимович.
              </li>
              <li>
                Запрос
                <span style={{ color: "var(--main-color)" }}>
                  {" "}
                  &quot;* Артём *&quot;{" "}
                </span>
                вернёт всех Артёмов, зарегистрированных в сервисе.
              </li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};
