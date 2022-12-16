import { useReducer, useRef, useEffect } from "react";
import { FETCH_METHOD } from "../Consts";
import axios from "axios";

const useFetch = (options) => {
  const cancelRequest = useRef(false);

  const initialState = {
    loading: false,
    data: null,
    error: null,
  };

  const resultTypes = {
    START_FETCH: "START_FETCH",
    SET_DATA: "SET_DATA",
    SET_ERROR: "SET_ERROR",
  };

  const [result, dispatch] = useReducer(
    (state = initialState, action) => {
      switch (action.type) {
        case resultTypes.START_FETCH:
          return {
            ...initialState,
            loading: true,
          };
        case resultTypes.SET_DATA:
          return {
            ...initialState,
            data: action.payload,
          };
        case resultTypes.SET_ERROR:
          return {
            ...initialState,
            error: action.payload,
          };
        default:
          state;
      }
    },
    initialState
  );

  useEffect(() => {
    const {
      url,
      method = FETCH_METHOD.GET,
      data = {},
      headers = { "Content-Type": "application/json" },
    } = options;

    if (!url) return;

    cancelRequest.current = false;

    dispatch({ type: resultTypes.START_FETCH });

    axios({
      url,
      method,
      data,
      headers,
    })
      .then((res) => {
        if (!cancelRequest.current)
          dispatch({
            type: resultTypes.SET_DATA,
            payload: res.data,
          });
      })
      .catch((err) => {
        if (!cancelRequest.current) {
          dispatch({
            type: resultTypes.SET_ERROR,
            payload: {
              message: err.message,
              status: err.response.status,
              additionalInfo:
                err.response.status === 400
                  ? err.response.data
                  : null,
            },
          });
        }
      });

    return () => (cancelRequest.current = false);
  }, [options]);

  return result;
};

export default useFetch;
