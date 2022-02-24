import React, { Component } from "react";
import { CampaignMock } from "../../mock/campaign-mock";
import { CampaignItem } from "./campaign-item";
import "./campaign-list.less";

export class CampaignList extends Component {
  render() {
    const datas = CampaignMock.fnGetDataList();
    console.log(datas);
    return (
      <div className="campaign-list-page">
        {datas.map((value, index) => {
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
