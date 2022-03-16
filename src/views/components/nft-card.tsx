import React, { Component } from "react";
import "./nft-card.less";
import iconUrl from "../../assets/gallery/www.svg";
import { NFT } from "../../nervape/nft";
import { NavTool } from "../../route/navi-tool";

export interface INFTCardProps {
  nft: NFT;
}
export class NFTCard extends Component<INFTCardProps> {
  render() {
    const { nft } = this.props;
    const relatedStory = nft.stories[0];
    const fnRelatedStory = () => {
      if (relatedStory) {
        const { chapter, serial, title } = relatedStory;
        return (
          <div
            className="nft-card-search-parent"
            onClick={() => {
              NavTool.fnJumpToPage(
                `/story?chapter=${chapter}&&serial=${serial}`
              );
            }}
          >
            <div className="nft-card-search-button">{title}</div>
          </div>
        );
      }
    };

    return (
      <div className="nft-card">
        <div className="nft-card-vision">
          <img
            className="nft-card-image"
            src={nft.cover_image_url}
            onClick={() => {
              window.open(nft.mibaoUrl);
            }}
          ></img>
          {fnRelatedStory()}
        </div>
        <div className="nft-card-story">{nft.name}</div>
        <div className="nft-card-distributed">
          <div>
            {Number(nft.issued)}/{Number(nft.total)} distributed
          </div>
          <img src={iconUrl} />
        </div>
        <div className="nft-btn-parent">
          <div
            className="nft-button "
            onClick={() => {
              window.open(nft.mibaoUrl);
            }}
          >
            <div className="nft-button-t1">View 3D on</div>
            <div className="nft-button-t2">Mibao</div>
          </div>
          <div
            className="nft-button "
            onClick={() => {
              window.open(nft.kollectMeUrl);
            }}
          >
            <div className="nft-button-t1">Purchase on</div>
            <div className="nft-button-t2">Kollect.me</div>
          </div>
        </div>
      </div>
    );
  }
}
