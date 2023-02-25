import React, { useEffect, useReducer } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavTool } from "../../route/navi-tool";
import { globalReducer, Types } from "../../utils/reducers";
import { DataContext, initialState } from "../../utils/utils";
import Footer from "./footer";
import NavHeader from "./header";
import LoadingModal from "./loading/loading";
import "./page-view.less";
import LoginModal from "./wallet-connect/login-modal";

interface PageViewState {
  windowWidth: number
}

export default function PageView(props: any) {
  NavTool.navigation = useNavigate();
  NavTool.location = useLocation();
  const { children, activeIndex, disableFooter } = props;

  const [state, dispatch] = useReducer(globalReducer, initialState);

  function fnResizeWindow() {
    dispatch({
      type: Types.UpdateWindowWith
    });
  }

  useEffect(() => {
    fnResizeWindow();
    window.addEventListener("resize", fnResizeWindow, true);
    return () => {
      window.removeEventListener("resize", fnResizeWindow, true)
    }
  }, []);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
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
        <LoadingModal show={state.loading}></LoadingModal>
        <LoginModal activeIndex={activeIndex} ></LoginModal>
      </div>
    </DataContext.Provider>
  );
}
