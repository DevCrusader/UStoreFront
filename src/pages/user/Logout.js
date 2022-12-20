import React, { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { clearCollections } from "../../redux/actions/storeReducerDispatches/collectionActions";
import { clearProductList } from "../../redux/actions/storeReducerDispatches/productActions";
import { clearUserData } from "../../redux/actions/userActions";

const Logout = () => {
  const { clearUserTokens } = useContext(AuthContext);
  const dispatch = useDispatch();

  const { state } = useLocation();

  useEffect(() => {
    clearUserTokens();

    dispatch(clearCollections());
    dispatch(clearProductList());
    dispatch(clearUserData());
  }, []);

  // FIXME: add logout logic
  return (
    <div
      className="container logout-page"
      style={{
        marginTop: "15vh",
        maxWidth: "540px",
        display: "flex",
        flexDirection: "column",
        rowGap: "20px",
      }}
    >
      <h1>Вы вышли из сервиса.</h1>
      <div style={{ fontSize: "1.2em" }}>
        <Link to="/login">Страница авторизации</Link>
      </div>

      {state && (
        <div style={{ color: "#CE6F6F" }}>
          Возникла ошибка авторизации. Причина: &quot;{state.reason}
          &quot;.
          <br />
          <br />
          Перейдите на страницу логина, чтобы авторизоваться повторно,
          или обратитесь к _кому-то_.
        </div>
      )}
    </div>
  );
};

export default Logout;
