import axios, { AxiosResponse } from "axios";
import { NFT, NFT_QUERY } from "../nervape/nft";
import { ChapterList, Story } from "../nervape/story";
import { NacpMetadataAttribute, UpdateMetadataForm } from "../nervape/nacp";
import { CONFIG } from "../utils/config";
import htmr from "htmr";
import { getWindowWidthRange, showErrorNotification } from "../utils/utils";
import AssetTypeIcon from '../assets/icons/asset_type_icon.svg';

class NervapeApi {
  //@ts-ignore
  public baseUrl = CONFIG.API_HOST;
  public metadataBaseUrl = CONFIG.METADATA_API_HOST;

  private _fnDealResponse(res: AxiosResponse, url: string) {
    if (res.status !== 200) {
      console.warn(res);
      throw `request failed:${url} `;
    }
    const data = res.data;
    if (data.code !== 0) {
      console.warn(data);
      if ([10422, 10423].includes(data.code)) {
        showErrorNotification({
          message: data.code == 10422 ? 'Request Error' : 'Insufficient Asset',
          description: data.message,
          icon: data.code == 10423 ? htmr(`<img src=${AssetTypeIcon} alt="" />`) : '',
        });
      }

      throw `request failed:${data.message} from  ${url} `;
    }
    return data.data;
  }

  private _fnDealSessionResponse(res: AxiosResponse, url: string) {
    if (res.status !== 200) {
      console.warn(res);
      showErrorNotification({
        message: 'Request Error',
        description: res.data.message,
      });
      throw `request failed:${url} `;
    }

    const data = res.data;

    if (data.code !== 0) {
      showErrorNotification({
        message: 'Request Error',
        description: res.data.message
      });
      throw `request failed:${data.message} from  ${url} `;
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

  public async fnGetProfileNonce() {
    const url = `${this.baseUrl}/nacp/profile/nonce`;
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

  public async fnSendForVerify(message: string, signature: string, updateMetadatForm: UpdateMetadataForm) {
    const url = `${this.baseUrl}/nacp/verify`;
    const res = await axios.post(url, JSON.stringify({ message, signature, ...updateMetadatForm }), {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    return this._fnDealResponse(res, url);
  }

  public async fnUserProfileVerify(message: string, signature: string, nacp: number) {
    const url = `${this.baseUrl}/nacp/profile/verify`;
    const res = await axios.post(url, JSON.stringify({ message, signature, nacp }), {
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

  public async fnGetSignature(address: string) {
    const url = `${this.baseUrl}/nacp/get_signature`;
    const res = await axios.get(url, {
      params: { address },
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

  public async fnGetStorySpecialAsset(address: string) {
    const url = `${this.baseUrl}/story/website/story/special?address=${address}`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }

  public async fnGetUserAsseta(address: string) {
    const url = `${this.baseUrl}/pfp-asset/website/user/assets/${address}`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }

  public async fnGetPhases(address: string) {
    const url = `${this.baseUrl}/pfp-asset/website/phases/${address}`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }

  public async fnGetAssets(category: string, address: string) {
    const url = `${this.baseUrl}/pfp-asset/website/phase/${category}/assets/${address}`;
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

  public async NacpFileUpload(url: string, formData: any) {
    const header = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    return await axios.post(url, formData, header);
  }

  public async fnMintAllow(address: string) {
    const url = `${this.baseUrl}/nacp/mint/allow?address=${address}`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }

  public async fnNacpSetting() {
    const url = `${this.baseUrl}/nacp/setting`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }
  
  public async fnNacpSneakPeek() {
    const url = `${this.baseUrl}/pfp-asset/website/sneak-peeks`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }

  public async fnPhasesSetting() {
    const url = `${this.baseUrl}/pfp-asset/website/phases/setting`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }


  public async fnGetMetadataByTokenId(tokenId: number) {
    const url = `${this.metadataBaseUrl}/nacp/${tokenId}`;
    return await axios.get(url);
  }

  public async fnGetCategoriesByAttributes(attributes: NacpMetadataAttribute[]) {
    const url = `${this.baseUrl}/pfp-asset/website/categories`;
    const res = await axios.post(url, { attributes: attributes });
    return this._fnDealResponse(res, url);
  }

  public async fnGetUserAssets(address: string) {
    const url = `${this.baseUrl}/pfp-asset/website/user/assets/${address}`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }

  public async fnGetUserProfile(address: string) {
    const url = `${this.baseUrl}/nacp/profile/${address}`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }

  public async fnGetNacpCategories() {
    const url = `${this.baseUrl}/pfp-asset/website/nacp/categories/filter`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }

  public async fnGetNacpAssetsByCategory(categoryId: string, name: string) {
    const url = `${this.baseUrl}/pfp-asset/website/nacp/assets/filter/${categoryId}?name=${name}`;
    const res = await axios.get(url);
    return this._fnDealResponse(res, url);
  }

  public async fnfilterNacp(tokenId: number | undefined, assets: string[] | undefined) {
    const url = `${this.baseUrl}/nacp/website/search`;
    const res = await axios.post(url, { tokenId, assets });
    return this._fnDealResponse(res, url);
  }
}

export const nervapeApi = new NervapeApi();
