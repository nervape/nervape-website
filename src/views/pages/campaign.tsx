import React, { Component } from "react";
import { CampaigIntro } from "./campaign-intro";
import { CampaignList } from "./campaign-list";

export class Campaign extends Component {
  render() {
    return (
      <div className="campaign-page">
        <CampaigIntro></CampaigIntro>
        <CampaignList></CampaignList>
      </div>
    );
  }
}
