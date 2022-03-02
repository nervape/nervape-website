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

  story?: Story;

  mibaoUrl = "";

  purchaseUrl = "";

  bannerImgUrl = "";
}
