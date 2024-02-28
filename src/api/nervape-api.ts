import axios, { AxiosResponse } from "axios";
import { NFT, NFT_QUERY } from "../nervape/nft";
import { ChapterList, Story } from "../nervape/story";

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

  private _fnDealSessionResponse(res: AxiosResponse, url: string) {
    if (res.status !== 200) {
      console.warn(res);
      throw `request failed:${url} `;
    }

    return res.data;
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

  public async fnQueryHasTakeQuiz(address: string, storyId: string) {
    const url = `${this.baseUrl}/story/website/hasTakeQuiz`;
    const res = await axios.get(url, {
      params: {
        address,
        storyId
      }
    });
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
  
  public async fnGetCoCreatedNFTBanners() {
    const url = `${this.baseUrl}/co-created-nft/website/banners`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }

  public async fnGetNftFilterList() {
    const url = `${this.baseUrl}/nft/filter`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }
  
  public async fnGetCoCreatedNftFilterList() {
    const url = `${this.baseUrl}/co-created-nft/website/filter`;
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
  
  public async fnGetCoCreatedNfts(query?: NFT_QUERY) {
    const url = `${this.baseUrl}/co-created-nft/website`;
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

  public async fnVerifyLogin() {
    const url = `${this.baseUrl}/nacp/verify/login`;
    const res = await axios.get(url, {
      withCredentials: true
    });
    return this._fnDealSessionResponse(res, url);
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
      },
      withCredentials: true
    });
    return this._fnDealResponse(res, url);
  }

  public async fnGetSignature(ids: string[]) {
    const url = `${this.baseUrl}/nacp/sign`;
    const res = await axios.post(url, JSON.stringify({ ids }), {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    return this._fnDealResponse(res, url);
  }

  public async fnGetNacps(address: string) {
    const url = `${this.baseUrl}/nacp/list?address=${address}`;
    const res = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    return this._fnDealResponse(res, url);
  }

  public async fnGetStoryQuizNonce() {
    const url = `${this.baseUrl}/story/questions/nonce`;
    const res = await axios.get(url, {
      withCredentials: true
    });
    return this._fnDealResponse(res, url);
  }

  public async fnStoryQuizVerify(message: string, signature: string, storyId: string) {
    const url = `${this.baseUrl}/story/questions/verify`;
    const res = await axios.post(url, JSON.stringify({ message, signature, storyId }), {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    return this._fnDealResponse(res, url);
  }

  public async fnStoryQuestions() {
    const url = `${this.baseUrl}/story/questions/all`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }

  public async fnGetActiveEvents(address: string, type?: string) {
    const url = `${this.baseUrl}/campaign/events/active/all?type=${type}&address=${address}`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }

  public async fnGetUserAsseta(address: string) {
    const url = `${this.baseUrl}/pfp-asset/website/user/assets/${address}`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }

  public async fnGetStorySpecialAsset(address: string) {
    const url = `${this.baseUrl}/story/website/story/special?address=${address}`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }

  public async fnVerifyCode(code: string) {
    const url = `${this.baseUrl}/invitation/website/verify/code?code=${code}`;
    const res = await axios.get(url);

    return this._fnDealSessionResponse(res, url);
  }

  public async fnClaimBonelistNonce() {
    const url = `${this.baseUrl}/invitation/website/nonce`;
    const res = await axios.get(url, {
      withCredentials: true
    });
    return this._fnDealResponse(res, url);
  }

  public async fnSubmitVerify(
    code: string,
    message: string,
    signature: string,
    inviteeAddress: string) {
    const url = `${this.baseUrl}/invitation/website/submit/verify`;
    const res = await axios.post(url, JSON.stringify({ code, message, signature, inviteeAddress }), {
      headers: { 'content-type': 'application/json' },
      withCredentials: true
    });

    return this._fnDealSessionResponse(res, url);
  }

  public async fnNacpSneakPeek() {
    const url = `${this.baseUrl}/pfp-asset/website/sneak-peeks`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }

  public async fnGetInvitationInfo(address: string) {
    const url = `${this.baseUrl}/invitation/website/invitation/code/${address}`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }

  public async fnGetCommunityConfig() {
    const url = `${this.baseUrl}/news-page/website/data`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }

  public async fnGetJoyIdNfts(address: string) {
    const url = `https://api.joy.id/api/v1/wallet/held_tokens/${address}?cursor=0&count=10`;
    const res = await axios.get(url);
    return res.data;
  }

  public async fnTransferBonelistNonce() {
    const url = `${this.baseUrl}/bonelist/website/nonce`;
    const res = await axios.get(url, {
      withCredentials: true
    });
    return this._fnDealResponse(res, url);
  }

  public async fnTransferBonelistVerify(
    btc_address: string,
    message: string,
    signature: string) {
    const url = `${this.baseUrl}/bonelist/website/transfer/verify`;
    const res = await axios.post(url, JSON.stringify({ btc_address, message, signature }), {
      headers: { 'content-type': 'application/json' },
      withCredentials: true
    });

    return this._fnDealSessionResponse(res, url);
  }

  public async fnSearchBonelistStatus(address: string) {
    const url = `${this.baseUrl}/bonelist/search/status`;
    const res = await axios.post(url, { address });
    return this._fnDealResponse(res, url);
  }

  public async fnGetInscribe(receiveAddress: string, count: number) {
    const url = `${this.baseUrl}/nacp/inscribe`;
    const res = await axios.post(url, { receiveAddress, count, feeRate: 2 });
    return this._fnDealResponse(res, url);
  }

  public async fnGetOrders(address: string) {
    const url = `${this.baseUrl}/nacp/orders?address=${address}`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }
}

export const nervapeApi = new NervapeApi();
