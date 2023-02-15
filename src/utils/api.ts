import { OutPoint, Output } from '@ckb-lumos/lumos';
import { Address } from '@lay2/pw-core';

import { fetch } from './fetch';
import { CONFIG } from './config';
import { NFT } from './nft';

export type CkbIndexerCell = {
    block_number: string;
    out_point: OutPoint;
    output: Output;
    output_data: string;
    tx_index: string;
};

export async function getNFTsAtAddress(address: Address) {
    const addressLockScript = address.toLockScript().serializeJson();
    const response = await fetch(CONFIG.CKB_INDEXER_RPC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: 2,
            jsonrpc: '2.0',
            method: 'get_cells',
            params: [
                {
                    script: addressLockScript,
                    script_type: 'lock',
                    filter: {
                        script: {
                            code_hash: CONFIG.MNFT_TYPE_CODE_HASH,
                            hash_type: 'type',
                            args: `0x${CONFIG.NERVAPE_MNFT_ISSUER_ID}`
                        }
                    }
                },
                'asc',
                '0x3e8'
            ]
        })
    });
    const result = await response.json();

    return (result.result.objects as CkbIndexerCell[])
        .filter(o => o.output.type?.code_hash === CONFIG.MNFT_TYPE_CODE_HASH)
        .filter(o => {
            const classId = o.output.type?.args?.substr(42, 8);
            const issuerId = o.output.type?.args?.substr(0, 42);
            return (
                classId &&
                issuerId &&
                parseInt(classId, 16) < 0xc &&
                issuerId === `0x${CONFIG.NERVAPE_MNFT_ISSUER_ID}`
            );
        })
        .map(o => {
            if (!o.output.type) {
                throw new Error('NFT has missing Type Script arguments.');
            }

            return new NFT(o.out_point, o.output_data, o.output.type?.args);
        });
}

export async function getHistories(address: string) {
    const response = await fetch(`${CONFIG.BRIDGE_API_HOST}/transaction/histories/${address}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    const result = await response.json();
    return result;
}

export async function getUnipassHistories(address: string) {
    const response = await fetch(`${CONFIG.BRIDGE_API_HOST}/bridge/histories/${address}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    const result = await response.json();
    return result;
}

export async function getUnipassCkbHistories(address: string) {
    const response = await fetch(`${CONFIG.BRIDGE_API_HOST}/transaction/ckb/histories/${address}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    const result = await response.json();
    return result;
}

export async function insertHistories(from: string, to: string, txHash: string, tokenId: number) {
    await fetch(`${CONFIG.BRIDGE_API_HOST}/transaction/histories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            from,
            to,
            txHash,
            tokenId
        })
    });
}

export async function insertTransferCkbHistory(
    from: string,
    to: string,
    amount: string,
    txHash?: string
) {
    await fetch(`${CONFIG.BRIDGE_API_HOST}/transaction/ckb/histories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            from,
            to,
            txHash,
            amount
        })
    });
}

export async function getNFTNameCoverImg() {
    const response = await fetch(`${CONFIG.BRIDGE_API_HOST}/nft/nameCoverImageUrl`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    const result = await response.json();
    return result;
}

export async function getBridgeTokensUsed() {
    const response = await fetch(`${CONFIG.BRIDGE_API_HOST}/bridge/tokens/used`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    const result = await response.json();
    return result;
}

export async function getAllHoldPoaps(address: string) {
    const response = await fetch(`${CONFIG.POAP_API_URL}${address}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    const result = await response.json();
    return result;
}

export async function getPublishedPoaps() {
    const response = await fetch(`${CONFIG.BRIDGE_API_HOST}/campaign/poap_badges/all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    const result = await response.json();
    return result;
}

export async function queryOatPoaps(address: string, campaignId: string) {
    const response = await fetch(
        `${CONFIG.BRIDGE_API_HOST}/campaign/poap_badges/oat/${address}/${campaignId}`,
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }
    );

    const result = await response.json();
    return result.data;
}
