import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";

import App from "./App";
import { rootReducer } from "./redux/rootReducer";

import "./index.css";

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk)
    // window.__REDUX_DEVTOOLS_EXTENSION__ &&
    //   window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    {/* <React.StrictMode> */}
    <Router>
      <App />
    </Router>
    {/* </React.StrictMode> */}
  </Provider>
);
