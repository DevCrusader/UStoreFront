import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import "../static/css/headerStyles.css";
import NumberWithUcoin from "../utils/NumberWithUcoin";

const Header = () => {
  return (
    <>
      <div className="service-header">
        <ul className="container">
          <li>
            <Link to={"/store"} className="store-link">
              <span className="icon"></span>
              <span></span>
            </Link>
            <HeaderAdminLink />
          </li>
          <li>
            <HeaderPersonalPageLink />
            <Link to={"/logout"} className="logout-link icon">
              <span className="icon"></span>
              <span className="text">Выйти</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="post-header"></div>
    </>
  );
};

export default Header;

const HeaderAdminLink = () => {
  const adminPermission = useSelector(
    (state) => state.user.info.permission
  );

  if (!adminPermission) {
    return;
  }

  return (
    <Link to={"/admin"} className="admin-page-link">
      <span className="icon"></span>
      <span className="text">Админ-страница</span>
    </Link>
  );
};

const HeaderPersonalPageLink = () => {
  const userBalance = useSelector((state) => state.user.info.balance);

  return (
    <Link to={"/"} className="personal-page-link icon">
      <span className="icon"></span>
      <span className="text">
        <NumberWithUcoin number={userBalance ? userBalance : 0} />
      </span>
    </Link>
  );
};
