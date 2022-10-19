import React, { Component } from "react";
import Footer from "./footer";
import { INavProps, NavHeader } from "./header";
import "./page-view.less";

export default class PageView extends Component<INavProps> {
  constructor(props: any) {
    super(props);
  }

  public headerRef: NavHeader | null = null;
  public mainRef: HTMLElement | null = null;

  render() {
    const { children, activeIndex, disableFooter } = this.props;
    return (
      <div className="page-view">
        <div className="page-header">
          <NavHeader
            activeIndex={activeIndex}
            ref={(el) => {
              this.headerRef = el;
            }}
          ></NavHeader>
        </div>
        <div
          className="page-main"
          ref={(el) => {
            this.mainRef = el;
          }}
        >
          <>
            {children}
            {!disableFooter && (
              <div className="page-footer">
                <Footer></Footer>
              </div>
            ) }
            
          </>
        </div>
      </div>
    );
  }
}
