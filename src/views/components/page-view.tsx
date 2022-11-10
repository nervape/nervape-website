import React, { Component, useEffect, useState } from "react";
import { DataContext, getWindowWidthRange } from "../../utils/utils";
import Footer from "./footer";
import NavHeader from "./header";
import "./page-view.less";

interface PageViewState {
  windowWidth: number
}

export default function PageView(props: any) {
  const [windowWidth, setWindowWidth] = useState(0);
  const { children, activeIndex, disableFooter } = props;

  function fnResizeWindow() {
    const width = getWindowWidthRange();
    setWindowWidth(width);
  }

  useEffect(() => {
    fnResizeWindow();
    window.addEventListener("resize", fnResizeWindow, true);
    return () => {
      window.removeEventListener("resize", fnResizeWindow, true)
    }
  }, []);

  return (
    <DataContext.Provider value={{ windowWidth: windowWidth }}>
      <div className="page-view">
        <div className="page-header">
          <NavHeader
            activeIndex={activeIndex}
          ></NavHeader>
        </div>
        <div
          className="page-main"
        >
          <>
            {children}
            {!disableFooter && (
              <div className="page-footer">
                <Footer></Footer>
              </div>
            )}
          </>
        </div>
      </div>
    </DataContext.Provider>
  );
}
