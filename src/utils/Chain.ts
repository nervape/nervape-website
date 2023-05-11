import { Chain } from 'wagmi';

export const godWoken: Chain = {
    id: 71402,
    name: 'Godwoken',
    network: 'Godwoken',
    nativeCurrency: {
        decimals: 18,
        name: 'Godwoken Mainnet',
        symbol: 'pCKB'
    },
    rpcUrls: {
        public: {
            http: [''],
            webSocket: ['']
        },
        default: { http: ['https://v1.mainnet.godwoken.io/rpc'] }
    },
    blockExplorers: {
        etherscan: { name: 'GwScan', url: 'https://v1.gwscan.com' },
        default: { name: 'GwScan', url: 'https://v1.gwscan.com' }
    },
    contracts: {
        multicall3: {
            address: '0xAa055dBC759F416DC6f2A1F792248EE90Bc370c2',
            blockCreated: 193654
        }
    }
};

export const godWokenTestnet: Chain = {
    id: 71401,
    name: 'GodwokenTestnet',
    network: 'GodwokenTestnet',
    nativeCurrency: {
        decimals: 18,
        name: 'Godwoken Testnet',
        symbol: 'pCKB'
    },
    rpcUrls: {
        public: {
            http: [''],
            webSocket: ['']
        },
        default: { http: ['https://godwoken-testnet-v1.ckbapp.dev'] }
    },
    blockExplorers: {
        etherscan: { name: 'GwScan', url: 'https://v1.testnet.gwscan.com' },
        default: { name: 'GwScan', url: 'https://v1.testnet.gwscan.com' }
    }
};
