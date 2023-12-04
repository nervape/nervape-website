import { serializeScript } from '@nervosnetwork/ckb-sdk-utils';
import { helpers } from '@ckb-lumos/lumos';

export const cotaId = "0xb4f2b7a80b382c07f62e4b78e38e21abcad4da30";

export default async function JoyIdNfts(address: string) {
    const { code_hash, hash_type, args } = helpers.addressToScript(address);
    const rawLockScript = serializeScript({
        codeHash: code_hash,
        hashType: hash_type,
        args
    });
    // cotaId of Halve Ape Blast Canvas 
    const payload = {
        "id": 1,
        "jsonrpc": "2.0",
        "method": "get_withdrawal_cota_nft",
        "params": {
            "lock_script": rawLockScript,
            "cota_id": cotaId,
            "page": "0",
            "page_size": "10"
        }
    }

    const response = await fetch("https://cota.nervina.dev/mainnet-aggregator", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const result = await response.json();
    console.log(result);

    return result.result;
}
