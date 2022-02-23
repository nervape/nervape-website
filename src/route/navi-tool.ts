import React from "react";
import { createHashHistory } from "history";
import {
  NavigateFunction,
  NavigateOptions,
  Router,
  Location,
} from "react-router-dom";

// export const history = createHashHistory();

// export const fnJumpToPage = (path: string, param: string = "") => {
//   const location = history.location;

//   // const tgUrl = new URL(format);
//   const toUrl = toPath + (toParam === "" ? "" : `?${toParam}`);

//   const from = location.pathname + location.search;
//   if (from === toUrl) {
//     return;
//   }
//   history.push(toUrl);
//   console.log(`naigator from${from} to:${toUrl}`);
// };

export class NavTool {
  public static fnStdNavStr(str: string) {
    return str.toLocaleLowerCase().trim().replace(/\s+/g, "");
  }
  public static navigation: NavigateFunction;
  public static location: Location = { ...window.location, state: {}, key: "" };

  public static fnJumpToPage = (path: string) => {
    const toPath = NavTool.fnStdNavStr(path);
    const navigation = NavTool.navigation;
    navigation(toPath);
  };

  public static fnQueryParam = (name: string) => {
    const location = NavTool.location;
    const search = location.search;
    const p = new URLSearchParams(search);
    return p.get(name);
  };

  public static fnCheckLocation() {}
}
