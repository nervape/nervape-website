import React, { Component } from "react";
import "./navbar.less";
import logo from "../../assets/logo/logo_nervape.svg";
import hamburger from "../../assets/icons/hamburger.svg";
import { history } from "../..//history";

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
    console.log(this.props);
    return (
      <div className="navbar">
        <img className="logo" src={logo} alt="" />
        <img className="hamburger" src={hamburger} alt="" />
        <ul className="btn-group">
          {pages?.map((v: NavPageInfo, i: number) => (
            <div
              className={`nav-area ${v.active ? "nav-area-active" : ""}`}
              key={v.title as React.Key}
              onClick={(e) => {
                this.fnSelectedItem(v);
                history.push(`${v.url}`);
                console.log(history)
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
