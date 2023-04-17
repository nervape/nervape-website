import { NFT } from "./nft";
import moment from "moment-timezone";
export class Campaign {
  title = "";
  rule_url = "";
  material_availability_url = "";
  nft_claim_url = "";

  name = "";
  overview = "";

  reward?: NFT;
  materials: NFT[] = [];

  startTime = "";
  endTime = "";

  timeline: string = "";
}

export class CampaignBanner {
  imageUrl4k: string = "";
  imageUrlsmail: string = "";
}

export class PoapBadge {
  name: string = "";
  cover_image_url: string = "";
  start_date: string = "";
  end_date: string = "";
  status: boolean = true;
  sort: number = 0;
  redirect_url: string = "";
  timeline: string = "";
}

export class Event {
  _id: string = "";
  title: string = "";
  startTime: string = "";
  endTime: string = "";
  proposalId: string = "";
  state: string = "";
  openUrl: string = "";
  sort: number = 0;
  show?: boolean = false;
}

export class Vote {
  choice: number = 0;
  created: number = 0;
  id: string = "";
  proposal: { id: string } = { id: "" };
  space: { id: string } = { id: "" };
  voter: string = "";
}
