import { LoginWalletType } from "../utils/Wallet";

export class ConnectWay {
    name: string = '';
    chain: WalletChain = WalletChain.BTC;
    color: string = "";
    wallets: Wallet[] = [];
}

export class Wallet {
    name: string = "";
    type: LoginWalletType = LoginWalletType.JOYID;
    logo: string | undefined = "";
}

export enum WalletChain {
    BTC = 'BTC',
    CKB = 'CKB',
    Godwoken = 'Godwoken / Ethereum'
}
