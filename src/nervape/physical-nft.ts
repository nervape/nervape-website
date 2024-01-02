export class Physical_NFT {
    image: string = '';
    name: string = '';
    description: string = '';
    token_index: number = 0;
    status?: ClaimStatus;
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
