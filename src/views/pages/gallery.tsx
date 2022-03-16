import React, { Component } from "react";
import { NFTCard } from "../components/nft-card";
import testImgUrl from "../../assets/gallery/nft-bg-medium.png";
import "./gallery.less";
import GalleryIntro from "./gallery-intro";
import { GalleryList } from "./gallery-list";
import { WebMock } from "../../mock/web-mock";
import { NFT } from "../../nervape/nft";

export class Gallery extends Component<
  any,
  {
    latestNft?: NFT;
    nfts: NFT[];
  }
> {
  constructor(props: any) {
    super(props);
    this.state = { latestNft: undefined, nfts: [] };
  }

  fnInitGalleryInfo = async () => {
    const { nfts, latestNft } = await WebMock.fnGetMockInfo();
    this.setState({
      nfts,
      latestNft,
    });
  };

  componentDidMount() {
    this.fnInitGalleryInfo();
  }

  render() {
    const { nfts, latestNft } = this.state;
    console.log("gallery reader", latestNft);
    return (
      <div className="gallery-page">
        <GalleryIntro nft={latestNft}></GalleryIntro>
        <GalleryList nfts={nfts}></GalleryList>
      </div>
    );
  }
}
