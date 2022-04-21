import { Story, Story_NFT_List } from "./story";
import iconScene from "../assets/gallery/scene.svg";
import iconCharacter from "../assets/gallery/character.svg";
import iconItem from "../assets/gallery/item.svg";

export type NFT_TYPE = "" | "Character" | "Scene" | "Item";

export const IconMap = new Map<NFT_TYPE, string>();
IconMap.set("Character", iconCharacter);
IconMap.set("Scene", iconScene);
IconMap.set("Item", iconItem);

export class NFT {
  id: string = "";
  name: string = "";
  type: NFT_TYPE[] = [];
  storyId: string[] = [];
  bannerUrl: string = "";
  mibaoUrl: string = "";
  kollectMeUrl: string = "";
  index: number = -1;
  featured: boolean = false;
  publish: boolean = false;
  latest: boolean = false;

  // ===== > info from mibao
  description: string = "";
  issued: string = "";
  renderer: string = "";
  cover_image_url: string = "";
  image: string = "";
  uuid: string = "";
  total: string = "";
  is_banned: boolean = false;

  // ===== > info from mibao
  stories: Story[] = [];
}

export class NFT_List {
  id: string = "";
  name: string = "";
  type: NFT_TYPE[] = [];
  storyId: string[] = [];
  bannerUrl: string = "";
  mibaoUrl: string = "";
  kollectMeUrl: string = "";
  index: number = -1;
  featured: boolean = false;
  publish: boolean = false;
  latest: boolean = false;

  // ===== > info from mibao
  description: string = "";
  issued: string = "";
  renderer: string = "";
  cover_image_url: string = "";
  image: string = "";
  uuid: string = "";
  total: string = "";
  is_banned: boolean = false;

  stories: Story_NFT_List[] = [];
}
