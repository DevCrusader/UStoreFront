import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BACKEND_PATH,
  CONTAINER_MAX_SIZE,
  FETCH_METHOD,
} from "../../Consts";
import AuthContext from "../../context/AuthContext";
import useFetch from "../../hooks/useFetch";

import "../../static/css/loginPageStyles.css";
import Popup from "../../utils/Popup";

const Login = () => {
  const { clearUserTokens } = useContext(AuthContext);

  useEffect(() => {
    clearUserTokens();
  }, []);

  return (
    <div className="login-page container">
      <AuthorizationComponent />
      <SelfRegisterComponent />
    </div>
  );
};

export default Login;

const SelfRegisterComponent = () => {
  const [opened, setOpened] = useState(false);
  const [visible, setVisible] = useState(false);

  const [fetchConfig, setFetchConfig] = useState({});
  const { loading, error, data } = useFetch(fetchConfig);

  const submitForm = (e) => {
    e.preventDefault();

    const { "user-name": userName, secretWord } = e.target;

    const [lastName, firstName, patronymic] =
      userName.value.split(" ");

    setFetchConfig({
      url: `${BACKEND_PATH}/user/register/`,
      method: FETCH_METHOD.POST,
      data: {
        lastName: lastName,
        firstName: firstName,
        patronymic: patronymic,
        secretWord: secretWord.value,
      },
    });
  };

  return (
    <>
      <button
        onClick={() => setOpened(true)}
        className="self-register-btn"
      >
        Зарегистрироваться
      </button>
      {opened && (
        <Popup
          closePopup={() => setOpened(false)}
          header={"Регистрация"}
          popupClassName="self-register-form"
          containerMaxSize={CONTAINER_MAX_SIZE.MEDIUM}
          body={
            <form onSubmit={submitForm}>
              <label htmlFor={`id-user-name`}>
                ФИО через пробел с заглавной буквы
                <input
                  type="text"
                  id={`id-user-name`}
                  placeholder={"Иванов Иван Иванович"}
                  name={"user-name"}
                  required
                  pattern={"[А-ЯЁ]+[а-яё А-ЯЁ]*"}
                />
              </label>
              <label
                htmlFor="id-secret-word"
                className="password-wrapper"
              >
                Секретное слово
                <input
                  type={visible ? "text" : "password"}
                  name="secretWord"
                  id="id-secret-word"
                  required
                />
                <span
                  className={`password-visibility ${
                    visible ? "hide" : "show"
                  }`}
                  onClick={() => setVisible((prev) => !prev)}
                ></span>
              </label>
              {error && (
                <div style={{ color: "red" }}>
                  {error.additionalInfo
                    ? error.additionalInfo.detail
                    : "ОШИБКА"}
                </div>
              )}
              <div className="footer">
                {loading ? (
                  <div
                    className="lds-dual-ring"
                    style={{ width: "42px" }}
                  ></div>
                ) : data ? (
                  <div style={{ textAlign: "center" }}>
                    Вы были успешно зарегистрированы. Теперь вы можете
                    авторизоваться в сервисе.
                  </div>
                ) : (
                  <button type="submit">Зарегистрироваться</button>
                )}
              </div>
            </form>
          }
        />
      )}
    </>
  );
};

const AuthorizationComponent = () => {
  const [visible, setVisible] = useState(false);

  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [fetchConfig, setFetchConfig] = useState({});
  const { loading, error, data } = useFetch(fetchConfig);

  const _loginUser = async (e) => {
    e.preventDefault();

    const { username, password } = e.target;

    setFetchConfig({
      url: `${BACKEND_PATH}/user/token/`,
      method: FETCH_METHOD.POST,
      data: {
        username: username.value,
        password: password.value,
      },
    });
  };

  useEffect(() => {
    if (data) {
      if (data.access && data.refresh) {
        loginUser({ access: data.access, refresh: data.refresh });

        setTimeout(() => {
          navigate("/personal");
        }, 1500);
      }
    }
  }, [data]);

  return (
    <form onSubmit={_loginUser} className="login-form">
      <div className="header">Сервис для сотрудников УЦСБ.</div>

      <label htmlFor="id-username">
        <input
          type="text"
          name="username"
          placeholder="Username"
          id="id-username"
        />
      </label>

      <label htmlFor="id-password" className="password-wrapper">
        <input
          type={visible ? "text" : "password"}
          name="password"
          placeholder="Password"
          id="id-password"
        />
        <span
          className={`password-visibility ${
            visible ? "hide" : "show"
          }`}
          onClick={() => setVisible((prev) => !prev)}
        ></span>
      </label>

      {error && (
        <div style={{ color: "red", textAlign: "center" }}>
          Ошибка в ФИО или секретном слове или данный пользователь
          незарегистрирован.
        </div>
      )}

      {loading ? (
        <div
          className="lds-dual-ring"
          style={{ width: "42px" }}
        ></div>
      ) : data ? (
        <div
          style={{
            width: "100%",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            columnGap: "20px",
          }}
        >
          Авторизация прошла успешно{" "}
          <div
            className="lds-dual-ring"
            style={{ width: "42px" }}
          ></div>
        </div>
      ) : (
        <button type="submit">ВОЙТИ</button>
      )}
    </form>
  );
};
