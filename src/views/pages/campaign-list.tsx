import React, { Component } from "react";
import { CampaignItem } from "./campaign-item";
import "./campaign-list.less";

export class CampaignList extends Component {
  render() {
    return (
      <div className="campaign-list-page">
        <div className="campaign-item-container">
          <CampaignItem></CampaignItem>
        </div>

        <div className="campaign-item-container">
          <CampaignItem></CampaignItem>
        </div>

        <div className="campaign-item-container">
          <CampaignItem></CampaignItem>
        </div>

        <div className="campaign-item-container">
          <CampaignItem></CampaignItem>
        </div>

        <div className="campaign-item-container">
          <CampaignItem></CampaignItem>
        </div>

        <div className="campaign-item-container">
          <CampaignItem></CampaignItem>
        </div>
      </div>
    );
  }
}
