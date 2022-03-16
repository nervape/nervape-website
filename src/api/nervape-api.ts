import axios from "axios";
import { CHAPTER_TYPE } from "../nervape/story";
import { Chapter } from "../views/pages/stories-list";

class NervapeApi {
  public baseUrl = "http://localhost:3001";

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
    return res.data.data;
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
    return res.data.data;
  }
}

export const nervapeApi = new NervapeApi();
