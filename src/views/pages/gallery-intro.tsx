import React, { Component } from "react";
import { NFTCard } from "../components/nft-card";
import "./gallery-intro.less";
import { NFT } from "../../nervape/nft";
import { NFTsMock } from "../../mock/nft-mock";
import { NavTool } from "../../route/navi-tool";

export default class GalleryIntro extends Component {
  render() {
    const nft = NFTsMock.fnGetLatest();

    return (
      <div className="gallery-intro">
        <img className="gallery-bg-img" src={nft.bannerImgUrl}></img>
        <div className="gallery-rect">
          <div className="gallery-text-card">
            <div className="title-text01">{nft.name}</div>
            <div className="title-text02">is now released</div>
            <div className="content-text">{nft.descriptsion}</div>
            <div className="from-parent">
              <div className="from-text">From:</div>
              <div
                className="related-story"
                onClick={() => {
                  NavTool.fnJumpToPage(
                    `/story?chapter=${nft.story?.chapter}/serial=${nft.story?.serial}`
                  );
                }}
              >
                {nft.story?.serial}:{nft.story?.name}
              </div>
            </div>
          </div>

          <NFTCard nft={nft}></NFTCard>
        </div>
      </div>
    );
  }
}
