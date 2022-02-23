import React, { Component, ReactNode } from "react";
import "./header.less";
import logo from "../../assets/logo/logo_nervape.svg";
import hamburger from "../../assets/icons/hamburger.svg";
import { history } from "../../route/history";

export interface NavPageInfo {
  title?: String;
  url?: String[];
  active?: boolean;
}

export interface INavProps {
  pages?: NavPageInfo[];
}

interface INavState extends INavProps {
  disableList: boolean;
}

export class NavBar extends Component<INavProps, INavState> {
  constructor(props: INavProps) {
    super(props);
    this.state = {
      ...props,
      disableList: true,
    };

    this.fnScrollWindow = this.fnScrollWindow.bind(this);
  }

  public fnClickNavButton(v: NavPageInfo) {
    this.setState({
      disableList: true,
    });
    const urlParams = new URL(window.location.href);
    const pathname = urlParams?.pathname;
    if (v.url?.indexOf(pathname) !== -1) {
      return;
    }

    history.push(`${v.url}`);
    console.log(`naigator jump to:${v.url}`);
    this.fnActiveButtonFromkUrl();
  }

  public fnActiveButtonFromkUrl() {
    const urlParams = new URL(window.location.href);
    const pathname = urlParams?.pathname;
    console.log("check url pathname:", pathname);
    const { pages } = this.state;
    const result = [];
    pages?.map((v) => {
      if (v.url?.indexOf(pathname) !== -1) {
        v.active = true;
        result.push(v);
      } else {
        v.active = false;
      }
    });
    if (result.length !== 1) {
      throw "page header route url error";
    }
    this.setState({ pages });
  }

  public fnClickHamburger() {
    this.setState({
      disableList: !this.state.disableList,
    });
  }

  private m_elContainer: HTMLElement | null = null;
  private m_elHeader: HTMLElement | null = null;

  public fnScrollWindow(e: Event) {
    const container = this.m_elContainer as HTMLElement;
    const header = this.m_elHeader as HTMLElement;
    const rect = container.getBoundingClientRect();
    // console.log(rect);
    if (rect.top < 0) {
      header.style.position = "fixed";
    } else {
      header.style.position = "";
    }
  }

  public componentDidMount() {
    this.fnActiveButtonFromkUrl();
    window.removeEventListener("scroll", this.fnScrollWindow, true);
    window.addEventListener("scroll", this.fnScrollWindow, true);
  }
  public componentWillUnmount() {
    window.removeEventListener("scroll", this.fnScrollWindow, true);
  }

  public render() {
    const { pages, disableList } = this.state;
    // console.log("render");
    return (
      <div
        className="header-container"
        ref={(el) => {
          this.m_elContainer = el;
        }}
      >
        <div
          className="header"
          ref={(el) => {
            this.m_elHeader = el;
          }}
        >
          <img
            className="logo"
            src={logo}
            onClick={() => {
              this.fnClickNavButton((pages as NavPageInfo[])[0]);
            }}
          />
          <img
            className="hamburger"
            src={hamburger}
            onClick={(e) => {
              this.fnClickHamburger();
            }}
          />
          <ul
            className={`btn-group ${
              disableList === true ? "active-group" : ""
            }`}
          >
            {pages?.map((v: NavPageInfo, i: number) => (
              <div
                className={`nav-area ${v.active ? "nav-area-active" : ""}`}
                key={v.title as React.Key}
                onClick={(e) => {
                  this.fnClickNavButton(v);
                }}
              >
                <div className="title-text">{v.title}</div>
                <div className="select-line"></div>
              </div>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
