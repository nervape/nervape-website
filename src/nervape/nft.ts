import { Story } from "./story";

export enum NFTType {
  Featured = "Featured",
  Character = "Character",
  Scene = "Scene",
  Item = "Item",
}

export class NftItem {
  id = "";

  name = "";

  distributed = 0;

  last = 0;

  type: NFTType[] = [];

  thumbnail = "";

  descriptsion = "";

  stories?: Story;

  mibaoUrl = "";

  purchaseUrl = "";

  bannerImgUrl = "";

  // id: number;
  // name: string;
  // type: NFT_TYPE[];
  // stories: string[];
  // mibaoUrl: string;
  // kollectMeUrl: string;

  // ===== > info from mibao
  // description: string;
  // issued: string;
  // renderer: string;
  // cover_image_url: string;
  // uuid: string;
  // total: string;
  // is_banned: boolean;
}
