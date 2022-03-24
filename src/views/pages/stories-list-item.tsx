import React, { Component } from "react";
import "./stories-list-item.less";
import { StoryCard } from "../components/story-card";
import { Story } from "../../nervape/story";
import { StoriesMock } from "../../mock/stories-mock";
import { NavTool } from "../../route/navi-tool";

export interface IStoriesListItemProps {
  story: Story;
}

export class StoriesListItem extends Component<IStoriesListItemProps> {
  fnRalatedNFT(p: any) {
    console.log(p);
  }
  render() {
    const { story } = this.props;
    return (
      <div
        className="story-item"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          NavTool.fnJumpToPage(
            `/story?chapter=${story.chapter}&&serial=${story.serial}`
          );
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
      >
        <div className="img-bg-item">
          <img
            src={story.imageUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        <StoryCard story={story} className="card-item"></StoryCard>
      </div>
    );
  }
}
