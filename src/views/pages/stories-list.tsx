import React, { Component } from "react";
import { IStoriesList } from "./stories";
import { StoriesListItem } from "./stories-list-item";
import "./stories-list.less";

export interface IStoriesListProps {
  active: number;
  stories: IStoriesList;
}

export class StoriesList extends Component<
  IStoriesListProps,
  IStoriesListProps
> {
  constructor(props: IStoriesListProps) {
    super(props);
    this.state = {
      ...props,
    };
  }

  fnSlecteChapter(active: number) {
    if (this.state.active === active) {
      return;
    }
    this.setState({
      active,
    });
  }

  render() {
    const { stories, active } = this.state;

    return (
      <div className="stories-list">
        <div className="headline">Story</div>
        <div className="subfield-group">
          {
            /* 分栏 */
            stories.map((v, i) => {
              return (
                <div className="chapter-box" key={`${v.name}-${i}`}>
                  <div
                    className={`subfield ${
                      active === i ? "subfield-selected" : ""
                    }`}
                    onClick={() => {
                      this.fnSlecteChapter(i);
                    }}
                  >
                    {v.name}
                  </div>
                  {i === stories.length - 1 ? "" : <div className="line"></div>}
                </div>
              );
            })
          }
        </div>

        <div className="stories-intro-list">
          {stories[active].list.map((v, i) => {
            return (
              <StoriesListItem
                story={v}
                key={i}
                onClickCard={(e: any) => {
                  console.log(e);
                }}
              ></StoriesListItem>
            );
          })}
        </div>

        <div className="list"></div>
      </div>
    );
  }
}
