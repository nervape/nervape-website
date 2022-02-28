import React, { Component } from "react";
import { Link } from "react-router-dom";
import { StoriesMock } from "../../mock/stories-mock";
import { Story } from "../../nervape/story";
import { NavTool } from "../../route/navi-tool";

import "./stories-reader.less";

export class StoriesReader extends Component {
  render() {
    const pChapter = NavTool.fnQueryParam("chapter");
    const pSerial = NavTool.fnQueryParam("serial");
    console.log(pChapter, pSerial);

    const datas = StoriesMock.fnGetStory(pChapter as string, pSerial as string);

    console.log("reader data", datas);
    const { story, previous, next } = datas;

    return (
      <div className="stories-reader">
        <div className="banner">
          <img className="sr-image" src={story.storyBannerUrl}></img>
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
          <div className="sr-title">{story.name}</div>
          <div className="sr-nft-related">
            <div className="related-text"> Relatred NFT(s):</div>
            <div className="sr-nft-parent">
              {story.nft?.map((v, i) => {
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
            {previous !== null ? (
              <div
                className="sr-previous"
                onClick={() => {
                  NavTool.fnJumpToPage(
                    `/story?chapter=${previous.chapter}&&serial=${previous.serial}`
                  );
                }}
              >
                Previous Story
              </div>
            ) : (
              ""
            )}
            {next !== null ? (
              <div
                className="sr-next"
                onClick={() => {
                  NavTool.fnJumpToPage(
                    `/story?chapter=${next.chapter}&&serial=${next.serial}`
                  );
                }}
              >
                Next Story
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    );
  }
}
