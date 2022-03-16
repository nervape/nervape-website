import { NFT, NFT_TYPE } from "../nervape/nft";

import axios from "axios";

export class NFTsMock {
  public static async fGetTypes() {
    return ["Featured", "Character", "Scene", "Item"];
  }

  public static async fnGetNftList() {
    return [];
  }

  public static async fnGetLatest() {
    return []
  }
}
