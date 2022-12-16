import React from "react";
import { Link, useLocation } from "react-router-dom";

const NotFoundErrorPage = () => {
  const { pathname } = useLocation();

  return (
    <div>
      404 NotFound
      <p>
        Current path:{" "}
        <span style={{ color: "blue" }}>{pathname}</span>
      </p>
      Does not exist.
      <div>
        <Link to="/store">Store</Link>
      </div>
    </div>
  );
};

export default NotFoundErrorPage;
