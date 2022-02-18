import React, { Component, ReactNode } from "react";
import "./header.less";
import logo from "../../assets/logo/logo_nervape.svg";
import hamburger from "../../assets/icons/hamburger.svg";
import { history } from "../../route/history";

export interface NavPageInfo {
  title?: String;
  url?: String;
  active?: boolean;
}

export interface INavProps {
  home?: NavPageInfo;
  pages?: NavPageInfo[];
}

interface INavState extends INavProps {}

export class NavBar extends Component<INavProps, INavState> {
  private m_group: HTMLElement | null = null;
  constructor(props: INavProps) {
    super(props);
    if (props.home) {
      this.state = {
        home: { ...props.home },
      };
    }

    if (props.pages) {
      this.state = {
        pages: [...props.pages],
      };
    }
  }
  public fnSelectedItem(v: NavPageInfo) {
    const pages = this.state.pages as NavPageInfo[];
    pages.map((item) => {
      item.active = false;
    });
    v.active = true;
    this.setState({
      pages: pages,
    });
  }

  public render() {
    const { pages } = this.state;
    return (
      <div className="header">
        <img className="logo" src={logo} />
        <img
          className="hamburger"
          src={hamburger}
          onClick={(e) => {
            const group = this.m_group as HTMLElement;
            if (group.style.display === "") {
              group.style.display = "block";
            } else {
              group.style.display = "";
            }
          }}
        />
        <ul
          className="btn-group"
          ref={(dom) => {
            this.m_group = dom;
          }}
        >
          {pages?.map((v: NavPageInfo, i: number) => (
            <div
              className={`nav-area ${v.active ? "nav-area-active" : ""}`}
              key={v.title as React.Key}
              onClick={(e) => {
                this.fnSelectedItem(v);
                history.push(`${v.url}`);
                console.log(history);
              }}
            >
              <div className="title-text">{v.title}</div>
              <div className="select-line"></div>
            </div>
          ))}
        </ul>
      </div>
    );
  }
}
