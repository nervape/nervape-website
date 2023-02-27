import React, { useCallback, useContext, useEffect, useState } from "react";
import "./header.less";
import logo from "../../assets/logo/logo_nervape.svg";
import hamburger from "../../assets/icons/hamburger.svg";
import twitter from "../../assets/icons/twitter.svg";
import discord from "../../assets/icons/discord.svg";
import NacpLogo from '../../assets/logo/logo_nacp.svg';
import MNacpLogo from '../../assets/logo/m_nacp_logo.svg';

import { NavTool } from "../../route/navi-tool";
import { DataContext, getWindowScrollTop, scrollToTop } from "../../utils/utils";
import WalletConnect from "./wallet-connect";
import { Types } from "../../utils/reducers";
import { Tooltip } from 'antd';

export interface NavPageInfo {
  title: string;
  url: string;
  type: string;
  image: string;
  mImage?: string;
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
    title: "",
    url: "",
    type: "logo",
    image: NacpLogo,
    mImage: MNacpLogo
  },
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
    title: "BRIDGE",
    url: "https://www.nervape.com/bridge/",
    type: "navbar",
    image: "",
  },
];

export default function NavHeader(props: any) {
  const { activeIndex } = props;
  const [disableList, setDisableList] = useState(true);
  const [hideHeader, setHideHeader] = useState(false);

  const { state, dispatch } = useContext(DataContext);

  const fnFilter = useCallback(filterNfts(), []);

  function filterNfts() {
    let timer: any;
    let lastTop = 0;
    return function () {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        const currTop = getWindowScrollTop();
        if (currTop - lastTop > 10) {
          setHideHeader(true);
          setDisableList(true);
        } else if (currTop - lastTop < -10) {
          setHideHeader(false);
        }
        lastTop = currTop;
      }, 0);
    }
  }

  function fnScrollPage() {
    fnFilter();
  }

  useEffect(() => {
    if (!disableList || state.showLoginModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [disableList, state.showLoginModal]);
  useEffect(() => {
    scrollToTop();
    window.addEventListener('scroll', fnScrollPage, true)
    return () => {
      window.removeEventListener('scroll', fnScrollPage, true)
    }
  }, []);

  return (
    <div
      className={`header-container ${hideHeader && 'hide'}`}
    >
      <div
        className={`header ${!disableList && 'disable'}`}
      >
        <img
          className="logo"
          src={logo}
          onClick={() => {
            setDisableList(true);
            NavTool.fnJumpToPage('/');
            window.scrollTo(0, 0);
          }}
        />
        <div className="hamburger-c cursor">
          <img
            className="hamburger"
            src={hamburger}
            onClick={(e) => {
              setDisableList(!disableList);
            }}
          />
        </div>
        <div
          className="header-menu"
          onClick={() => {
            setDisableList(true);
          }}
        >
          <ul
            className={`btn-group ${disableList === true ? "active-group" : ""}`}
            onClick={(e) => { e.stopPropagation() }}
          >
            {state.windowWidth <= 750 && (
              <div className="nav-area wallet-login">
                <WalletConnect setDisableList={setDisableList}></WalletConnect>
              </div>
            )}
            {pages?.map((v: NavPageInfo, i: number) => {
              return (
                <div
                  className={`nav-area cursor ${v.type} ${activeIndex == i ? 'active' : ''}`}
                  key={i}
                  onClick={() => {
                    if (v.type === 'logo') return;
                    setDisableList(true);
                    dispatch({
                      type: Types.HideLoginModal
                    })
                    if (v.title === 'BRIDGE') {
                      window.open(v.url, '_self');
                    } else {
                      if (v.type === 'logo') return;
                      NavTool.fnJumpToPage(v.url);
                    }
                    window.scrollTo(0, 0);
                  }}
                >
                  {v.type === 'logo'
                    ? (
                      <Tooltip
                        key={i}
                        title={() => {
                          return (
                            <p>Coming Soon!</p>
                          );
                        }}
                        placement={state.windowWidth <= 750 ? 'right' : 'bottom'}
                        trigger={['hover', 'click']}
                        overlayClassName="tooltip"
                        color="#506077"
                      >
                        <div className="nacp-logo">
                          <img className="icon-image" src={state.windowWidth <= 750 ? v.mImage : v.image} alt="" />
                        </div>
                      </Tooltip>
                    )
                    : (<div className="title-text">{v.title}</div>)}
                </div>
              );
            })}
            <div className={`icon-nav-c ${state.windowWidth <= 750 && 'mobile'}`}>
              <div
                className={`nav-area cursor icon`}
                onClick={() => {
                  setDisableList(true);
                  window.open('https://twitter.com/Nervapes')
                }}
              >
                <img className="icon-image" src={twitter} alt="" />
              </div>
              <div
                className={`nav-area cursor icon`}
                onClick={() => {
                  setDisableList(true);
                  window.open('https://discord.com/invite/7br6nvuNHP')
                }}
              >
                <img className="icon-image" src={discord} alt="" />
              </div>
            </div>

            {state.windowWidth > 750 && (
              <div className="nav-area wallet-login">
                <WalletConnect></WalletConnect>
              </div>
            )}
          </ul>
        </div>

      </div>
    </div>
  );
}
