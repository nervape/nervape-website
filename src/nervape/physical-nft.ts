export class Physical_NFT {
    image: string = '';
    name: string = '';
    description: string = '';
    token_index: number = 0;
}

export class Physical_Code {
    code: string = '';
    token_id: number = 0;
    nft?: Physical_NFT;
}
