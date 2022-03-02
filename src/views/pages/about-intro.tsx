import React, { Component } from "react";
import santaPunk from "../../assets/about/santa-punk.png";
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
              courage, and trust among the first Nervapes that arrive at The
              Third Continent.
              <br></br>
              <br></br>
              As the Nervapes continue to explore The Third Continent, unique
              features of the land, fantasy elements, and new characters will be
              added as 3D NFTs. These NFTs will become a part of customizable
              avatars and personal spaces allowing their owners to participate
              in the construction of The Third Continent.
            </div>
          </div>
        </div>
      </div>
    );
  }
}
