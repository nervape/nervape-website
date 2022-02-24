import React, { Component } from "react";
import "./nft-card.less";
import visionImg from "../../assets/gallery/nft-vision.png";
import iconUrl from "../../assets/gallery/www.svg";
import { NftItem } from "../../nervape/nft";
import { NavTool } from "../../route/navi-tool";

export interface INFTCardProps {
  nft: NftItem;
}
export class NFTCard extends Component<INFTCardProps> {
  render() {
    const { nft } = this.props;
    // console.log(nft);
    return (
      <div className="nft-card">
        <div className="nft-card-vision">
          <img className="nft-card-image" src={visionImg}></img>
          <div
            className="nft-card-search-parent"
            onClick={() => {
              NavTool.fnJumpToPage(
                `/story?chapter=${nft.story?.chapter}/serial=${nft.story?.serial}`
              );
            }}
          >
            <div className="nft-card-search-input">{nft.story?.name}</div>
          </div>
        </div>
        <div className="nft-card-story">{nft.name}</div>
        <div className="nft-card-distributed">
          <div>
            {nft.distributed - nft.last}/{nft.distributed} distributed
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
              window.open(nft.mibaoUrl);
            }}
          >
            <div className="nft-button-t1">Purchase on</div>
            <div className="nft-button-t2">Collect.me</div>
          </div>
        </div>
      </div>
    );
  }
}
