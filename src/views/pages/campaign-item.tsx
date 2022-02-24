import React, { Component } from "react";
import "./campaign-item.less";
import iconWWW from "../../assets/campaign/cam-www.svg";
import { CamPaign } from "../../nervape/campaign";
import moment from "moment-timezone";

export interface CampaignItemProps {
  campaign: CamPaign;
}
export class CampaignItem extends Component<CampaignItemProps> {
  render() {
    const { campaign } = this.props;
    const reward = campaign.reward[0];

    const delta = campaign.startTime.clone().subtract(moment.now());
    const duraion = moment.duration(delta as any);
    const days = duraion.asDays();
    const hours = duraion
      .subtract(moment.duration(Math.floor(days), "days"))
      .asHours();
    const minutes = duraion
      .subtract(moment.duration(Math.floor(hours), "hours"))
      .asMinutes();
    const seconds = duraion
      .subtract(moment.duration(Math.floor(minutes), "minutes"))
      .asSeconds();
    console.log(days, hours, minutes, seconds);

    return (
      <div className="campaign-item">
        <div className="cam-item-title-line">
          <div className="cam-item-title">{campaign.name}</div>
          <div
            className="cam-item-starts"
            style={{ display: days > 0 ? "" : "none" }}
          >
            {`Campaign starts in ${Math.floor(days)} days, ${Math.floor(
              hours
            )}:${Math.floor(minutes)}:${Math.floor(seconds)}`}
          </div>
        </div>
        <div className="cam-item-content">{campaign.content}</div>
        <div className="cam-card-frame">
          <div className="cam-item-reward-card">
            <div className="reward-word">Reward:</div>
            <img className="reward-image" src={reward.thumbnail}></img>
            <div className="reward-title">{reward.name}</div>
            <div className="reward-claimed">
              {`${reward.distributed - reward.last}/${reward.distributed}`}{" "}
              claimed
            </div>
            <img className="reward-icon" src={iconWWW}></img>
          </div>
          <div className="cam-item-material-card">
            <div className="material-word">Material:</div>
            <div className="material-img-list">
              {campaign.materials.map((v, i) => {
                return (
                  <img
                    className="material-img-item"
                    src={v.thumbnail}
                    key={i}
                  ></img>
                );
              })}
            </div>
          </div>
        </div>

        <div className="cam-button-frame">
          <div
            className="cam-item-button button-rul"
            onClick={() => {
              window.open(campaign.ruleUrl);
            }}
          >
            <div className="text-top">View</div>
            <div className="text-bottom">Rule</div>
          </div>
          <div
            className="cam-item-button button-mat"
            onClick={() => {
              window.open(campaign.materialUrl);
            }}
          >
            <div className="text-top">View</div>
            <div className="text-bottom">Material Availability</div>
          </div>
          <div
            className="cam-item-button button-nft"
            onClick={() => {
              window.open(campaign.claimUrl);
            }}
          >
            <div className="text-top">Participate on</div>
            <div className="text-bottom">NFT Claim</div>
          </div>
        </div>
      </div>
    );
  }
}
