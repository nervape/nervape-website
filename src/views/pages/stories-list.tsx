import React, { Component } from "react";
import { StoriesMock } from "../../mock/stories-mock";
import { Chapter, Story } from "../../nervape/story";
import { NavTool } from "../../route/navi-tool";
import { StoriesListItem } from "./stories-list-item";
import "./stories-list.less";

const chaptersData = StoriesMock.fnGetStories();

export interface IStoriesListState {
  chapters: Chapter[];
}

export class StoriesList extends Component<any, IStoriesListState> {
  constructor(props: any) {
    super(props);
    this.state = {
      chapters: chaptersData,
    };
  }

  fnSlecteChapter(chapter: Chapter) {
    NavTool.fnJumpToPage(`/story?chapter=${chapter.name}`);
    this.forceUpdate();
  }

  render() {
    const { chapters } = this.state;
    const chapterParam = NavTool.fnQueryParam("chapter");

    let activeInndex = 0;

    for (let index = 0; index < chapters.length; index++) {
      const c = chapters[index];
      if (
        c.name.toLocaleLowerCase().trim().replace(/\s+/g, "") === chapterParam
      ) {
        activeInndex = index;
      }
    }

    return (
      <div className="stories-list">
        <div className="headline">Story</div>
        <div className="subfield-group">
          {
            /* 分栏 */
            chapters.map((v, i) => {
              return (
                <div className="chapter-box" key={`${v.name}-${i}`}>
                  <div
                    className={`subfield ${
                      activeInndex === i ? "subfield-selected" : ""
                    }`}
                    onClick={() => {
                      if (i === 0) {
                        this.fnSlecteChapter(v);
                      }
                    }}
                  >
                    {v.name}
                  </div>
                  {i === chapters.length - 1 ? (
                    ""
                  ) : (
                    <div className="line"></div>
                  )}
                </div>
              );
            })
          }
        </div>

        <div className="stories-intro-list">
          {chapters[activeInndex].stories.map((v, i) => {
            return <StoriesListItem story={v} key={i}></StoriesListItem>;
          })}
        </div>

        <div className="list"></div>
      </div>
    );
  }
}
