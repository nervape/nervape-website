import React, { Component } from "react";
import { StoriesMock } from "../../mock/stories-mock";
import { Story } from "../../nervape/story";
import { NavTool } from "../../route/navi-tool";
import { StoriesListItem } from "./stories-list-item";
import "./stories-list.less";

export class Chapter {
  name = "";
  stories: Story[] = [];
}

export class StoriesList extends Component<{
  chapters: Chapter[];
}> {
  constructor(props: any) {
    super(props);
  }

  fnSlecteChapter(chapter: Chapter) {
    NavTool.fnJumpToPage(`/story?chapter=${chapter.name}`);
    this.forceUpdate();
  }

  render() {
    const { chapters } = this.props;
    if (!chapters || chapters.length === 0) {
      return <></>;
    }
    console.log(chapters);
    const chapterParam = NavTool.fnQueryParam("chapter");

    let activeInndex = 0;

    for (let index = 0; index < chapters.length; index++) {
      const c = chapters[index];
      if (NavTool.fnStdNavStr(c.name) === chapterParam) {
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
