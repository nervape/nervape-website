import { CamPaign } from "../nervape/campaign";
import { NftGroovyParty, NFTsMock } from "./nft-mock";

const campaignParty = new CamPaign();
campaignParty.name = "The groovy party";
campaignParty.overview = `Breaking out of our daily routine, Nervapes have a DAY OFF today! We’re gonna have fun, goof around, and explore this new world to the fullest! Find hidden gems in this crystal ball. Piece together an era of dreams.`;
campaignParty.ruleUrl = "https://medium.com/@Nervape/groovy-party-4ebe82b40a78";
campaignParty.materialUrl = "https://www.nervape.com/claim/availability";
campaignParty.claimUrl = "https://www.nervape.com/claim/login";
campaignParty.reward = [NftGroovyParty];
campaignParty.materials = NFTsMock.fnGetNftList();

const dataList: CamPaign[] = [campaignParty];

export class CampaignMock {
  public static fnGetDataList() {
    return dataList;
  }
}
