import React, { Component } from "react";
import { Story } from "../../nervape/story";
import "./story-card.less";
import { Link, useNavigate } from "react-router-dom";
import { NavTool } from "../../route/navi-tool";

export interface IStoryCardProps {
  className?: string;
  story: Story;
}
export class StoryCard extends Component<IStoryCardProps> {
  render() {
    const { story, className } = this.props;
    return (
      <div
        className={`story-card ${className ? className : ""}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          NavTool.fnJumpToPage(
            `/story?chapter=${story.chapter}&&serial=${story.serial}`
          );
        }}
      >
        <div className="card-detail">
          <div className="chapter">
            {story.chapter}/{story.serial}
          </div>
          <div className="title">{story.name}</div>
          <div className="content">{story.overview}</div>
        </div>
        <div className="nft-list">
          <div className="nft-text">Related NFT(s):</div>
          <div className="nft-btn-group">
            {story.nft?.map((rv, ri) => {
              return (
                <a
                  className="nft-button"
                  href={rv.url}
                  target="_blank"
                  key={`${ri}-${rv.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {rv.name}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
