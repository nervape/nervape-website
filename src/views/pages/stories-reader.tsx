import React, { Component } from "react";
import { Link } from "react-router-dom";
import { StoriesMock } from "../../mock/stories-mock";
import { Story } from "../../nervape/story";
import { NavTool } from "../../route/navi-tool";

import "./stories-reader.less";

interface StoriesReaderProps {
  story?: Story
}

export class StoriesReader extends Component<StoriesReaderProps> {
  render() {
    const { story } = this.props;
    window.scrollTo({
      top: 0,
    });
    if (!story) {
      return <></>;
    }
    const { previousStory, nextStory } = story;
    console.log(previousStory);

    const fnPrev = () => {
      if (previousStory) {
        return (
          <div
            className="sr-previous"
            onClick={() => {
              NavTool.fnJumpToPage(
                `/story/${previousStory.id}`
              );
            }}
          >
            Previous Story
          </div>
        );
      }
    };
    const fnNext = () => {
      if (nextStory) {
        return (
          <div
            className="sr-next"
            onClick={() => {
              NavTool.fnJumpToPage(
                `/story/${nextStory.id}`
              );
            }}
          >
            Next Story
          </div>
        );
      }
    };

    return (
      <div className="stories-reader">
        <div className="banner">
          <img className="sr-image" src={story.bannerUrl}></img>
        </div>
        <div className="novel-parent">
          <div className="sr-nav-header">
            <div
              className="chapter-text"
              onClick={() => {
                NavTool.fnJumpToPage(`/story?chapter=${story.chapter}`);
              }}
            >
              {story.chapter}
            </div>
            /{story.serial}
          </div>
          <div className="sr-title">{story.title}</div>
          <div className="sr-nft-related">
            <div className="related-text"> Related NFT(s):</div>
            <div className="sr-nft-parent">
              {story.nfts?.map((v, i) => {
                return (
                  <div
                    className="sr-nft-item"
                    key={i}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(v.mibaoUrl);
                    }}
                  >
                    {v.name}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="sr-content">{story.content}</div>

          <div className="sr-nav-footer">
            {fnPrev()}
            {fnNext()}
          </div>
        </div>
      </div>
    );
  }
}
