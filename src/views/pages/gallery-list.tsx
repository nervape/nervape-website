import React, { Component } from "react";
import { NFTsMock } from "../../mock/nft-mock";
import { WebMock } from "../../mock/web-mock";
import { NFT_List, NFT_TYPE } from "../../nervape/nft";
import { NavTool } from "../../route/navi-tool";
import { NFTCard } from "../components/nft-card";
import "./gallery-list.less";

interface GalleryListProps {
  nfts: NFT_List[]
}

interface GalleryListState {
  renderdata: NFT_List[],
  activeType: string
}

export class GalleryList extends Component<GalleryListProps, GalleryListState> {
  constructor(props: GalleryListProps) {
    super(props);
    this.fnScrollWindow = this.fnScrollWindow.bind(this);
    console.log('constructor', props)

    const activeType = this.fnGetActiveType();
    this.state = {
      renderdata: [],
      activeType: activeType
    };
  }
  elList: HTMLElement | null = null;
  elTitle: HTMLElement | null = null;
  elClassify: HTMLElement | null = null;

  componentDidUpdate(prevProps: GalleryListProps) {
    if (prevProps.nfts != this.props.nfts) {
      this.setState({
        renderdata: this.props.nfts
      })
    }
  }
  
  fnScrollWindow(e: Event) {
    const elTitle = this.elTitle as HTMLElement;
    const elClassify = this.elClassify as HTMLElement;
    const rect = elTitle.getBoundingClientRect();
    // console.log(rect);
    if (rect.top < -rect.height + 64) {
      elClassify.style.position = "fixed";
      elClassify.style.top = rect.width < 750 ? "64px" : "64px";
      elClassify.style.borderBottom = "1px solid #2a2a2a";
    } else {
      elClassify.style.position = "";
      elClassify.style.top = "";
      elClassify.style.borderBottom = "";
    }
  }

  async fnGetNftList(typeStr: string) {
    const data = await WebMock.fnGetNftMockInfo(false, typeStr);
    this.setState({
      renderdata: data.nfts
    })
  }

  fnGetActiveType() {
    let activeType = NavTool.fnQueryParam("type");
    if (activeType === null) {
      activeType = NavTool.fnStdNavStr(WebMock.typeData[0]);
    }
    return activeType;
  }

  componentDidMount() {
    window.removeEventListener("scroll", this.fnScrollWindow, true);
    window.addEventListener("scroll", this.fnScrollWindow, true);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.fnScrollWindow, true);
  }

  render() {
    // if (activeType === NavTool.fnStdNavStr("Featured")) {
    //   const data = nfts.filter((v) => {
    //     return v.featured === true;
    //   });
    //   renderdata.push(...data);
    // } else {
    //   const data = nfts.filter((v) => {
    //     for (let i = 0; i < v.type.length; ++i) {
    //       if (NavTool.fnStdNavStr(v.type) === activeType) {
    //         return v;
    //       }
    //     }
    //   });
    //   renderdata.push(...data);
    // }
    const { renderdata, activeType } = this.state;
    return (
      <div
        className="gallery-list"
        ref={(elList) => {
          this.elList = elList;
        }}
      >
        <div className="gallery-list-header">
          <div
            className="nft-gallery-title"
            ref={(elTitle) => {
              this.elTitle = elTitle;
            }}
          >
            NFT Gallery
          </div>
          <div
            className="nft-gallery-classify"
            ref={(elClassify) => {
              this.elClassify = elClassify;
            }}
          >
            {WebMock.typeData.map((typeStr, i) => {
              return (
                <div key={typeStr} className="check-box">
                  <div
                    className={`default-text ${
                      NavTool.fnStdNavStr(typeStr) === activeType
                        ? "select-text"
                        : ""
                    }`}
                    onClick={async () => {
                      const elList = this.elList as HTMLElement;
                      NavTool.fnJumpToPage(`/nft?type=${typeStr}`);
                      window.scrollTo({
                        top: elList.offsetTop - 64,
                        behavior: "smooth",
                      });
                      this.setState({
                        activeType: NavTool.fnStdNavStr(typeStr)
                      })
                      await this.fnGetNftList(NavTool.fnStdNavStr(typeStr));
                    }}
                  >
                    {typeStr}
                  </div>
                  {i === WebMock.typeData.length - 1 ? (
                    ""
                  ) : (
                    <div className="line"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="nft-list">
          {renderdata.map((v, i) => {
            return (
              <div className="card-container" key={i}>
                <NFTCard nft={v}></NFTCard>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
