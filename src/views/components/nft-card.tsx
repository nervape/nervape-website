import React, { Component } from "react";
import "./nft-card.less";
import { IconMap, NFT_List } from "../../nervape/nft";
import { NavTool } from "../../route/navi-tool";
import iconPreviewClose from "../../assets/gallery/preview-close-button.svg";
import loadingGif from "../../assets/gallery/loading.gif";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<any, any>;
    }
  }
}
export class NFTCard extends Component<
  { nft: NFT_List },
  {
    enableModule: boolean;
    enableModuleUrl: String;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      enableModule: false,
      enableModuleUrl: "",
    };
  }

  render() {
    const { nft } = this.props;
    const relatedStory = nft.stories[0];
    const fnRelatedStory = () => {
      if (relatedStory) {
        const { chapter, serial, title, _id } = relatedStory;
        return (
          <div className="nft-card-search-parent">
            <div
              className="nft-card-search-button"
              onClick={() => {
                NavTool.fnJumpToPage(
                  `/story/${_id}`
                );
              }}
            >
              {title}
            </div>
          </div>
        );
      }
    };

    const fnReturnModel = () => {
      const { enableModule, enableModuleUrl } = this.state;
      if (enableModule === true) {
        return (
          <div className="model-preview">
            <model-viewer
              class="model-viewer-class"
              id="reveal"
              // reveal="interaction"
              loading="eager"
              camera-controls
              auto-rotate
              src={enableModuleUrl}
              ar-modes="webxr scene-viewer quick-look"
              // environment-image="shared-assets/environments/moon_1k.hdr"
              seamless-poster
              shadow-intensity="1"
            >
              <div className="model-loading" slot="poster">
                <img className="model-loading-gif" src={loadingGif} alt="" />
              </div>
            </model-viewer>

            <img
              className="close-button"
              src={iconPreviewClose}
              onClick={() => {
                this.setState({
                  enableModule: false,
                  enableModuleUrl: "",
                });
              }}
            />
          </div>
        );
      }
    };

    return (
      <div className="nft-card">
        <div className="nft-card-vision">
          <img
            className="nft-card-image"
            src={nft.image}
            onClick={() => {
              this.setState({
                enableModule: true,
                enableModuleUrl: nft.renderer,
              });
            }}
          ></img>
          {fnRelatedStory()}
          {fnReturnModel()}
        </div>
        <div className="nft-card-story">{nft.name}</div>
        <div className="nft-card-distributed">
          <div>
            {Number(nft.issued)}/{Number(nft.total)} distributed
          </div>
          <img src={IconMap.get(nft.type)} />
        </div>
        <div className={["nft-btn-parent", nft.kollectMeUrl ? "nft-two-btn" : null].join(' ')}>
          <div
            className="nft-button "
            onClick={() => {
              window.open(nft.mibaoUrl);
            }}
          >
            <div className="nft-button-t1">View on</div>
            <div className="nft-button-t2">Mibao</div>
          </div>
          {
            nft.kollectMeUrl
              ? (
                <div
                  className="nft-button "
                  onClick={() => {
                    window.open(nft.kollectMeUrl);
                  }}
                >
                  <div className="nft-button-t1">Purchase on</div>
                  <div className="nft-button-t2">Kollect.me</div>
                </div>
              ) : ""
          }
        </div>
      </div>
    );
  }
}
