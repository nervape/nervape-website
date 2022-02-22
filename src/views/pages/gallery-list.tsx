import React, { Component } from "react";
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
    if (rect.top < -rect.height) {
      elClassify.style.position = "fixed";
    } else {
      elClassify.style.position = "";
    }
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.fnScrollWindow);
  }

  render() {
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
              window.removeEventListener("scroll", this.fnScrollWindow);
              window.addEventListener("scroll", this.fnScrollWindow);
            }}
          >
            <div className="default-text">Featured</div>
            <div className="hover-text"></div>

            <div className="default-text">Featured</div>
            <div className="hover-text"></div>

            <div className="default-text">Featured</div>
            <div className="hover-text"></div>
          </div>
        </div>

        <div className="nft-list">
          <div className="card-container">
            <NFTCard></NFTCard>
          </div>

          <div className="card-container">
            <NFTCard></NFTCard>
          </div>

          <div className="card-container">
            <NFTCard></NFTCard>
          </div>

          <div className="card-container">
            <NFTCard></NFTCard>
          </div>

          <div className="card-container">
            <NFTCard></NFTCard>
          </div>
        </div>
      </div>
    );
  }
}
