import React, { Component } from "react";
import { StoriesIntro } from "./stories-intro";
import { StoriesList } from "./stories-list";
import testImg from "../../assets/noval/intro-bg.png";

export interface ISotory {
  chapter?: string;
  sequence?: string;
  title?: string;
  content?: string;
  related?: string[];
  image?: string;
}

export interface IGroup {
  name?: string;
  list: ISotory[];
}

export type IStoriesList = IGroup[];

const stories: IStoriesList = [
  {
    name: "Chapter I",
    list: [
      {
        chapter: "Chapter I",
        sequence: "Story001",
        title: "title",
        content: "content",
        related: ["realated", "realated", "realated"],
        image: testImg,
      },
      {
        chapter: "Chapter I",
        sequence: "Story001",
        title: "title",
        content: "content",
        related: ["realated"],
        image: testImg,
      },
    ],
  },

  {
    name: "Chapter II",
    list: [
      {
        chapter: "Chapter II",
        sequence: "Story001",
        title: "title",
        content: "content",
        related: ["realated"],
        image: testImg,
      },
      {
        chapter: "Chapter II",
        sequence: "Story001",
        title: "title",
        content: "content",
        related: ["realated"],
        image: testImg,
      },
    ],
  },

  {
    name: "Chapter III",
    list: [
      {
        chapter: "Chapter III",
        sequence: "Story001",
        title: "title",
        content: "content",
        related: ["realated"],
        image: testImg,
      },
      {
        chapter: "Chapter III",
        sequence: "Story001",
        title: "title",
        content: "content",
        related: ["realated"],
        image: testImg,
      },
    ],
  },
];

export class Stories extends Component {
  render() {
    const latest: ISotory = {
      ...(stories[0].list[0] as ISotory),
    };
    return (
      <div className="stories">
        <StoriesIntro latestStory={latest}></StoriesIntro>
        <StoriesList active={0} stories={stories}></StoriesList>
      </div>
    );
  }
}
