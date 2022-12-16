import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { clearUserCart } from "../../redux/actions/userReducerDispatches/cartActions";

const Order = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearUserCart());
  }, []);

  return (
    <div
      className="container"
      style={{
        borderRadius: "15px",
        backgroundColor: "white",
        padding: "50px 5%",
        marginTop: "20vh",
        textAlign: "center",
      }}
    >
      <h3>Здесь можно попробовать сделать что-то красивое.</h3>
      <div>{JSON.stringify(location.state?.orderInfo)}</div>
    </div>
  );
};

export default Order;
