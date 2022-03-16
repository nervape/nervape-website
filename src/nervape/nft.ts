import { Story } from "./story";

export type NFT_TYPE = "Featured" | "Character" | "Scene" | "Item";

export class NFT {
  id: string = "";
  name: string = "";
  type: NFT_TYPE[] = [];
  storyId: string[] = [];
  mibaoUrl: string = "";
  kollectMeUrl: string = "";
  // ===== > info from mibao
  description: string = "";
  issued: string = "";
  renderer: string = "";
  cover_image_url: string = "";
  uuid: string = "";
  total: string = "";
  is_banned: boolean = false;

  // ===== > info from mibao
  stories: Story[] = [];

}
