import React from "react";
import { useSelector } from "react-redux";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "../../static/css/adminStyles.css";

const AdminMain = () => {
  const adminPermission = useSelector(
    (state) => state.user.info.permission
  );

  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (!adminPermission) {
    navigate("/access-error", {
      state: {
        pathname,
        reason: `Отказано в доступе к запрашиваемому ресурсу, 
        у Вас недостаточно прав. Запросите их у 
        администратора сервиса в случае необходимости.`,
      },
    });
  }

  const currentBlock = pathname.split("/")[2];

  return (
    <div className="admin-wrapper container">
      <div className="admin-navigation-container">
        <ul className="admin-navigation">
          <li
            className={`customers-action ${
              currentBlock === "orders" ? "current" : ""
            }`}
          >
            <Link to="/admin/orders">Заказы</Link>
          </li>
          <li
            className={`customers-action ${
              currentBlock === "requests" ? "current" : ""
            }`}
          >
            <Link to="/admin/requests">Запросы</Link>
          </li>
          <li
            className={`admin-action ${
              currentBlock === "users" ? "current" : ""
            }`}
          >
            <Link to="/admin/users">Управление пользователями</Link>
          </li>
        </ul>
      </div>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminMain;
