export class Physical_NFT {
    image: string = '';
    name: string = '';
    description: string = '';
    token_index: number = 0;
    id: number = 0;
    status?: ClaimStatus;
    cover_image?: string;
    total?: number;
    path_name?: string;
    class_id?: number;
    category?: string;
    form?: string;
    material?: string;
    date_produced?: string;
    dimensions?: string;
    banner?: string;
}

export class Physical_Code {
    code: string = '';
    token_id: number = 0;
    nft?: Physical_NFT;
}

export enum ClaimStatus {
    PENDING = 'PENDING',
    MINTING = 'MINTING',
    MINTED = 'MINTED',
    FAILED = 'FAILED',
}

export class AboutQuestion {
    q: string = '';
    a: string = '';
}

export class PhysicalNFTGridImage {
    images: string[] = [];
    cover_image: string = '';
    token_id: number = 0;
    uploader: string = '';
    country: string = '';
    city: string = '';
    lat: number = 0;
    lng: number = 0;
    nft?: Physical_NFT;
    recommends?: Physical_NFT[];
}
