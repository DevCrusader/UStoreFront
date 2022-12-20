import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BACKEND_PATH } from "../Consts";
import useFetchWithAuth from "../hooks/useFetchWithAuth";
import { updateUserBalance } from "../redux/actions/userReducerDispatches/userInfoActions";

const UpdateBalanceComponent = () => {
  const dispatch = useDispatch();

  const [fetchConfig, setFetchConfig] = useState({});
  const { data } = useFetchWithAuth(fetchConfig);

  useEffect(() => {
    setFetchConfig({
      url: `${BACKEND_PATH}/user/customer/balance/`,
    });
  }, []);

  useEffect(() => {
    if (data) {
      if (typeof data === "number") {
        dispatch(updateUserBalance(data));
      }
    }
  }, [data]);

  return <></>;
};

export default UpdateBalanceComponent;
