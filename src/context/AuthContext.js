import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { BACKEND_PATH, TOKEN_LIFE_TIME } from "../Consts";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import jwtDecode from "jwt-decode";
import { setUserInfo } from "../redux/actions/userReducerDispatches/userInfoActions";

const AuthContext = React.createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const TOKEN_KEY_IN_STORAGE = "userTokens";

  const [userTokens, setUserTokens] = useState(() =>
    localStorage.getItem(TOKEN_KEY_IN_STORAGE)
      ? JSON.parse(localStorage.getItem(TOKEN_KEY_IN_STORAGE))
      : null
  );

  const [updated, setUpdated] = useState(true);
  const [serverError, setServerError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const refreshing = useRef(false);
  const tokenUpdatedTimeoutId = useRef(null);

  const loginUser = (userTokens) => {
    setUserTokens(userTokens);
  };

  const refreshTokens = async () => {
    if (updated) {
      return navigate("/logout", {
        state: {
          pathname: window.location.pathname,
          reason: `Токены устарели, неоходимо повторно авторизоваться.`,
        },
      });
    }

    if (!userTokens) {
      return navigate("/logout", {
        state: {
          pathname: window.location.pathname,
          reason: `Токены не найдены, неоходимо повторно авторизоваться.`,
        },
      });
    }

    if (refreshing.current)
      return console.log("Wait for the token to updated.");

    refreshing.current = true;

    await axios
      .post(`${BACKEND_PATH}/user/token/refresh/`, {
        refresh: userTokens.refresh,
      })
      .then((res) => setUserTokens(res.data))
      .catch((err) => {
        if (err.response.status === 401) {
          return navigate("/logout", {
            state: {
              pathname: window.location.pathname,
              reason: `Refresh токен устарел, неоходимо повторно авторизоваться.`,
            },
          });
        } else {
          setServerError(err.message);
        }
      });
  };

  const clearUserTokens = () => {
    localStorage.removeItem(TOKEN_KEY_IN_STORAGE);

    setUserTokens(null);
  };

  const tokenUpdatedTimeout = (seconds) => {
    if (tokenUpdatedTimeoutId.current) {
      clearTimeout(tokenUpdatedTimeoutId.current);
    }

    console.log("Set updated true.");
    setUpdated(true);

    tokenUpdatedTimeoutId.current = setTimeout(() => {
      console.log("Set updated false.");

      setUpdated(false);
    }, seconds * 1000);
  };

  useEffect(() => {
    refreshing.current = false;

    if (userTokens && userTokens?.access && userTokens?.refresh) {
      const decoded = jwtDecode(userTokens.access);
      dispatch(setUserInfo(decoded));

      if (userTokens.updatedDate) {
        const remain = Math.floor(
          (new Date() - new Date(userTokens.updatedDate)) / 1000
        );

        localStorage.setItem(
          TOKEN_KEY_IN_STORAGE,
          JSON.stringify(userTokens)
        );

        if (remain < TOKEN_LIFE_TIME) {
          tokenUpdatedTimeout(TOKEN_LIFE_TIME - remain);
        } else {
          setUpdated(false);
        }
      } else {
        const now = new Date();

        localStorage.setItem(
          TOKEN_KEY_IN_STORAGE,
          JSON.stringify({
            ...userTokens,
            updatedDate: now,
          })
        );

        tokenUpdatedTimeout(TOKEN_LIFE_TIME);
      }
    } else {
      console.error("Invalid tokens has been fetched.", userTokens);
    }
  }, [userTokens]);

  return (
    <AuthContext.Provider
      value={{
        userTokens,
        loginUser,
        updated,
        refreshTokens,
        clearUserTokens,
      }}
    >
      {children}
      {serverError && (
        <div
          style={{
            padding: "100px 50px",
            position: "fixed",
            top: "200px",
            left: "calc(50vh-150px)",
            border: "2px solid black",
            borderRadius: "15px",
            backgroundColor: "lightgray",
            color: "led",
          }}
        >
          {JSON.stringify(serverError)}
          <br />
          Перейдите по <Link to="/logout">ссылке</Link>, чтобы выйти
          из сервиса, и попробуйте авторизоваться ещё раз.
        </div>
      )}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
};
