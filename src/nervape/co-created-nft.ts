export type NFT_TYPE = "" | "Character" | "Scene" | "Item" | "Special";

export class NFT_BANNER {
    _id: string = "";
    imageUrl4k: string = "";
    imageUrlsmail: string = "";
    promoVideoUrl: string = "";
    name: string = "";
    desc: string = "";
    type: NFT_TYPE = "";
    published: boolean = false;
    sort: number = 0;
    status: string = "";
}

export class NFT_QUERY {
    name?: string;
    event?: string[];
}

export class Co_Created_NFT {
    name: string = "";
    image: string = "";
    type: NFT_TYPE = "";
    total: number = 0;
    issued: number = 0;
    coming_soon: boolean = false;
    sort: number = 0;
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
