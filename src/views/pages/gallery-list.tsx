import React, { Component } from "react";
import { NFTsMock } from "../../mock/nft-mock";
import { NFT } from "../../nervape/nft";
import { NavTool } from "../../route/navi-tool";
import { NFTCard } from "../components/nft-card";
import "./gallery-list.less";

export class GalleryList extends Component {
  constructor(props: any) {
    super(props);

    this.fnScrollWindow = this.fnScrollWindow.bind(this);
  }
  elTitle: HTMLElement | null = null;
  elClassify: HTMLElement | null = null;

  fnScrollWindow(e: Event) {
    const elTitle = this.elTitle as HTMLElement;
    const elClassify = this.elClassify as HTMLElement;
    const rect = elTitle.getBoundingClientRect();
    // console.log(rect);
    if (rect.top < -rect.height + 93) {
      elClassify.style.position = "fixed";
      elClassify.style.top = rect.width < 750 ? "60px" : "93px";
    } else {
      elClassify.style.position = "";
      elClassify.style.top = "";
    }
  }

  componentDidMount() {
    window.removeEventListener("scroll", this.fnScrollWindow, true);
    window.addEventListener("scroll", this.fnScrollWindow, true);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.fnScrollWindow, true);
  }

  render() {
    const nftData = NFTsMock.fnGetNftList();
    const typeData = NFTsMock.fGetTypes();

    let activeType = NavTool.fnQueryParam("type");
    if (activeType === null) {
      activeType = NavTool.fnStdNavStr(typeData[0]);
    }

    console.log(activeType, typeData);

    const renderdata = nftData.filter((v) => {
      for (let i = 0; i < v.type.length; ++i) {
        if (NavTool.fnStdNavStr(v.type[i]) === activeType) {
          return v;
        }
      }
    });

    console.log(renderdata);

    return (
      <div className="gallery-list">
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
            {typeData.map((typeStr, i) => {
              return (
                <div key={typeStr} className="check-box">
                  <div
                    className={`default-text ${
                      NavTool.fnStdNavStr(typeStr) === activeType
                        ? "select-text"
                        : ""
                    }`}
                    onClick={() => {
                      NavTool.fnJumpToPage(`/nft?type=${typeStr}`);
                    }}
                  >
                    {typeStr}
                  </div>
                  {i === typeData.length - 1 ? (
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
