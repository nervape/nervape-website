import React, { Component } from "react";
import santaPunk from "../../assets/about/santa-punk-x2.png";
import "./about-intro.less";

export class AboutIntro extends Component {
  render() {
    return (
      <div className="about-introduce">
        <div className="contents-box">
          <img className="main-img" src={santaPunk} alt="" />
          <div className="intro">
            <div className="headline">ABOUT THE PROJECT</div>
            <div className="main-part">
              The Nervape project is an ongoing saga and a story of friendship,
              courage, and trust among the first Nervapes that arrive at the
              Third Continent. As the Nervapes continue to explore the Third
              Continent, new characters, unique features of the land, and
              fantasy elements will be added as 3D NFTs to the Nervos
              blockchain.
            </div>
          </div>
        </div>
      </div>
    );
  }
}
