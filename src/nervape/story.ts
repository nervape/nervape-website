import { NftItem } from "./nft";

export class Story {
  public chapter = "";
  public serial = "";
  public name = "";
  public overview = "";
  public content = "";

  public imageUrl = "";
  public storyBannerUrl = "";
  public nft: NftItem[] = [];


  // id: number;
  // chapter: CHAPTER_TYPE;
  // serial: string;
  // title: string;
  // overview: string;
  // content: string;

  // imageUrl: string;
  // bannerUrl: string;

  // previousId: string;
  // nextId: string;

  // nftId: string[];
  // publish: boolean;

  
}

export class Chapter {
  name = "";
  stories: Story[] = [];
}
