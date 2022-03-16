import React, { Component } from "react";
import { StoriesIntro } from "./stories-intro";
import { Chapter, StoriesList } from "./stories-list";
import testImg from "../../assets/noval/intro-bg.png";
import { StoriesReader } from "./stories-reader";
import { StoriesMock } from "../../mock/stories-mock";
import { NavTool } from "../../route/navi-tool";
import "./stories.less";
import { nervapeApi } from "../../api/nervape-api";
import { CHAPTER_TYPE, Story } from "../../nervape/story";
import { NFT } from "../../nervape/nft";

export class StoriesPage extends Component<
  any,
  {
    latest?: Story;
    stories: Story[];
    chapters: Chapter[];
  }
> {
  constructor(props: any) {
    super(props);
    this.state = { latest: undefined, stories: [], chapters: [] };
  }
  async fnGetStoryList() {
    const stories = (await nervapeApi.fnGetStoryList()) as Story[];
    const nfts = (await nervapeApi.fnGetNftList()) as NFT[];
    for (let i = 0; i < stories.length; ++i) {
      const story = stories[i];
      story.nfts = [];
      story.nftId.map((v) => {
        const nft = nfts.find((n) => n.id === v);
        if (nft) {
          story.nfts.push(nft);
        }
      });

      story.previousStory = stories.find((v) => v.id === story.previousId);
      story.nextStory = stories.find((v) => v.id === story.nextId);
    }
    const chapters = [
      {
        name: "Chapter I",
        stories: [],
      },
      {
        name: "Chapter II",
        stories: [],
      },
      {
        name: "Chapter II",
        stories: [],
      },
    ] as Chapter[];
    const chapterName: CHAPTER_TYPE[] = [
      "Chapter I",
      "Chapter II",
      "Chapter III",
    ];
    for (let i = 0; i < stories.length; ++i) {
      const story = stories[i];
      const chpIdx = chapterName.indexOf(story.chapter);
      chapters[chpIdx].stories.push(story);
    }

    console.log("load data", stories, nfts);
    const latest = stories.find((v) => v.latest);
    console.log(latest);
    this.setState({
      latest,
      stories,
      chapters,
    });
  }

  componentDidMount() {
    this.fnGetStoryList();
  }

  fnFindSerialStory() {
    const { chapters } = this.state;

    const chapter = NavTool.fnQueryParam("chapter");
    const serial = NavTool.fnQueryParam("serial");
    console.log(`chapter;${chapter}, story:${serial}`);
    let enableChapters = false;
    let enableStory = false;
    if ((chapter === null && serial === null) || chapter !== null) {
      enableChapters = true;
    }
    if (serial !== null) {
      enableChapters = false;
      enableStory = true;
    }
    const cpData = chapters.find(
      (v) => NavTool.fnStdNavStr(v.name) === chapter
    );
    console.log(cpData);
    const storyDetail = cpData?.stories.find((v) => {
      return NavTool.fnStdNavStr(v.serial) === serial;
    }) as Story;

    return { enableChapters, enableStory, storyDetail };
  }

  render() {
    const { latest, chapters } = this.state;
    const { enableChapters, enableStory, storyDetail } =
      this.fnFindSerialStory();

    const fnShowList = () => {
      if (enableChapters === true) {
        return (
          <>
            <StoriesIntro latest={latest}></StoriesIntro>
            <StoriesList chapters={chapters}></StoriesList>
          </>
        );
      }
    };
    const fnShowDetail = () => {
      if (enableStory === true)
        return <StoriesReader story={storyDetail}></StoriesReader>;
    };

    return (
      <div className="stories-page">
        {fnShowList()}
        {fnShowDetail()}
      </div>
    );
  }
}
