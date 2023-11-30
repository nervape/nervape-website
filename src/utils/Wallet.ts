import { Address } from '@lay2/pw-core';
import { CONFIG } from './config';
import UnipassIcon from '../assets/images/icons/unipass.svg';
import WalletConnectIcon from '../assets/images/icons/walletconnect.svg';
import MetamaskIcon from '../assets/images/icons/metamask.svg';
import CoinbaseIcon from '../assets/images/icons/coinbase.svg';
import JOYIDIcon from '../assets/images/icons/joyid.svg';

export enum LoginWalletType {
    UNIPASS_V3 = 'UNIPASS_V3',
    METAMASK = 'METAMASK',
    WALLET_CONNECT = 'WALLETCONNECT',
    JOYID = 'JOYID'
}

export type WALLET_CONNECT = {
    type: LoginWalletType;
    address?: string;
    layerOneAddress?: Address;
    username?: string;
    expiredAt?: number;
};

export const IconMap = new Map<string, string>();
IconMap.set('Unipass', UnipassIcon);
IconMap.set('WalletConnect', WalletConnectIcon);
IconMap.set('MetaMask', MetamaskIcon);
IconMap.set('Coinbase Wallet', CoinbaseIcon);
IconMap.set('JOYID', JOYIDIcon);

const WalletStorageKey = 'Wallet_Connect_Info';
const WalletLoginTypeKey = 'Wallet_Connect_Type';

export function getStorage() {
    return localStorage.getItem(WalletStorageKey);
}

export function setStorage(info: WALLET_CONNECT) {
    const _info: WALLET_CONNECT = { ...info, expiredAt: new Date().getTime() + 30 * 60 * 1000 };
    localStorage.setItem(WalletStorageKey, JSON.stringify(_info));
}

export function clearStorage() {
    localStorage.removeItem(WalletStorageKey);
}

export function getLoginType() {
    return localStorage.getItem(WalletLoginTypeKey);
}

export function setLoginType(type: string) {
    localStorage.setItem(WalletLoginTypeKey, type);
}

export function clearLoginType() {
    localStorage.removeItem(WalletLoginTypeKey);
}

export function getWallectConnect() {
    return localStorage.getItem('walletconnect');
}

// eslint-disable-next-line consistent-return
export async function switchWalletNetwork() {
    if (window.ethereum.networkVersion !== CONFIG.GODWOKEN_CHAIN_ID) {
        try {
            await window?.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x116ea' }]
            });
        } catch (err: any) {
            if (err.code === 4902) {
                await window?.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainName: 'Godwoken Mainnet v1',
                            chainId: '0x116ea',
                            nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
                            rpcUrls: ['https://v1.mainnet.godwoken.io/rpc']
                        }
                    ]
                });
            } else if (err.code === 4001) {
                return 4001;
            }
        }
    }
}
