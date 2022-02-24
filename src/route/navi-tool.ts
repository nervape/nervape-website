import { NavigateFunction, Location } from "react-router-dom";

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
