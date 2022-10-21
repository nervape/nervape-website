import axios from "axios";
import { NFT, NFT_QUERY } from "../nervape/nft";
import { ChapterList, Story } from "../nervape/story";

console.log();

class NervapeApi {
  //@ts-ignore
  public baseUrl = import.meta.env.VITE_API_BASE_URL;

  public async fnGetStoryList(id?: string) {
    const url = `${this.baseUrl}/story/read${!id ? "" : "/?id=" + id}`;
    console.log(url);
    const res = await axios.get(url);
    if (res.status !== 200) {
      console.warn(res);
      throw `request failed:${url} `;
    }
    const data = res.data;
    if (data.code !== 0) {
      console.warn(data);
      throw `request failed:${data.msg} from  ${url} `;
    }
    const publish = data.data.filter((v: Story) => v.publish === true);
    return publish;
  }

  public async fnGetSyncFromMibao() {
    const url = `${this.baseUrl}/nft/sync-mibao`;
    console.log(url);
    const res = await axios.get(url);
    if (res.status !== 200) {
      console.warn(res);
      throw `request failed:${url} `;
    }
    const data = res.data;
    if (data.code !== 0) {
      console.warn(data);
      throw `request failed:${data.msg} from  ${url} `;
    }
    const result: NFT[] = data.data.sort((a: NFT, b: NFT) => a.index - b.index);
    const publish = result.filter((v) => v.publish === true);
    return publish;
  }

  public async fnGetChapters() : Promise<ChapterList[]> {
    const url = `${this.baseUrl}/chapter/all`;
    const res = await axios.get(url);
    if (res.status !== 200) {
      console.warn(res);
      throw `request failed: ${url} `;
    }
    const data = res.data;
    if (data.code !== 0) {
      console.warn(data);
      throw `request failed:${data.msg} from  ${url} `;
    }
    return data.data;
  }

  public async fnGetStories(chapter: string, latest?: boolean) {
    const url = `${this.baseUrl}/story${!chapter ? "" : "?chapter=" + chapter}${!latest ? "" : "&latest=" + latest}`;
    const res = await axios.get(url);
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

  public async fnGetStoryDetail(id: string) {
    const url = `${this.baseUrl}/story/profile/${id}`;
    const res = await axios.get(url);
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

  public async fnGetCampaigns() {
    const url = `${this.baseUrl}/campaign/website`;
    const res = await axios.get(url);
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

  public async fnGetNFTBanners() {
    const url = `${this.baseUrl}/nft/banners/all`;
    const res = await axios.get(url);
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

  public async fnGetNftFilterList() {
    const url = `${this.baseUrl}/nft/filter`;
    const res = await axios.get(url);
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

  public async fnGetNfts(query?: NFT_QUERY) {
    const url = `${this.baseUrl}/nft`;
    const res = await axios.get(url, {
      params: query
    });
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
}

export const nervapeApi = new NervapeApi();
