import React, { Component } from "react";
import "./campaign-item.less";
import iconWWW from "../../assets/campaign/cam-www.svg";
import tempImg from "../../assets/campaign/cam-img-template.png";
import tempMat from "../../assets/campaign/cam-mat-template.png";

export class CampaignItem extends Component {
  render() {
    return (
      <div className="campaign-item">
        <div className="cam-item-title-line">
          <div className="cam-item-title">The groovy party</div>
          <div className="cam-item-starts">
            Campaign starts in 10 days, 23:31:59
          </div>
        </div>
        <div className="cam-item-content">
          Breaking out of our daily routine, Nervapes have a DAY OFF today!
          We’re gonna have fun, goof around, and explore this new world to the
          fullest! Find hidden gems in this crystal ball. Piece together an era
          of dreams.
        </div>
        <div className="cam-card-frame">
          <div className="cam-item-reward-card">
            <div className="reward-word">Reward:</div>
            <img className="reward-image" src={tempImg}></img>
            <div className="reward-title">Groovy Party</div>
            <div className="reward-claimed">100/128 claimed</div>
            <img className="reward-icon" src={iconWWW}></img>
          </div>
          <div className="cam-item-material-card">
            <div className="material-word">Material:</div>
            <div className="material-img-list">
              <img className="material-img-item" src={tempMat}></img>
              <img className="material-img-item" src={tempMat}></img>
              <img className="material-img-item" src={tempMat}></img>
              <img className="material-img-item" src={tempMat}></img>
              <img className="material-img-item" src={tempMat}></img>
              <img className="material-img-item" src={tempMat}></img>
            </div>
          </div>
        </div>

        <div className="cam-button-frame">
          <div className="cam-item-button button-rul">
            <div className="text-top">View</div>
            <div className="text-bottom">Rule</div>
          </div>
          <div className="cam-item-button button-mat">
            <div className="text-top">View</div>
            <div className="text-bottom">Material Availability</div>
          </div>
          <div className="cam-item-button button-nft">
            <div className="text-top">Participate on</div>
            <div className="text-bottom">NFT Claim</div>
          </div>
        </div>
      </div>
    );
  }
}
