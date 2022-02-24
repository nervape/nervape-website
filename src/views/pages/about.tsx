import React, { Component } from "react";
import { AboutDescription } from "./about-description";
import { AboutIntro } from "./about-intro";
import "./about.less";
import { AboutRoadmap } from "./about-roadmap";

export class AboutPage extends Component {
  render() {
    return (
      <div className="about">
        <AboutIntro></AboutIntro>
        <AboutDescription></AboutDescription>
        <AboutRoadmap></AboutRoadmap>
      </div>
    );
  }
}
