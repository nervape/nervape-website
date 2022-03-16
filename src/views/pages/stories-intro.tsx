import React, { Component } from "react";
import "./stories-intro.less";
import { Story } from "../../nervape/story";
import { StoryCard } from "../components/story-card";

export class StoriesIntro extends Component<{
  latest?: Story;
}> {
  render() {
    const { latest } = this.props;
    console.log("StoriesIntro", latest);
    return (
      <div className="stories-intro">
        <img className="src-img" src={latest?.bannerUrl} alt="" />
        <StoryCard className="banner" story={latest}></StoryCard>
      </div>
    );
  }
}
