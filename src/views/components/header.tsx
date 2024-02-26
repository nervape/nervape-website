import React, { ReactElement, useCallback, useContext, useEffect, useState } from "react";
import "./header.less";
import logo from "../../assets/logo/logo_nervape.svg";
import hamburger from "../../assets/icons/hamburger.svg";
import twitter from "../../assets/icons/twitter.svg";
import discord from "../../assets/icons/discord.svg";
import instegram from "../../assets/icons/instegram.svg";
import NacpLogo from '../../assets/logo/logo_nacp.svg';
import MNacpLogo from '../../assets/logo/m_nacp_logo.svg';
import HeaderOpenIcon from '../../assets/icons/header-open.svg';
import HallweenNacpLogo from '../../assets/nacp/hallween/hallween_nacp_logo.svg';
import HallweenTitle from '../../assets/nacp/hallween/hallween_title.svg';

import { NavTool } from "../../route/navi-tool";
import { DataContext, getWindowScrollTop, scrollToTop, updateBodyOverflow } from "../../utils/utils";
import WalletConnect from "./wallet-connect";
import { Types } from "../../utils/reducers";
import { Dropdown, Menu, MenuProps, Tooltip } from 'antd';
import { CONFIG } from "../../utils/config";

type MenuItem = Required<MenuProps>['items'][number];

export interface NavPageInfo {
  title: string;
  key: string;
  type: string;
  image: string;
  mImage?: string;
  eleItem?: Function;
}

export interface INavProps {
  activeIndex?: number;
  disableFooter?: boolean;
}

interface INavState extends INavProps {
  disableList: boolean;
}

const getItem = (
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
) => {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const NacpTooltip = (id: string, key: string, placement?: 'bottom' | 'right') => {
  return (
    <div onClick={() => {
      handleHeaderClick(key);
      updateBodyOverflow(true);
      document.getElementById(id)?.setAttribute('class', 'header-open');
    }}>
      <Tooltip
        overlayClassName="tooltip gallery-tooltip"
        color="#506077"
        // @ts-ignore
        getPopupContainer={() => document.getElementById('header-container')}
        placement={placement || 'bottom'}
        title="Coming Soon!">
        <div>NACP</div>
      </Tooltip>
    </div>
  );
}

const MNacpTooltip = (key: string, placement?: 'bottom' | 'right') => {
  return (
    <div onClick={e => {
      handleHeaderClick(key);
      e.stopPropagation();
    }}>
      <Tooltip
        overlayClassName="tooltip gallery-tooltip"
        color="#506077"
        placement={placement || 'right'}
        title="Coming Soon!">
        NACP
      </Tooltip>
    </div>
  );
}

const handleHeaderClick = (key: string) => {
  const item = headers[key];
  if (item) {
    switch (item.type) {
      case HeaderType.Logo:
        window.scrollTo(0, 0);
        NavTool.fnJumpToPage(item.url);
        break;
      case HeaderType.Navbar:
        window.scrollTo(0, 0);
        NavTool.fnJumpToPage(item.url);
        break;
      case HeaderType.Coming:
        return;
      case HeaderType.Open:
        window.open(item.url);
        break;
    }
  }
}

const GalleryItems: MenuProps = {
  items: [
    {
      label: (
        <div onClick={() => {
          handleHeaderClick('galleryCollection');
          updateBodyOverflow(true);
          document.getElementById('gallery-open-icon')?.setAttribute('class', 'header-open');
          NavTool.fnJumpToPage('/3dnft');
        }}>3D COLLECTION</div>
      ),
      key: '-1'
    },
    {
      label: (
        <div onClick={() => {
          handleHeaderClick('galleryCoCreation');
          updateBodyOverflow(true);
        }}>Collab NFTs</div>
      ),
      key: '1'
    },
    {
      label: NacpTooltip('gallery-open-icon', 'galleryNacp'),
      key: '0'
    }
  ]
};

const BuyChildrenItems: MenuItem[] = [
  getItem('3D COLLECTION', 'buyCollection', null, [
    getItem('CHARACTER', 'buyCollectionCharacter'),
    getItem('ITEM', 'buyCollectionItem'),
    getItem('SCENE', 'buyCollectionScene'),
    getItem('SPECIAL', 'buyCollectionSpecial'),
  ])
];

const HallweenNacpItems: MenuProps = {
  items: [
    {
      label: (
        <div onClick={() => {
          handleHeaderClick('nacp');
          updateBodyOverflow(true);
        }}>
          <img src={NacpLogo} alt="NacpLogo" />
        </div>
      ),
      key: '-1'
    },
    {
      label: (
        <div onClick={() => {
          window.open(`${CONFIG.WEBSITE_HOST}/halve-ape-blast/nacp/`, '_block');
        }}>
          <img src={HallweenTitle} alt="HallweenTitle" />
        </div>
      ),
      key: '0'
    }
  ]
};

const BuyItems: MenuProps = {
  items: [
    {
      label: (
        <div onClick={() => {
          updateBodyOverflow(true);
          document.getElementById('buy-open-icon')?.setAttribute('class', 'header-open');
        }}>
          <Menu
            expandIcon={() => {
              return (
                <img id="buy-item-open-icon" className="header-open" src={HeaderOpenIcon} />
              );
            }}
            onOpenChange={open => {
              updateBodyOverflow(!(open.length > 0));
              document.getElementById('buy-item-open-icon')?.setAttribute('class', open.length > 0 ? 'header-open open' : 'header-open')
            }}
            mode="vertical"
            onClick={(e) => {
              handleHeaderClick(e.key);
            }}
            items={BuyChildrenItems}></Menu>
        </div>
      ),
      key: '-1'
    },
    {
      label: NacpTooltip('buy-open-icon', 'buyNacp'),
      key: '0'
    }
  ]
};

const CommunityItems: MenuProps = {
  items: [
    {
      label: (
        <div onClick={() => {
          handleHeaderClick('community');
          updateBodyOverflow(true);
        }}>COMMUNITY NEWS</div>
      ),
      key: '-1'
    },
    {
      label: (
        <div onClick={() => {
          handleHeaderClick('campaign');
          updateBodyOverflow(true);
        }}>CAMPAIGN</div>
      ),
      key: '-1'
    }
  ]
};

const pages: NavPageInfo[] = [
  {
    title: "",
    key: "",
    type: "logo",
    image: NacpLogo,
    mImage: MNacpLogo,
    eleItem: () => {
      return (
        <Dropdown
          menu={HallweenNacpItems}
          // @ts-ignore
          getPopupContainer={() => document.getElementById('header-container')}
          overlayClassName="hallween-items gallery-items"
          onOpenChange={open => {
            updateBodyOverflow(!open);
          }}>
          <div className="hallween-item title-text">
            <img src={HallweenNacpLogo} className="hallween-nacp-logo" alt="" />
          </div>
        </Dropdown>
      )
    }
  },
  {
    title: "ABOUT",
    key: "about",
    type: "navbar",
    image: "",
  },
  {
    title: "STORY",
    key: "story",
    type: "navbar",
    image: "",
  },
  {
    title: "GALLERY",
    key: "",
    type: "hover",
    image: "",
    eleItem: () => {
      return (
        <Dropdown
          menu={GalleryItems}
          // @ts-ignore
          getPopupContainer={() => document.getElementById('header-container')}
          overlayClassName="gallery-items"
          onOpenChange={open => {
            updateBodyOverflow(!open);
            document.getElementById('gallery-open-icon')?.setAttribute('class', open ? 'header-open open' : 'header-open')
          }}>
          <div className="gallery-item title-text">
            GALLERY
            <img id="gallery-open-icon" src={HeaderOpenIcon} className="header-open" alt="" />
          </div>
        </Dropdown>
      );
    }
  },
  {
    title: "BUY",
    key: "",
    type: "hover",
    image: "",
    eleItem: () => {
      return (
        <Dropdown
          menu={BuyItems}
          // @ts-ignore
          getPopupContainer={() => document.getElementById('header-container')}
          overlayClassName="gallery-items"
          onOpenChange={open => {
            updateBodyOverflow(!open);
            document.getElementById('buy-open-icon')?.setAttribute('class', open ? 'header-open open' : 'header-open')
          }}>
          <div className="gallery-item title-text">
            BUY
            <img id="buy-open-icon" src={HeaderOpenIcon} className="header-open" alt="" />
          </div>
        </Dropdown>
      );
    }
  },
  {
    title: 'COMMUNITY',
    key: "",
    type: "hover",
    image: "",
    eleItem: () => {
      return (
        <Dropdown
          menu={CommunityItems}
          // @ts-ignore
          getPopupContainer={() => document.getElementById('header-container')}
          overlayClassName="gallery-items"
          onOpenChange={open => {
            updateBodyOverflow(!open);
            document.getElementById('buy-open-icon')?.setAttribute('class', open ? 'header-open open' : 'header-open')
          }}>
          <div className="gallery-item title-text">
            COMMUNITY
            <img id="buy-open-icon" src={HeaderOpenIcon} className="header-open" alt="" />
          </div>
        </Dropdown>
      );
    }
  },
  {
    title: "BRIDGE",
    key: "bridge",
    type: "navbar",
    image: "",
  },
];

enum HeaderType {
  Logo = 'logo',
  Navbar = 'navbar',
  Open = 'open',
  Coming = 'coming'
}

const headers: { [propName: string]: { url: string; type: HeaderType; } } = {
  nacp: {
    url: '/nacp',
    type: HeaderType.Logo
  },
  about: {
    url: '/about',
    type: HeaderType.Navbar
  },
  story: {
    url: '/story',
    type: HeaderType.Navbar
  },
  galleryCollection: {
    url: '/3dnft',
    type: HeaderType.Navbar
  },
  galleryCoCreation: {
    url: '/collab-nfts',
    type: HeaderType.Navbar
  },
  galleryNacp: {
    url: '',
    type: HeaderType.Coming
  },
  buyCollectionCharacter: {
    url: 'https://nft.yokaiswap.com/nfts/collections/0xabD318eEc719a1b38d4eAfDa0b7465AB16EB1641',
    type: HeaderType.Open
  },
  buyCollectionItem: {
    url: 'https://nft.yokaiswap.com/nfts/collections/0xf780a8e4E9a5eaeC25bd7baBa88b9071C949e259',
    type: HeaderType.Open
  },
  buyCollectionScene: {
    url: 'https://nft.yokaiswap.com/nfts/collections/0x6eeBA0a2c22310F225524D89B3fcEaEeF6aC75CF',
    type: HeaderType.Open
  },
  buyCollectionSpecial: {
    url: 'https://nft.yokaiswap.com/nfts/collections/0xEbf51a5B54B8fE069Bc5858be864AeD179EA0795',
    type: HeaderType.Open
  },
  buyNacp: {
    url: '',
    type: HeaderType.Coming
  },
  campaign: {
    url: '/campaign',
    type: HeaderType.Navbar
  },
  community: {
    url: '/community',
    type: HeaderType.Navbar
  },
  bridge: {
    url: 'https://www.nervape.com/bridge/',
    type: HeaderType.Open
  }
};

const mPages: MenuItem[] = [
  getItem((
    <img src={HallweenNacpLogo} className="hallween-nacp-logo" alt="" />
  ), 'nacpCollection', null, [
    getItem((
      <div onClick={() => {
        handleHeaderClick('nacp');
      }}>
        <img src={NacpLogo} alt="NacpLogo" />
      </div>
    ), 'nacp'),
    getItem((
      <div onClick={() => {
        window.open(`${CONFIG.WEBSITE_HOST}/halve-ape-blast/nacp/`, '_block');
      }}>
        <img src={HallweenTitle} alt="HallweenTitle" />
      </div>
    ), 'hallween-nacp')
  ]),
  getItem('ABOUT', 'about'),
  getItem('STORY', 'story'),
  getItem('GALLERY', 'gallery', null, [
    getItem('3D COLLECTION', 'galleryCollection'),
    getItem('Collab NFTs', 'galleryCoCreation'),
    getItem(MNacpTooltip('galleryNacp', 'right'), 'galleryNacp')
  ]),
  getItem('BUY', 'buy', null, [
    getItem('3D COLLECTION', 'buyCollection', null, [
      getItem('CHARACTER', 'buyCollectionCharacter'),
      getItem('ITEM', 'buyCollectionItem'),
      getItem('SCENE', 'buyCollectionScene'),
      getItem('SPECIAL', 'buyCollectionSpecial'),
    ]),
    getItem(MNacpTooltip('buyNacp', 'right'), 'buyNacp')
  ]),
  getItem('COMMUNITY', 'communityCollection', null, [
    getItem('COMMUNITY NEWS', 'community'),
    getItem('CAMPAIGN', 'campaign'),
  ]),
  getItem('BRIDGE', 'bridge')
];

const rootSubmenuKeys = ['gallery', 'buy'];

export default function NavHeader(props: any) {
  const { activeIndex } = props;
  const [disableList, setDisableList] = useState(true);
  const [openKeys, setOpenKeys] = useState(['gallery']);

  const { state, dispatch } = useContext(DataContext);

  const setHideHeader = (value: boolean) => {
    const _padding = value ? '64px' : '16px';
    document.body.style.setProperty('--wallet-padding', _padding);

    dispatch({
      type: Types.IsVisibleHeader,
      value: value
    })
  }

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

        if (state.windowWidth > 375 && activeIndex == 7 && currTop < 400) {
          setHideHeader(true);
          return;
        } else {
          if (currTop - lastTop > 10) {
            setHideHeader(false);
            setDisableList(true);
          } else if (currTop - lastTop < -10) {
            setHideHeader(true);
          }
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
      id="header-container"
      className={`header-container ${!state.isVisibleHeader && 'hide'}`}
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
            {state.windowWidth > 750 ? (
              pages?.map((v: NavPageInfo, i: number) => {
                return (
                  <div
                    className={`nav-area cursor ${v.type} ${activeIndex == i ? 'active' : ''}`}
                    key={i}
                    onClick={() => {
                      dispatch({
                        type: Types.HideLoginModal
                      });
                      handleHeaderClick(v.key);
                      window.scrollTo(0, 0);
                    }}
                  >
                    {v.type === 'logo'
                      // ? (
                      //   <div className="nacp-logo">
                      //     <img className="icon-image" src={state.windowWidth <= 750 ? v.mImage : v.image} alt="" />
                      //   </div>
                      // )
                      ? (v.eleItem && v.eleItem())
                      : v.type === 'hover' ? (v.eleItem && v.eleItem()) : (<div className="title-text">{v.title}</div>)}
                  </div>
                );
              })
            ) : (
              <>
                {/* <div
                  className="nav-area logo"
                  onClick={() => {
                    setDisableList(true);
                    handleHeaderClick('nacp');
                  }}>
                  <div className="nacp-logo">
                    <img className="icon-image" src={state.windowWidth <= 750 ? MNacpLogo : NacpLogo} alt="" />
                  </div>
                </div> */}
                <Menu
                  className="mobile-menu-items"
                  expandIcon={() => {
                    return (
                      <img id="buy-item-open-icon" className="header-open" src={HeaderOpenIcon} />
                    );
                  }}
                  mode="inline"
                  inlineIndent={16}
                  onClick={e => {
                    if (e.key !== HeaderType.Coming) setDisableList(true);
                    handleHeaderClick(e.key);
                  }}
                  onOpenChange={(keys) => {
                    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
                    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
                      setOpenKeys(keys);
                    } else {
                      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
                    }
                  }}
                  openKeys={openKeys}
                  items={mPages}></Menu>
              </>
            )}
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
              <div
                className={`nav-area cursor icon`}
                onClick={() => {
                  setDisableList(true);
                  window.open('https://www.instagram.com/nervapes/')
                }}
              >
                <img className="icon-image" src={instegram} alt="" />
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
