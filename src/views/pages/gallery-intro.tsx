import React, { Component } from "react";
import { NFTCard } from "../components/nft-card";
import testImgUrl from "../../assets/gallery/nft-bg-medium.png";
import "./gallery-intro.less";

export default class GalleryIntro extends Component {
  render() {
    return (
      <div className="gallery-intro">
        <img className="gallery-bg-img" src={testImgUrl}></img>
        <div className="gallery-bg-mask"></div>

        <div className="gallery-rect">
          <div className="gallery-text-card">
            <div className="title-text01">Nervape / Story01</div>
            <div className="title-text02">is now released</div>
            <div className="content-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in
            </div>
            <div className="from-parent">
              <div className="from-text">From:</div>
              <div className="related-story">
                Story01: An Unexpected Encounter
              </div>
            </div>
          </div>

          <NFTCard></NFTCard>
        </div>
      </div>
    );
  }
}
