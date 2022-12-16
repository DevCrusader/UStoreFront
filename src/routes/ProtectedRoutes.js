import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/Header";
import AuthContext from "../context/AuthContext";

const ProtectedRoutes = () => {
  const { userTokens } = useContext(AuthContext);

  return userTokens && userTokens.access && userTokens.refresh ? (
    <>
      <Header />
      <Outlet />
    </>
  ) : (
    <Navigate
      to="/login"
      state={{
        from: window.location.pathname,
        reason: "User tokens invalid.",
      }}
    />
  );
};

export default ProtectedRoutes;
