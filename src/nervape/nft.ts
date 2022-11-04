import { Story, Story_NFT_List } from "./story";
import iconScene from "../assets/icons/scene.png";
import iconCharacter from "../assets/icons/character.png";
import iconItem from "../assets/icons/item.png";
import iconSpecial from "../assets/icons/special.png";

export type NFT_TYPE = "" | "Character" | "Scene" | "Item" | "Special";

export const IconMap = new Map<NFT_TYPE, string>();
IconMap.set("Character", iconCharacter);
IconMap.set("Scene", iconScene);
IconMap.set("Item", iconItem);
IconMap.set("Special", iconSpecial);

export class NFT {
  id: string = "";
  name: string = "";
  type: NFT_TYPE = '';
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
  origin: string = "";
  short_name: string = "";
  birthday: string = "";
  card_background: string = "";
  job: string = "";

  id_range: string = "";
}

export class NFT_List {
  id: string = "";
  name: string = "";
  type: NFT_TYPE = '';
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

export class NFT_BANNER {
  _id: string = "";
  imageUrl4k: string = "";
  imageUrlsmail: string = "";
  promoVideoUrl: string = "";
  name: string = "";
  job: string = "";
  type: NFT_TYPE = "";
  published: boolean = false;
  sort: number = 0;
}

export class NFT_QUERY {
  name?: string;
  origin?: string[];
  type?: string[];
}

export class NFT_FILTER_ITEM {
  name: string = "";
  count: number = 0;
  checked: boolean = false;
}

export class NFT_FILTER {
  name: string = "";
  open: boolean = true;
  items: NFT_FILTER_ITEM[] = [];
}
