import { NFT } from "./nft";

export type CHAPTER_TYPE = "" | "Chapter I" | "Chapter II" | "Chapter III";

export class Story {
  id: string = "";
  chapter: CHAPTER_TYPE = "";
  serial: string = "";
  title: string = "";
  overview: string = "";
  content: string = "";

  imageUrl: string = "";
  bannerUrl: string = "";

  previousId: string = "";
  nextId: string = "";

  nftId: string[] = [];
  publish: boolean = false;
  latest: boolean = false;

  nfts: NFT[] = [];
  previousStory?: Story;
  nextStory?: Story;
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
}
