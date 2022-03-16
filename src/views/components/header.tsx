import React, { Component, ReactNode } from "react";
import "./header.less";
import logo from "../../assets/logo/logo_nervape.svg";
import hamburger from "../../assets/icons/hamburger.svg";
import { NavTool } from "../../route/navi-tool";

export interface NavPageInfo {
  title: string;
  url: string;
}

export interface INavProps {
  activeIndex?: number;
}

interface INavState extends INavProps {
  disableList: boolean;
}

const pages = [
  {
    title: "About Nervape",
    url: "/about",
  },
  {
    title: "NFT Gallery",
    url: "/nft",
  },
  {
    title: "Stories",
    url: "/story",
  },
  {
    title: "Campaign",
    url: "/campaign",
  },
];

export class NavHeader extends Component<INavProps, INavState> {
  constructor(props: INavProps) {
    super(props);
    this.state = {
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

  public fnClickHamburger() {
    this.setState({
      disableList: !this.state.disableList,
    });
  }

  public domRoot: HTMLElement | null = null;
  public domHeader: HTMLElement | null = null;

  public fnScrollWindow(e: Event) {
    const container = this.domRoot as HTMLElement;
    const header = this.domHeader as HTMLElement;
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
    const { disableList } = this.state;
    const { activeIndex } = this.props;

    return (
      <div
        className="header-container"
        ref={(el) => {
          this.domRoot = el;
        }}
      >
        <div
          className="header"
          ref={(el) => {
            this.domHeader = el;
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
