import React, { Component } from "react";
import "./stories-list-item.less";
import { ISotory } from "./stories";

export interface IStoriesListItemProps {
  story: ISotory;
  onClickCard?: any;
}
export class StoriesListItem extends Component<IStoriesListItemProps> {
  fnRalatedNFT(p: any) {
    console.log(p);
  }
  render() {
    const { story, onClickCard } = this.props;
    return (
      <div
        className="story-item"
        onClick={() => {
          if (onClickCard) {
            onClickCard(story);
          }
        }}
      >
        <div className="s-item-img">
          <img
            src={story.image}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        <div className="main-body">
          <div className="s-item-detail">
            <div className="chapter">
              {story.chapter}/{story.sequence}
            </div>
            <div className="title">{story.title}</div>
            <div className="content">{story.content}</div>
          </div>
          <div className="related">
            <div className="related-text">Related NFT(s):</div>
            <div className="related-btn-group">
              {story.related?.map((rv, ri) => {
                return (
                  <div
                    className="related-button"
                    key={`${ri}-${rv}`}
                    onClick={() => {
                      this.fnRalatedNFT(rv);
                    }}
                  >
                    {rv}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
