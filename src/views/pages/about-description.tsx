import React, { Component } from "react";
import desertScene from "../../assets/about/desert-scene.png";
import "./about-description.less";

const content = {
  header: `Nervape is a brand, a saga, a new world of countless possibilities.`,
  content: `It starts with a story and limited 3D NFT collections. It growth stems from the creativity of the community. 

Your Nervape is your digital avatar in the Third Continent. As you choose your paths and embark on adventures, you will be building the Metaverse along with others. When you grow, the Third Continent grows with you.`,
};

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
              {/* Our goal is to build the
              <big className="big-text"> The Third Continent </big>, a new world
              with countless possibilities. */}
              {content.header}
            </div>

            <div className="main-part">{content.content}</div>
          </div>
        </div>
      </div>
    );
  }
}
