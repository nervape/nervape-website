import React, { Component, ReactNode } from "react";
import "./header.less";
import logo from "../../assets/logo/logo_nervape.svg";
import hamburger from "../../assets/icons/hamburger.svg";
import twitter from "../../assets/icons/twitter.svg";
import discord from "../../assets/icons/discord.svg";

import { NavTool } from "../../route/navi-tool";

export interface NavPageInfo {
  title: string;
  url: string;
  type: string;
  image: string;
}

export interface INavProps {
  activeIndex?: number;
  disableFooter?: boolean;
}

interface INavState extends INavProps {
  disableList: boolean;
}

const pages = [
  {
    title: "ABOUT",
    url: "/about",
    type: "navbar",
    image: "",
  },
  {
    title: "STORY",
    url: "/story",
    type: "navbar",
    image: "",
  },
  {
    title: "NFT",
    url: "/nft",
    type: "navbar",
    image: "",
  },
  {
    title: "CAMPAIGN",
    url: "/campaign",
    type: "navbar",
    image: "",
  },
  {
    title: "WALLET",
    url: "",
    type: "navbar",
    image: "",
  },
  {
    title: "BRIDGE",
    url: "",
    type: "action",
    image: "",
  },
  {
    title: "",
    url: "https://twitter.com/Nervapes",
    image: twitter,
    type: "icon"
  },
  {
    title: "",
    url: "https://discord.com/invite/7br6nvuNHP",
    image: discord,
    type: "icon"
  }
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

  // public componentDidMount() {
  //   window.removeEventListener("scroll", this.fnScrollWindow, true);
  //   window.addEventListener("scroll", this.fnScrollWindow, true);
  // }
  // public componentWillUnmount() {
  //   window.removeEventListener("scroll", this.fnScrollWindow, true);
  // }

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
              window.scrollTo(0, 0);
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
            className={`btn-group ${disableList === true ? "active-group" : ""
              }`}
          >
            {pages?.map((v: NavPageInfo, i: number) => (
              <div
                className={`nav-area ${v.type}`}
                key={i}
                onClick={() => {
                  this.fnClickNavButton(v);
                  window.scrollTo(0, 0);
                }}
              >
                {v.type === 'icon' ? (
                  <img className="icon-image" src={v.image} />
                ) : (
                  <div className="title-text">{v.title}</div>
                )}
                {/* <div className="select-line"></div> */}
              </div>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
