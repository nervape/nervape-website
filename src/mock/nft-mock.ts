import { NFT, NFT_TYPE } from "../nervape/nft";

import axios from "axios";

export class NFTsMock {
  public static async fGetTypes() {
    return ;
  }

  public static async fnGetNftList() {
    return [];
  }

  public static async fnGetLatest() {
    return []
  }
}
