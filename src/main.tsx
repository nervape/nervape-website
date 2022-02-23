import React from "react";
import ReactDOM from "react-dom";
import { App } from "./views/app";
import "./index.less";
import { HashRouter } from "react-router-dom";

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById("root")
);
