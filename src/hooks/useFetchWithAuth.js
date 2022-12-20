import {
  useEffect,
  useRef,
  useState,
  useReducer,
  useContext,
} from "react";
import AuthContext from "../context/AuthContext";
import useFetch from "./useFetch";

const useFetchWithAuth = (options) => {
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

  const { userTokens, updated, refreshTokens } =
    useContext(AuthContext);
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

  const [fetchConfig, setFetchConfig] = useState({});
  const { loading, error, data } = useFetch(fetchConfig);

  const fetchHasBeenInterrupted = useRef(false);

  useEffect(() => {
    if (loading) dispatch({ type: resultTypes.START_FETCH });
  }, [loading]);

  useEffect(() => {
    if (data) dispatch({ type: resultTypes.SET_DATA, payload: data });
  }, [data]);

  useEffect(() => {
    if (error)
      dispatch({ type: resultTypes.SET_ERROR, payload: error });
  }, [error]);

  useEffect(() => {
    if (updated) {
      if (options) {
        setFetchConfig({
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${userTokens.access}`,
          },
        });
      }
    } else {
      fetchHasBeenInterrupted.current = true;
      refreshTokens();
    }
  }, [options]);

  useEffect(() => {
    if (fetchHasBeenInterrupted.current && options) {
      fetchHasBeenInterrupted.current = false;
      setFetchConfig({
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${userTokens.access}`,
        },
      });
    }
  }, [userTokens]);

  return result;
};

export default useFetchWithAuth;
