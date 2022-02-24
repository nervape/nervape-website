import React, { Component, ReactNode } from "react";
import "./header.less";
import logo from "../../assets/logo/logo_nervape.svg";
import hamburger from "../../assets/icons/hamburger.svg";
import { NavTool } from "../../route/navi-tool";
import { Location, useLocation } from "react-router";

export interface NavPageInfo {
  title: string;
  url: string;
}

export interface INavProps {
  pages?: NavPageInfo[];
}

interface INavState extends INavProps {
  pages: NavPageInfo[];
  disableList: boolean;
}

export class NavBar extends Component<INavProps, INavState> {
  constructor(props: INavProps) {
    super(props);
    this.state = {
      pages: props.pages ? props.pages : [],
      disableList: true,
    };

    this.fnScrollWindow = this.fnScrollWindow.bind(this);
  }

  public fnClickNavButton(page: NavPageInfo) {
    this.setState({
      disableList: true,
    });

    NavTool.fnJumpToPage(page.url);
  }

  public fnCheckUrl() {
    const { pages } = this.state;
    const location = NavTool.location;
    const pathname = NavTool.location.pathname;
    // console.log(location, pathname);

    let activeIndex = 0;
    pages.map((v, i) => {
      if (v.url === pathname) {
        if (activeIndex !== i) {
          activeIndex = i;
        }
      }
    });

    return activeIndex;
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
    window.removeEventListener("scroll", this.fnScrollWindow, true);
    window.addEventListener("scroll", this.fnScrollWindow, true);
  }
  public componentWillUnmount() {
    window.removeEventListener("scroll", this.fnScrollWindow, true);
  }

  public render() {
    const { pages, disableList } = this.state;
    const activeIndex = this.fnCheckUrl();
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
                className={`nav-area ${
                  i === activeIndex ? "nav-area-active" : ""
                }`}
                key={i}
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
