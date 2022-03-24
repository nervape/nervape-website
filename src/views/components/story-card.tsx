import React, { Component } from "react";
import { Story } from "../../nervape/story";
import "./story-card.less";
import { NavTool } from "../../route/navi-tool";

export class StoryCard extends Component<{
  className?: string;
  story?: Story;
}> {
  render() {
    const { story, className } = this.props;
    return (
      <div
        className={`story-card ${className ? className : ""}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          NavTool.fnJumpToPage(
            `/story?chapter=${story?.chapter}&&serial=${story?.serial}`
          );
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
      >
        <div className="card-detail">
          <div className="chapter">
            {story?.chapter}/{story?.serial}
          </div>
          <div className="title">{story?.title}</div>
          <div className="overview">{story?.overview}</div>
        </div>
        <div className="nft-list">
          <div className="nft-text">Related NFT(s):</div>
          <div className="nft-btn-group">
            {story?.nfts.map((rv, ri) => {
              return (
                <a
                  className="nft-button"
                  href={rv.mibaoUrl}
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
