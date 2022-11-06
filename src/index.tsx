import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
// import axios from "axios";
import * as serviceWorker from "./serviceWorker";
import AppStore, { StoreProvider } from "./services/mobx/service";
import { BrowserRouter } from "react-router-dom";

//initiating mobx store
const appStore = new AppStore();

//initiating persisted instance of state store

ReactDOM.render(
  <StoreProvider value={appStore}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StoreProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
