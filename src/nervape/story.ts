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
}

export class Chapter {
  name = "";
  stories: Story[] = [];
}
