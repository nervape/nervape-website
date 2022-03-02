import ReactDOM from "react-dom";
import "./index.less";
import { HashRouter } from "react-router-dom";
import moment from "moment-timezone";
import { App } from "./views/app";

moment.tz.setDefault("Asia/Shanghai");

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById("root")
);
