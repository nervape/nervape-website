import { CamPaign } from "../nervape/campaign";
import { NFTsMock } from "./nft-mock";
import tempMat from "../assets/campaign/cam-mat-template.png";
import tempImg from "../assets/campaign/cam-img-template.png";

const cpTemplate = new CamPaign();
cpTemplate.name = "test name";
cpTemplate.content = `    -- test content
test content
    ---`;

cpTemplate.ruleUrl = "https://google.com";
cpTemplate.materialUrl = "https://bing.com";
cpTemplate.claimUrl = "https://baidu.com";

const nftTemplate = NFTsMock.fnGetLatest();
cpTemplate.reward = [{ ...nftTemplate, thumbnail: tempImg }];

cpTemplate.materials = [
  { ...nftTemplate, thumbnail: tempMat },
  { ...nftTemplate, thumbnail: tempMat },
  { ...nftTemplate, thumbnail: tempMat },
  { ...nftTemplate, thumbnail: tempMat },
];

const dataList: CamPaign[] = [
  { ...cpTemplate },
  { ...cpTemplate },
  { ...cpTemplate },
  { ...cpTemplate },
  { ...cpTemplate },
  { ...cpTemplate },
  { ...cpTemplate },
  { ...cpTemplate },
];

export class CampaignMock {
  public static fnGetDataList() {
    return dataList;
  }
}
