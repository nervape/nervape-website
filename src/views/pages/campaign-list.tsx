import React, { Component } from "react";
import { CampaignMock } from "../../mock/campaign-mock";
import { WebMock } from "../../mock/web-mock";
import { Campaign } from "../../nervape/campaign";
import { CampaignItem } from "./campaign-item";
import "./campaign-list.less";

export class CampaignList extends Component<
  any,
  {
    campaigns: Campaign[];
  }
> {
  constructor(props: any) {
    super(props);
    this.state = { campaigns: [] };
  }

  fnInitCampaignInfo = async () => {
    const { campaigns } = await WebMock.fnGetMockInfo();
    this.setState({
      campaigns,
    });
  };

  componentDidMount() {
    this.fnInitCampaignInfo();
  }

  render() {
    const { campaigns } = this.state;
    console.log(campaigns);
    return (
      <div className="campaign-list">
        {campaigns.map((value, index) => {
          return (
            <div className="campaign-item-container" key={index}>
              <CampaignItem campaign={value}></CampaignItem>
            </div>
          );
        })}
      </div>
    );
  }
}
