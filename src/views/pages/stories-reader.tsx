import React, { Component } from "react";
import { ISotory } from "./stories";

import "./stories-reader.less";

export interface IStoriesReaderProps {
  story: ISotory;
  previous: boolean;
  next: boolean;
}

export class StoriesReader extends Component<IStoriesReaderProps> {
  render() {
    const { story, previous, next } = this.props;
    return (
      <div className="stories-reader">
        <img className="sr-image" src={story.image}></img>
        <div className="novel-parent">
          <div className="sr-nav-header">
            {story.chapter}/{story.title}
          </div>
          <div className="sr-title">{story.title}</div>
          <div className="sr-nft-related">
            Relatred NFT(s):
            <div className="sr-nft-parent">
              {story.related?.map((v, i) => {
                return (
                  <div className="sr-nft-item" key={i}>
                    {v}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="sr-content">{story.content}</div>

          <div className="sr-nav-footer">
            {previous === true ? (
              <div className="sr-previous">Previous Story</div>
            ) : (
              ""
            )}
            {next === true ? <div className="sr-next">Next Story</div> : ""}
          </div>
        </div>
      </div>
    );
  }
}
