import React, { Component } from "react";
import "./stories-intro.less";
import novalBg from "../../assets/noval/intro-bg.png";
import { ISotory } from "./stories";

export interface IStoriesInfroProps {
  latestStory: ISotory;
}

export class StoriesIntro extends Component<IStoriesInfroProps> {
  render() {
    const { chapter, sequence, title, content, related } =
      this.props.latestStory;
    return (
      <div className="stories-intro">
        <img className="src-img" src={novalBg} alt="" />
        <div className="banner">
          <div className="main-body">
            <div className="chapter">
              {chapter}/{sequence}
            </div>
            <div className="title">{title}</div>
            <div className="content">{content}</div>
          </div>
          <div className="realated">{related}</div>
        </div>
      </div>
    );
  }
}
