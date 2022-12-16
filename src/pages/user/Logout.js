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

  const location = useLocation();

  useEffect(() => {
    clearUserTokens();

    dispatch(clearCollections());
    dispatch(clearProductList());
    dispatch(clearUserData());
  }, []);

  // FIXME: add logout logic
  return (
    <div>
      Logout PAGE
      <ul>
        <li>
          <Link to="/store">Store</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
      <div>{JSON.stringify(location)}</div>
    </div>
  );
};

export default Logout;
