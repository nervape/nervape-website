import React, { Component } from "react";
import { AboutIntro } from "./about.intro";
import "./about.less";

export class About extends Component {
  render() {
    return (
      <div className="about">
        <AboutIntro></AboutIntro>
      </div>
    );
  }
}
