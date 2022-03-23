import React, { Component } from "react";
import { NFTCard } from "../components/nft-card";
import "./gallery-intro.less";
import { NFT } from "../../nervape/nft";
import { NFTsMock } from "../../mock/nft-mock";
import { NavTool } from "../../route/navi-tool";

export default class GalleryIntro extends Component<{ nft?: NFT }> {
  render() {
    const { nft } = this.props;
    if (!nft) {
      return <></>;
    }
    const relatedStory = nft.stories[0];

    const fnRelatedStory = () => {
      if (relatedStory) {
        const { chapter, serial, title } = relatedStory;
        return (
          <div className="from-parent">
            {/* <div className="from-text">From:</div>
            <div
              className="related-story"
              onClick={() => {
                NavTool.fnJumpToPage(
                  `/story?chapter=${chapter}&serial=${serial}`
                );
              }}
            >
              {serial}:&nbsp;{title}
            </div> */}
          </div>
        );
      }
    };

    return (
      <div className="gallery-intro">
        <img className="gallery-bg-img" src={nft.bannerUrl}></img>
        <div className="gallery-rect">
          <div className="gallery-text-card">
            <div className="title-text01">{nft.name}</div>
            <div className="title-text02">is now released</div>
            <div className="content-text">{nft.description}</div>
            {fnRelatedStory()}
          </div>
          <NFTCard nft={nft}></NFTCard>
        </div>
      </div>
    );
  }
}
