import { CONFIG } from '../utils/config';

export const contracts = {
    multicall: {
        71402: '0xAa055dBC759F416DC6f2A1F792248EE90Bc370c2', // mainnet
        71401: '', // testnet
        1: '0xcA11bde05977b3631167028862bE2a173976CA11',
        5: '0xcA11bde05977b3631167028862bE2a173976CA11'
    },
    character: {
        71402: CONFIG.L2_CHARACTER_ADDRESS, // mainnet
        71401: '' // testnet
    },
    scene: {
        71402: CONFIG.L2_SCENE_ADDRESS, // mainnet
        71401: '' // testnet
    },
    item: {
        71402: CONFIG.L2_ITEM_ADDRESS, // mainnet
        71401: '' // testnet
    },
    special: {
        71402: CONFIG.L2_SPECIAL_ADDRESS, // mainnet
        71401: '' // testnet
    },
    physicalNft: {
        1: CONFIG.PHYSICAL_NFT_ADDRESS,
        5: CONFIG.PHYSICAL_NFT_ADDRESS
    }
};

export const RPC = {
    71401: 'https://godwoken-testnet-v1.ckbapp.dev',
    71402: 'https://v1.mainnet.godwoken.io/rpc',
    1: 'https://cloudflare-eth.com',
    5: 'https://eth-goerli.g.alchemy.com/v2/izqT_CrJZvv9s79j4aCC4xBLE6qMuhG7'
};

export const DEFAULT_CHAIN_ID = 71402;
// eslint-disable-next-line radix
export const CHAIN_ID = CONFIG.GODWOKEN_CHAIN_ID ? CONFIG.GODWOKEN_CHAIN_ID : DEFAULT_CHAIN_ID;

export const POAP_CONTRACT = '0x22C1f6050E56d2876009903609a2cC3fEf83B415';
export const POAP_RPC_URL = 'https://rpc.ankr.com/gnosis';

// example: https://frontend.poap.tech/actions/scan/{address}
export const POAP_API_URL = 'https://frontend.poap.tech/actions/scan/';
export const POAP_EVENT_IDS = [77390, 74399, 66315, 65433];

// export const POAP_EVENTS = [
//     {
//         eventId: 77390,
//         name: "Nervape Wonder",
//         image: "https://assets.poap.xyz/nervape-wonder-ape-2022-logo-1666196575796.png"
//     },
//     {
//         eventId: 74399,
//         name: "Nervape Mail3",
//         image: "https://assets.poap.xyz/nervape-mail3-apr-2022-logo-1665454438676.png"
//     },
//     {
//         eventId: 66315,
//         name: "Nervape DotBit",
//         image: "https://assets.poap.xyz/nervape-dotbit-ape-2022-logo-1663698864614.png"
//     },
//     {
//         eventId: 65433,
//         name: "Nervape Genesis Ape",
//         image: "https://assets.poap.xyz/genesis-ape-2022-logo-1663258417045.png"
//     }
// ]

export function getAddress(address: keyof typeof contracts, chainId?: number) {
    return address[chainId || CHAIN_ID];
}
