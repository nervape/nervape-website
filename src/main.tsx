import { render } from "react-dom";
import "./index.less";
import { BrowserRouter, HashRouter } from "react-router-dom";
import moment from "moment-timezone";
import App from "./views/app";
import { StrictMode } from "react";

moment.tz.setDefault("Asia/Shanghai");

render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,

  document.getElementById("root")
);
