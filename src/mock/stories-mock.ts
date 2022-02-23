import { Chapter, Story } from "../nervape/story";
import imgStroy001 from "../assets/noval/intro-bg.png";
import { NavTool } from "../route/navi-tool";

const storyTemplate = {
  chapter: "chapter name",
  serial: "Story 001",
  name: "An Unexpected Encounter",
  overview: "overview text",
  content: `contet text`,

  imageUrl: imgStroy001,

  nft: [
    {
      name: "Nervape / Story 001",
      url: "https://mibao.net/class/040c00b8-689c-4f2e-83cb-c63e4cf3bbd4",
    },
    {
      name: "Nervape / Story 001",
      url: "https://mibao.net/class/040c00b8-689c-4f2e-83cb-c63e4cf3bbd4",
    },
    {
      name: "Nervape / Story 001",
      url: "https://mibao.net/class/040c00b8-689c-4f2e-83cb-c63e4cf3bbd4",
    },
    {
      name: "Nervape / Story 001",
      url: "https://mibao.net/class/040c00b8-689c-4f2e-83cb-c63e4cf3bbd4",
    },
    {
      name: "Nervape / St",
      url: "https://mibao.net/class/040c00b8-689c-4f2e-83cb-c63e4cf3bbd4",
    },
    {
      name: "Nervape",
      url: "https://mibao.net/class/040c00b8-689c-4f2e-83cb-c63e4cf3bbd4",
    },
  ],
} as Story;

const chapter01 = new Chapter();
chapter01.name = "Chapter 1";
chapter01.stories = [
  {
    ...storyTemplate,
    chapter: chapter01.name,
    serial: "Story 001",
  },
  {
    ...storyTemplate,
    chapter: chapter01.name,
    serial: "Story 002",
  },
  {
    ...storyTemplate,
    chapter: chapter01.name,
    serial: "Story 003",
  },
];

const chapter02 = new Chapter();
chapter02.name = "Chapter 2";
chapter02.stories = [
  {
    ...storyTemplate,
    chapter: chapter02.name,
    serial: "Story 001",
  },
  {
    ...storyTemplate,
    chapter: chapter02.name,
    serial: "Story 002",
  },
  {
    ...storyTemplate,
    chapter: chapter02.name,
    serial: "Story 003",
  },
];

const chapter03 = new Chapter();
chapter03.name = "Chapter 3";
chapter03.stories = [
  {
    ...storyTemplate,
    chapter: chapter03.name,
    serial: "Story 001",
  },
  {
    ...storyTemplate,
    chapter: chapter03.name,
    serial: "Story 002",
  },
  {
    ...storyTemplate,
    chapter: chapter03.name,
    serial: "Story 003",
  },
];

export class StoriesMock {
  public static fnGetStories() {
    return [chapter01, chapter02, chapter03];
  }

  public static fnGetLatest() {
    return chapter01.stories[0];
  }

  public static fnGetStory(chapterName: string, storySerial: string) {
    console.log("fnGetStory", chapterName, storySerial);
    const datas = [chapter01, chapter02, chapter03];
    const cpData = datas.find((v) => {
      return NavTool.fnStdNavStr(v.name) === chapterName;
    }) as Chapter;
    console.log(cpData);
    const story = cpData.stories.find((v) => {
      return NavTool.fnStdNavStr(v.serial) === storySerial;
    }) as Story;
    const index = cpData.stories.indexOf(story);
    return {
      story: story,
      previous: index > 0 ? cpData.stories[index - 1] : null,
      next:
        index < cpData.stories.length - 1 ? cpData.stories[index + 1] : null,
    };
  }
}
