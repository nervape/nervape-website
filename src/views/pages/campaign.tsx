import React, { Component } from "react";
import { CampaigIntro } from "./campaign-intro";
import { CampaignList } from "./campaign-list";
import "./campaign.less"

export class CampaignPage extends Component {
  render() {
    return (
      <div className="campaign-page">
        <CampaigIntro></CampaigIntro>
        <CampaignList></CampaignList>
      </div>
    );
  }
}
