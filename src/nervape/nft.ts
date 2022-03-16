import { Story } from "./story";
import iconFeatured from "../assets/gallery/scene.svg";
import iconCharacter from "../assets/gallery/scene.svg";
import iconScene from "../assets/gallery/scene.svg";
import iconItem from "../assets/gallery/scene.svg";

export type NFT_TYPE = "Featured" | "Character" | "Scene" | "Item";

export class NFT {
  id: string = "";
  name: string = "";
  type: NFT_TYPE[] = [];
  storyId: string[] = [];
  bannerUrl: string = "";
  mibaoUrl: string = "";
  kollectMeUrl: string = "";
  publish: boolean = false;
  latest: boolean = false;

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
