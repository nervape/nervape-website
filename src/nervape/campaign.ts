import { NFT } from "./nft";
import moment from "moment-timezone";
export class Campaign {
  ruleUrl = "";
  materialUrl = "";
  claimUrl = "";

  name = "";
  overview = "";

  reward: NFT[] = [];
  materials: NFT[] = [];

  startTime = moment("2022-03-01 00:00:00");
}
