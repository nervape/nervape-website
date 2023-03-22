import axios, { AxiosResponse } from "axios";
import { NFT, NFT_QUERY } from "../nervape/nft";
import { ChapterList, Story } from "../nervape/story";

console.log();

class NervapeApi {
  //@ts-ignore
  public baseUrl = import.meta.env.VITE_API_HOST;

  private _fnDealResponse(res: AxiosResponse, url: string) {
    if (res.status !== 200) {
      console.warn(res);
      throw `request failed:${url} `;
    }
    const data = res.data;
    if (data.code !== 0) {
      console.warn(data);
      throw `request failed:${data.msg} from  ${url} `;
    }
    return data.data;
  }

  public async fnGetChapters(): Promise<ChapterList[]> {
    const url = `${this.baseUrl}/chapter/all`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }

  public async fnGetStories(chapter: string, latest?: boolean) {
    const url = `${this.baseUrl}/story${!chapter ? "" : "?chapter=" + chapter}${!latest ? "" : "&latest=" + latest}`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }

  public async fnGetStoryDetail(id: string) {
    const url = `${this.baseUrl}/story/profile/${id}`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }

  public async fnGetCampaigns() {
    const url = `${this.baseUrl}/campaign/website`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }

  public async fnGetNFTBanners() {
    const url = `${this.baseUrl}/nft/banners/all`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }

  public async fnGetNftFilterList() {
    const url = `${this.baseUrl}/nft/filter`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }

  public async fnGetNfts(query?: NFT_QUERY) {
    const url = `${this.baseUrl}/nft`;
    const res = await axios.get(url, {
      params: query
    });
    return this._fnDealResponse(res, url);
  }

  public async fnGetCampaignBanners() {
    const url = `${this.baseUrl}/campaign/banners/all`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }

  public async fnGetPoapBadges() {
    const url = `${this.baseUrl}/campaign/poap_badges/all`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }

  public async fnGetStaffs() {
    const url = `${this.baseUrl}/staff/website`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }
  public async fnGetQuestions() {
    const url = `${this.baseUrl}/question/website`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }

  public async fnSearchBonelist(address: string) {
    const url = `${this.baseUrl}/bonelist/search`;
    const res = await axios.post(url, { address });
    return this._fnDealResponse(res, url);
  }

  public async fnGetNonce() {
    const url = `${this.baseUrl}/nacp/nonce`;
    const res = await axios.get(url, {
      withCredentials: true
    });
    return this._fnDealResponse(res, url);
  }
  
  public async fnGetInformation() {
    const url = `${this.baseUrl}/nacp/personal_infomation`;
    const res = await axios.get(url, {
      withCredentials: true
    });
    return this._fnDealResponse(res, url);
  }

  public async fnSendForVerify(message: string, signature: string) {
    const url = `${this.baseUrl}/nacp/verify`;
    const res = await axios.post(url, JSON.stringify({ message, signature }), {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    return this._fnDealResponse(res, url);
  }

  public async fnCreateNacp(address: string, payload: any) {
    const url = `${this.baseUrl}/nacp/create`;
    const res = await axios.post(url, JSON.stringify({ address, payload }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return this._fnDealResponse(res, url);
  }

  public async fnGetSignature(ids: string[]) {
    const url = `${this.baseUrl}/nacp/sign`;
    const res = await axios.post(url, JSON.stringify({ ids }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return this._fnDealResponse(res, url);
  }

  public async fnGetNacps(address: string) {
    const url = `${this.baseUrl}/nacp/list?address=${address}`;
    const res = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return this._fnDealResponse(res, url);
  }
}

export const nervapeApi = new NervapeApi();
