import { NftItem } from "./nft";
import moment from "moment-timezone";
export class CamPaign {
  ruleUrl = "";
  materialUrl = "";
  claimUrl = "";

  name = "";
  content = "";

  reward: NftItem[] = [];
  materials: NftItem[] = [];

  startTime = moment("2022-03-01 00:00:00");
}
