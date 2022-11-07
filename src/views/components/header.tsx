import React, { Component, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import "./header.less";
import logo from "../../assets/logo/logo_nervape.svg";
import hamburger from "../../assets/icons/hamburger.svg";
import twitter from "../../assets/icons/twitter.svg";
import discord from "../../assets/icons/discord.svg";

import { NavTool } from "../../route/navi-tool";
import { DataContext, getWindowScrollTop, scrollToTop } from "../../utils/utils";
import { Tooltip } from "antd";

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
  // {
  //   title: "",
  //   url: "https://twitter.com/Nervapes",
  //   image: twitter,
  //   type: "icon"
  // },
  // {
  //   title: "",
  //   url: "https://discord.com/invite/7br6nvuNHP",
  //   image: discord,
  //   type: "icon"
  // }
];

export default function NavHeader(props: any) {
  const { activeIndex } = props;
  const [disableList, setDisableList] = useState(true);
  const [hideHeader, setHideHeader] = useState(false);

  const { windowWidth } = useContext(DataContext);

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
    if (!disableList) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [disableList]);
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
            NavTool.fnJumpToPage('');
            window.scrollTo(0, 0);
          }}
        />
        <img
          className="hamburger"
          src={hamburger}
          onClick={(e) => {
            setDisableList(!disableList);
          }}
        />
        <div className="header-menu">
          <ul
            className={`btn-group ${disableList === true ? "active-group" : ""
              }`}
          >
            {pages?.map((v: NavPageInfo, i: number) => {
              if (v.title === 'WALLET' || v.title === 'BRIDGE') {
                return (
                  <Tooltip
                    key={i}
                    title={() => {
                      return (
                        <p>Coming Soon!</p>
                      );
                    }}
                    placement="bottom"
                    trigger={['hover', 'click']}
                    overlayClassName="tooltip"
                    color="#506077"
                  >
                    <div className={`nav-area ${v.type}`}>
                      <div className="title-text">{v.title}</div>
                    </div>
                  </Tooltip>
                );
              } else {
                return (
                  <div
                    className={`nav-area ${v.type}`}
                    key={i}
                    onClick={() => {
                      setDisableList(true);
                      NavTool.fnJumpToPage(v.url);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <div className="title-text">{v.title}</div>
                  </div>
                );
              }
            })}
            <div className={`icon-nav-c ${windowWidth === 375 && 'mobile'}`}>
              <div
                className={`nav-area icon`}
                onClick={() => {
                  setDisableList(true);
                  window.open('https://twitter.com/Nervapes')
                }}
              >
                <img className="icon-image" src={twitter} alt="" />
              </div>
              <div
                className={`nav-area icon`}
                onClick={() => {
                  setDisableList(true);
                  window.open('https://discord.com/invite/7br6nvuNHP')
                }}
              >
                <img className="icon-image" src={discord} alt="" />
              </div>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}
