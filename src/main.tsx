import ReactDOM from "react-dom/client";
import "./index.less";
import { BrowserRouter, HashRouter } from "react-router-dom";
import moment from "moment-timezone";
import App from "./views/app";
import { StrictMode } from "react";

moment.tz.setDefault("Asia/Shanghai");

const root = ReactDOM.createRoot(document.getElementById("root") as Element);

root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
