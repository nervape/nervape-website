import ReactDOM from "react-dom";
import "./index.less";
import { BrowserRouter, HashRouter } from "react-router-dom";
import moment from "moment-timezone";
import { App } from "./views/app";
import { StrictMode } from "react";

moment.tz.setDefault("Asia/Shanghai");

ReactDOM.render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,

  document.getElementById("root")
);
