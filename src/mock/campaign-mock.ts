import moment from "moment";
import { CamPaign } from "../nervape/campaign";

const campaignParty = new CamPaign();
campaignParty.name = "Groovy Party";
campaignParty.overview = `Breaking out of our daily routine, Nervapes have a DAY OFF today! We’re gonna have fun, goof around, and explore this new world to the fullest! Find hidden gems in this crystal ball. Piece together an era of dreams.`;
campaignParty.ruleUrl = "https://medium.com/@Nervape/groovy-party-4ebe82b40a78";
campaignParty.materialUrl = "https://www.nervape.com/claim/availability";
campaignParty.claimUrl = "https://www.nervape.com/claim/login";
campaignParty.startTime = moment("2022-01-21 00:00:00");
campaignParty.reward = [
  // NftGroovyParty
];
campaignParty.materials = [
  // NftGroovyNfter,
  // NftGroovyRookie,
  // NftGroovyDefier,
  // NftGroovyResearcher,
  // NftGroovyWhale,
  // NftGroovyMiner,
  // NftGroovyDeveloper,
];

const dataList: CamPaign[] = [campaignParty];

export class CampaignMock {
  public static fnGetDataList() {
    return dataList;
  }
}
