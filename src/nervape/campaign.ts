import { NFT } from "./nft";
import moment from "moment-timezone";
export class Campaign {
  rule_url = "";
  material_availability_url = "";
  nft_claim_url = "";

  name = "";
  overview = "";

  reward?: NFT;
  materials: NFT[] = [];

  startTime = moment("2022-03-01 00:00:00");
}
