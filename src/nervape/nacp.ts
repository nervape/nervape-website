import { Story } from "./story";

export class NACP_APE {
    coverImage: string = "";
    name: string = "";
    isRight: boolean = false;
}

export class NACP_CATEGORY {
    _id: string = '';
    name: string = '';
    icon: string = '';
}
export class NACP_SPECIAL_ASSET {
    _id?: string;
    access_type: string = '';
    category?: NACP_CATEGORY;
    isObtain: boolean = false;
    name: string = '';
    sort: number = 0;
    task_start_time: number = 0; // ms
    task_end_time: number = 0; // ms
    task_type: string = '';
    url?: string = '';
    thumb_url?: string = '';
    story_quiz?: Story;
}

export class USER_ASSET {
    address: string = '';
    asset: NACP_SPECIAL_ASSET = new NACP_SPECIAL_ASSET();
    used: boolean = false;
    is_holder: boolean = false;
}

export enum STORY_QUIZ_STATUS {
    NOT_START = 'not_start',
    IN_PROGRESS = 'in_progress',
    OVER = 'over'
}

export class NacpPhase {
    name: string = "";
    _id: string = "";
    start_date: number = 0;
    end_date: number = 0;
    sort: number = 0;
    status: number = 0; // 0 未开始 1 进行中 2 已结束
    categories: NacpCategory[] = [];
}

export class NacpCategory {
    name: string = "";
    _id: string = "";
    excludes?: NacpCategory[];
    level: number = 0;
    headwear_back_level: number = 0; // 如果是 headwear ,back的层级
    eyewear_back_level: number = 0; // 如果是 eyewear ,back的层级
    sort: number = 0;
    selected?: NacpAsset;
    eyewear_as_mask_excludes?: NacpCategory[];
    as_mask_level: number = 0;
    excludes_eyewear_as_mask?: boolean = false;
    status?: number = 0; // 0 未开始 1 进行中 2 已结束
    asset?: NacpAsset;
    assets: NacpAsset[] = [];
}

export class NacpAsset {
    _id: string = "";
    name: string = "";
    thumb_url: string = "";
    url: string = "";
    is_mask_only?: boolean;
    is_headwear_back?: boolean;
    is_eyewear_back?: boolean;
    excludes?: NacpAsset[];
    sort?: number = 0;
    level?: number = 0;
    description?: string = "";
    is_collection?: boolean = false;
    show_collection?: boolean = false;
    collection_selected?: NacpAsset;
    is_collection_child?: boolean = false;
    includes?: NacpAsset[];
    category?: NacpCategory;
    eyewear_as_mask?: boolean = false;
    category_name?: string;
    ape_id?: number;
    is_equip?: boolean = false;
    skin_color?: string;
    can_use: boolean = false;
    access_type?: string = '';
}

export class MetadataAttribute {
    asset_id?: string;
}
export class UpdateMetadataForm {
    tokenId: number = 0;
    url: string = '';
    thumb_url: string = '';
    attributes: MetadataAttribute[] = [];
}

export class NacpMetadataAttribute {
    trait_type: string = '';
    value: string = '';
    is_special: boolean = false;
    asset_id: string = '';
    asset_url: string = '';
    asset_url_thumb: string = '';
    skin_color: string = '';
}
export class NacpMetadata {
    id: number = 0;
    name: string = '';
    image: string = '';
    description: string = '';
    external_url?: string;
    animation_url?: string;
    attributes: NacpMetadataAttribute[] = [];
    categories?: NacpCategory[] = [];
}
