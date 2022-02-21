import React, { Component } from "react";
import "./nft-card.less";
import visionImg from "../../assets/gallery/nft-vision.png";
import iconUrl from "../../assets/gallery/www.svg";

export class NFTCard extends Component {
  render() {
    return (
      <div className="nft-card">
        <div className="nft-card-vision">
          <img className="nft-card-image" src={visionImg}></img>
          <div className="nft-card-search-parent">
            <input
              className="nft-card-search-input"
              spellCheck={false}
              placeholder={"An Unexpected Encounter"}
            ></input>
          </div>
        </div>
        <div className="nft-card-story">Nervape / Story01</div>
        <div className="nft-card-distributed">
          <div>100/128 distributed</div>
          <img src={iconUrl} />
        </div>
        <div className="nft-btn-parent">
          <div className="nft-button ">
            <div className="nft-button-t1">View 3D on</div>
            <div className="nft-button-t2">Mibao</div>
          </div>
          <div className="nft-button ">
            <div className="nft-button-t1">Purchase on</div>
            <div className="nft-button-t2">Collect.me</div>
          </div>
        </div>
      </div>
    );
  }
}
