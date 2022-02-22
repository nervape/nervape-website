import React, { Component } from "react";
import { NFTCard } from "../components/nft-card";
import testImgUrl from "../../assets/gallery/nft-bg-medium.png";
import "./gallery.less";
import GalleryIntro from "./gallery-intro";
import { GalleryList } from "./gallery-list";

export class Gallery extends Component {
  render() {
    return (
      // <div>
      //   <NFTCard></NFTCard>
      // </div>

      <div className="gallery-page">
        <GalleryIntro></GalleryIntro>
        <GalleryList></GalleryList>
      </div>
    );
  }
}
