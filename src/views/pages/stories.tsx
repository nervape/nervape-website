import React, { Component } from "react";
import { StoriesIntro } from "./stories-intro";
import { Chapter, StoriesList } from "./stories-list";
import testImg from "../../assets/noval/intro-bg.png";
import { StoriesReader } from "./stories-reader";
import { StoriesMock } from "../../mock/stories-mock";
import { NavTool } from "../../route/navi-tool";
import "./stories.less";
import { nervapeApi } from "../../api/nervape-api";
import { ChapterList, Story } from "../../nervape/story";
import { NFT } from "../../nervape/nft";
import { WebMock } from "../../mock/web-mock";

interface StoryPageProps { }

interface StoryPageState {
  latest?: Story;
  stories: Story[];
  chapters: ChapterList[];
}
export class StoriesPage extends Component<StoryPageProps, StoryPageState> {
  constructor(props: StoryPageProps) {
    super(props);
    this.state = { latest: undefined, stories: [], chapters: [] };
  }

  fnInitStoryInfo = async () => {
    // const { latestStory, stories, nfts, chapters } = await WebMock.fnGetMockInfo();
    const { latestStory, stories, chapters } = await WebMock.fnGetStoryMockInfo(true);
    this.setState({
      latest: latestStory,
      stories,
      chapters,
    });
  };

  componentDidMount() {
    this.fnInitStoryInfo();
  }

  fnFindSerialStory() {
    const { chapters } = this.state;

    const chapter = NavTool.fnQueryParam("chapter");
    // const serial = NavTool.fnQueryParam("serial");
    const id = NavTool.fnQueryParam("id");

    // console.log(`chapter;${chapter}, story:${serial}`);
    let enableChapters = false;
    let enableStory = false;

    if ((chapter === null && id === null) || chapter !== null) {
      enableChapters = true;
    }
    if (id !== null) {
      enableChapters = false;
      enableStory = true;
    }
    const cpData = chapters.find(
      (v) => NavTool.fnStdNavStr(v.name) === chapter
    );
    console.log(cpData);
    // const storyDetail = cpData?.stories.find((v) => {
    //   return NavTool.fnStdNavStr(v.serial) === serial;
    // }) as Story;
    const storyDetail = undefined;

    return { enableChapters, enableStory, storyDetail };
  }

  render() {
    const { latest, chapters, stories } = this.state;
    const { enableChapters, enableStory, storyDetail } = this.fnFindSerialStory();

    const fnShowList = () => {
      if (enableChapters === true) {
        return (
          <>
            <StoriesIntro latest={latest}></StoriesIntro>
            <StoriesList chapters={chapters} stories={stories}></StoriesList>
          </>
        );
      }
    };

    return (
      <div className="stories-page">
        {fnShowList()}
      </div>
    );
  }
}
