import { NftItem } from "../nervape/nft";
import { Story } from "../nervape/story";
import testImgUrl from "../assets/gallery/nft-bg-medium.png";

const storyTemplate = new Story();
storyTemplate.chapter = "chapter name";
storyTemplate.imageUrl = testImgUrl;
storyTemplate.serial = "Story 001";
storyTemplate.name = "story name";
storyTemplate.overview = "overview text";
storyTemplate.content = `contet text`;

const nftTemplate: NftItem = {
  id: "",

  name: "test nft",

  distributed: 256,

  last: 10,

  descriptsion: "descriptsiondescriptsiondescriptsiondescriptsion",
  type: "",

  thumbnail: "",

  story: storyTemplate,

  mibaoUrl: "https://www.bing.com",

  purchaseUrl: "https://www.google.com",
};

const nftList: NftItem[] = [
  { ...nftTemplate, type: "Featured" },
  { ...nftTemplate, type: "Featured" },
  { ...nftTemplate, type: "Featured" },
  { ...nftTemplate, type: "Featured" },
  { ...nftTemplate, type: "Character" },
  { ...nftTemplate, type: "Character" },
  { ...nftTemplate, type: "Scene" },
  { ...nftTemplate, type: "Scene" },
  { ...nftTemplate, type: "Item" },
];

export class NFTsMock {
  public static fGetTypes() {
    return ["Featured", "Character", "Scene", "Item"];
  }

  public static fnGetNftList(): NftItem[] {
    return nftList;
  }

  public static fnGetLatest() {
    return nftList[0];
  }
}
