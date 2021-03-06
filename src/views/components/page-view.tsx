import React, { Component } from "react";
import { Footer } from "./footer";
import { INavProps, NavHeader } from "./header";
import "./page-view.less";

export default class PageView extends Component<INavProps> {
  constructor(props: any) {
    super(props);
  }

  public headerRef: NavHeader | null = null;
  public mainRef: HTMLElement | null = null;
  public footerRef: Footer | null = null;

  fnUpdateView() {
    const header = (this.headerRef as NavHeader).domRoot as HTMLElement;
    const main = this.mainRef as HTMLElement;
    const footer = (this.footerRef as Footer).domRoot as HTMLElement;

    const headerH = header.getBoundingClientRect().height;
    const footerH = footer.getBoundingClientRect().height;

    let mainH = 0;
    main.childNodes.forEach((n) => {
      const el = n as HTMLElement;
      const h = el.getBoundingClientRect().height;
      mainH += h;
    });
    // console.log(mainH);
    if (headerH + mainH + footerH <= window.innerHeight) {
      const minHeight = window.innerHeight - headerH - footerH;
      main.style.height = `${minHeight > 0 ? minHeight : 0}px`;
    } else {
      main.style.height = `auto`;
    }
  }

  render() {
    const { children, activeIndex } = this.props;
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
          {children}
        </div>
        <div className="page-footer">
          <Footer
            ref={(el) => {
              this.footerRef = el;
            }}
          ></Footer>
        </div>
      </div>
    );
  }
}
