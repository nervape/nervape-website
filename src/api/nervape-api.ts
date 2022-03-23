import axios from "axios";
import { NFT } from "../nervape/nft";

class NervapeApi {
  // public baseUrl = "http://localhost:3001/nvp-admin";
  public baseUrl = "https://dev.nervape.com/nvp-admin";

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
    const result = data.data.sort((a:NFT, b:NFT) => a.index - b.index);
    return result;
  }

  public async fnGetNftList(id?: string) {
    const url = `${this.baseUrl}/nft/read${!id ? "" : "/?id=" + id}`;
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
    const result = data.data.sort((a:NFT, b:NFT) => a.index - b.index);
    return result;
  }
}

export const nervapeApi = new NervapeApi();
