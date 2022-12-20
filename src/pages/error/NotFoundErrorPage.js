import React from "react";
import { Link, useLocation } from "react-router-dom";

const NotFoundErrorPage = () => {
  const { pathname } = useLocation();

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
      <h1>404 Error</h1>
      <p>
        Путь <span style={{ color: "#4485E7" }}>{pathname}</span> не
        существует.
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

export default NotFoundErrorPage;
