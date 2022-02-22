import React, { Component } from "react";
import { CampaignItem } from "./campaign-item";

export class Campaign extends Component {
  render() {
    return (
      <div className="campaign-page">
        <CampaignItem></CampaignItem>
      </div>
    );
  }
}
