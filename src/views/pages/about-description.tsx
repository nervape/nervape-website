import React, { Component } from "react";
import desertScene from "../../assets/about/desert-scene.svg";
import "./about-description.less";

export class AboutDescription extends Component {
  render() {
    return (
      <div className="about-description">
        <div className="contents-box">
          <img className="main-img" src={desertScene} alt="" />
          {/* <div
            style={{
              position: "absolute",
              top: "347px",
              height: "200px",
              width: "100%",
              background: "red",
            }}
          ></div> */}
          <div className="descript">
            <div className="headline">
              Our goal is to build the
              <big className="big-text"> The Third Continent </big>, a new world
              with countless possibilities.
            </div>

            <div className="main-part">
              To get there, the roadmap is divided into 2 phases:
              <br></br>
              <br></br>
              In Phase 1, we will release stories that will introduce our unique
              characters.
              <br></br>
              <br></br>
              In Phase 2, each owner can create their own Nervape and each
              Nervape will have their own space that they live in. They will
              then be able to step out of their space to interact with others in
              the world. When the public and private spaces intersect, The Third
              Continent keeps growing!
            </div>
          </div>
        </div>
      </div>
    );
  }
}
