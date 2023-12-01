import { serializeScript } from '@nervosnetwork/ckb-sdk-utils';
import { helpers } from '@ckb-lumos/lumos';
import axios from "axios";

export default async function JoyIdNfts(address: string) {
    const script = helpers.addressToScript(address);
    const rawLockScript = serializeScript(script as any);
    const cotaId = "0xb4f2b7a80b382c07f62e4b78e38e21abcad4da30";
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
}
