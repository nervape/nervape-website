import React, { Component } from "react";
import "./campaign-intro.less";
import introPng from "../../assets/campaign/campaign-intro.png";

export class CampaigIntro extends Component {
  render() {
    return (
      <div className="campaign-intro">
        <img className="campaign-intro-bg" src={introPng}></img>
        <div className="campaign-header-text">campaign</div>
      </div>
    );
  }
}
