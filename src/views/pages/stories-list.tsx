import React, { Component } from "react";
import { StoriesMock } from "../../mock/stories-mock";
import { WebMock } from "../../mock/web-mock";
import { ChapterList, Story } from "../../nervape/story";
import { NavTool } from "../../route/navi-tool";
import { StoriesListItem } from "./stories-list-item";
import "./stories-list.less";

export class Chapter {
  name = "";
  stories: Story[] = [];
}

interface StoriesListProps {
  chapters: ChapterList[],
  stories: Story[]
}

interface StoriesListState {
  stories: Story[]
}

export class StoriesList extends Component<StoriesListProps, StoriesListState> {
  constructor(props: StoriesListProps) {
    super(props);
    this.state = {
      stories: []
    }
  }
  elList: HTMLElement | null = null;

  fnSlecteChapter(chapter: ChapterList) {
    const elList = this.elList as HTMLElement;

    this.fnGetStoryList(chapter);
    NavTool.fnJumpToPage(`/story?chapter=${chapter.name}`);
    this.forceUpdate();
    window.scrollTo({
      top: elList.offsetTop - 64,
      behavior: "smooth",
    });
  }
  componentDidUpdate(prevProps: StoriesListProps) {
    if (prevProps.stories != this.props.stories) {
      this.setState({
        stories: this.props.stories
      })
    }
  }
  async fnGetStoryList(chapter: ChapterList) {
    const data = await WebMock.fnGetStoryMockInfo(false, chapter);
    this.setState({
      stories: data.stories
    })
  }

  render() {
    const { chapters } = this.props;
    if (!chapters || chapters.length === 0) {
      return <></>;
    }
    // console.log(chapters);
    const chapterParam = NavTool.fnQueryParam("chapter");

    let activeInndex = 0;

    chapters.forEach((chap, index) => {
      if (NavTool.fnStdNavStr(chap.name) === chapterParam) {
        activeInndex = index;
      }
    })

    return (
      <div
        className="stories-list"
        ref={(elList) => {
          this.elList = elList;
        }}
      >
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
                      if (v.isShow) {
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
          {this.state.stories.map((v, i) => {
            return <StoriesListItem story={v} key={i}></StoriesListItem>;
          })}
        </div>

        <div className="list"></div>
      </div>
    );
  }
}
