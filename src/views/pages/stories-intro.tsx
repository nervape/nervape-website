import React, { Component } from "react";
import "./stories-intro.less";
import { Story } from "../../nervape/story";
import { StoryCard } from "../components/story-card";

export interface IStoriesInfroProps {
  latest: Story;
}

export class StoriesIntro extends Component<IStoriesInfroProps> {
  render() {
    const { latest } = this.props;
    return (
      <div className="stories-intro">
        <img className="src-img" src={latest.storyPreviewUrl} alt="" />
        <StoryCard className="banner" story={latest}></StoryCard>
      </div>
    );
  }
}
