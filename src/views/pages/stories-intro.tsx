import React, { Component } from "react";
import "./stories-intro.less";
import { Story } from "../../nervape/story";
import { StoryCard } from "../components/story-card";
import { NavTool } from "../../route/navi-tool";

export class StoriesIntro extends Component<{
  latest?: Story;
}> {
  render() {
    const { latest } = this.props;
    console.log("StoriesIntro", latest);
    return (
      <div 
        className="stories-intro"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          NavTool.fnJumpToPage(
            `/story/${latest?.id}`
          );
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}>
        <img
          className="src-img"
          src={latest?.bannerUrl}
          onLoad={(e) => {
            console.log("image load complete!!!!", e);
            const img = e.target as HTMLImageElement
            img.style.opacity = "1"
          }}
        />
        <StoryCard className="banner" story={latest}></StoryCard>
      </div>
    );
  }
}
