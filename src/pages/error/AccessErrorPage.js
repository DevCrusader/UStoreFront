import React from "react";
import { Link, useLocation } from "react-router-dom";

const AccessErrorPage = () => {
  const { state } = useLocation();

  return (
    <div
      style={{
        marginTop: "15vh",
        maxWidth: "540px",
        display: "flex",
        flexDirection: "column",
        rowGap: "20px",
      }}
      className="container"
    >
      <h1>403 Error</h1>
      <p>
        Вам было отказано в доступе
        {state && state.pathname ? (
          <>
            к:{" "}
            <span style={{ color: "rgb(68, 133, 231)" }}>
              {state.pathname}
            </span>
          </>
        ) : (
          <></>
        )}
        .
      </p>
      <ul>
        <li>
          Вернуться на страницу магазина:{" "}
          <Link to="/store">Магазин</Link>.
        </li>
        <li>
          Вернуться на страницу пользователя:{" "}
          <Link to="/personal">Личная страница</Link>.
        </li>
      </ul>
    </div>
  );
};

export default AccessErrorPage;
