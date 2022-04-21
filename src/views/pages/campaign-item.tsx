import React, { Component } from "react";
import "./campaign-item.less";
import iconWWW from "../../assets/campaign/cam-www.svg";
import { Campaign } from "../../nervape/campaign";
import moment from "moment-timezone";

export interface CampaignItemProps {
  campaign: Campaign;
}
export class CampaignItem extends Component<CampaignItemProps> {
  render() {
    const { campaign } = this.props;
    if (!campaign) {
      return <div></div>;
    }

    const reward = campaign.reward;
    const delta = moment(campaign.startTime).clone().subtract(moment.now());
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
    // console.log(days, hours, minutes, seconds);

    const fnReward = () => {
      if (reward) {
        return (
          <div className="cam-item-reward-card">
            <div className="reward-word">Reward:</div>
            <img className="reward-image" src={reward.cover_image_url}></img>
            <div className="reward-title">{reward.name}</div>
            <div className="reward-claimed">
              {Number(reward.issued)}/{Number(reward.total)} claimed
            </div>
            <img className="reward-icon" src={iconWWW}></img>
          </div>
        );
      }
    };

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
        <div className="cam-item-content">{campaign.overview}</div>
        <div className="cam-card-frame">
          {fnReward()}
          <div className="cam-item-material-card">
            <div className="material-word">Material:</div>
            <div className="material-img-list">
              {campaign.materials.map((v, i) => {
                return (
                  <img
                    className="material-img-item"
                    src={v.image}
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
              window.open(campaign.rule_url);
            }}
          >
            <div className="text-top">View</div>
            <div className="text-bottom">Rule</div>
          </div>
          <div
            className="cam-item-button button-mat"
            onClick={() => {
              window.open(campaign.material_availability_url);
            }}
          >
            <div className="text-top">View</div>
            <div className="text-bottom">Material Availability</div>
          </div>
          <div
            className="cam-item-button button-nft"
            onClick={() => {
              window.open(campaign.nft_claim_url);
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
