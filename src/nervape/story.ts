import { NFT } from "./nft";

export type CHAPTER_TYPE = "" | "Chapter I" | "Chapter II" | "Chapter III";

export class Chapter {
  _id: string = "";
  name: string = "";
}

export class Story {
  _id: string = "";
  id: string = "";
  chapter: CHAPTER_TYPE = "";
  chapterId?: Chapter;
  serial: string = "";
  title: string = "";
  urlMask: string = "";
  overview: string = "";
  content: string = "";

  imageUrl: string = "";
  hoverImageUrl: string = "";
  bannerUrl: string = "";
  bannerUrlSmall: string = "";

  previousId: string = "";
  nextId: string = "";

  nftId: string[] = [];
  publish: boolean = false;
  latest: boolean = false;

  nfts: NFT[] = [];
  previousStory?: Story;
  nextStory?: Story;

  background: string = "";
  headerSketch: string = "";
  footerSketch: string = "";
  headerSketchSmall: string = "";
  footerSketchSmall: string = "";

  sideStoryOpen: boolean = false;
  sideStoryIcon: string = "";
  sideStoryIconHover: string = "";
  sideStoryName: string = "";
  sideStorySerial: string = "";
  sideStoryCover: string = "";
  sideStoryDesc: string = "";
  sideStoryBackground: string = "";
}

export class Story_NFT_List {
  _id: string = "";
  title: string = "";
  chapter: CHAPTER_TYPE = "";
  serial: string = "";
}

export class ChapterList {
  _id: string = "";
  name: string = "";
  isShow: boolean = false;
  coming_soon: boolean = false;
  color: string = "";
  background: string = "";
  desc: string = "";
  stories: Story[] = [];
}
