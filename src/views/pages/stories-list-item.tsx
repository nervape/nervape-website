import React, { Component } from "react";
import "./stories-list-item.less";
import { StoryCard } from "../components/story-card";
import { Story } from "../../nervape/story";
import { StoriesMock } from "../../mock/stories-mock";

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
      <div className="story-item">
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
