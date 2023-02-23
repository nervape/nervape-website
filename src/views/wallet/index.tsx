import React, { useContext, useEffect, useRef, useState } from 'react';
import './index.less';
import { Amount } from '@lay2/pw-core';
import { useAccount, useNetwork } from 'wagmi';
import { UnipassV3Wrapper } from '../../utils/UnipassV3Wrapper';
import Account from '../components/account/account';
import History from '../components/history/history';
import Footer from '../components/footer';
import { DataContext, scrollToTop } from '../../utils/utils';
import PoapBadge from '../components/poap-badge/poap-badge';
import NFT_CONTENT, { TransferSuccess } from '../components/nft/nft';
import {
    clearStorage,
    getStorage,
    LoginWalletType,
    setStorage,
    WALLET_CONNECT
} from '../../utils/Wallet';

import { PoapItem, PoapWrapper } from '../../utils/poap';
import { getNFTNameCoverImg, getPublishedPoaps, insertTransferCkbHistory } from '../../utils/api';
import SwitchChain from '../components/switchChain';
import { CONFIG } from '../../utils/config';
import { NFT } from '../../utils/nft-utils';
import TransferCkb from '../components/transfer';
import { useUnipassBalance } from '../../hooks/useUnipassBalance';
import ChainInfo from '../components/switchChain/chain-info';
import { Types } from '../../utils/reducers';

export default function WallectPage() {
    const { dispatch } = useContext(DataContext);

    const [layerOneWrapper, setLayerOneWrapper] = useState<UnipassV3Wrapper>();

    const [switchChain, setSwitchChain] = useState(false);
    const [showChainInfo, setShowChainInfo] = useState(false);

    const { address } = useAccount();
    const { chain } = useNetwork();

    // 当前链接钱包的地址
    const [currentAddress, setCurrentAddress] = useState<string>('');
    // 当前链接的钱包
    const [loginWalletType, setLoginWalletType] = useState<LoginWalletType>();

    const [nftCoverImages, setNftCoverImages] = useState<NFT[]>([]);
    const historyRef = useRef();

    // UNIPASS V3 钱包 Balance
    const [balance, setBalance] = useState('0.0');

    const setLoading = (flag: boolean) => {
        dispatch({
            type: flag ? Types.ShowLoading : Types.HideLoading
        })
    }
    const [showTransfer, setShowTransfer] = useState(false);
    const [showTransferSuccess, setShowTransferSuccess] = useState(false);

    // 是否展示徽章
    const [showPoapBadge, setShowPoapBadge] = useState(true);
    const [badges, setBadges] = useState<PoapItem[]>([]);

    async function getPoaps(_address: string) {
        (async () => {
            const res = await getPublishedPoaps();
            const poapWrapper = new PoapWrapper();
            poapWrapper.address = _address;
            const _badges = await poapWrapper.poaps(res.data);
            setBadges(_badges);
        })();
    }
    // update unipass ckb balance
    useUnipassBalance(updateUnipassCkbBalance, 10000);

    async function updateUnipassCkbBalance() {
        if (loginWalletType !== LoginWalletType.UNIPASS_V3 || !layerOneWrapper) return;
        await layerOneWrapper.getBalance();
        setBalance(layerOneWrapper.myBalance);
    }

    async function initLogin() {
        const _storage = getStorage();
        if (!_storage) {
            return;
        }
        if (currentAddress) return;
        const _storageJson: WALLET_CONNECT = JSON.parse(_storage);
        if (_storageJson?.expiredAt && new Date().getTime() <= _storageJson?.expiredAt) {
            setLoginWalletType(_storageJson.type);
            if (_storageJson.type === LoginWalletType.UNIPASS_V3) {
                setCurrentAddress(_storageJson.address || '');
                const wrapper = new UnipassV3Wrapper();
                wrapper.username = _storageJson.username || '';
                wrapper.layerOneAddress = _storageJson.layerOneAddress;
                setLayerOneWrapper(wrapper);
                await wrapper.init();
                await wrapper.getBalance();
                setBalance(wrapper.myBalance);
            }
        } else {
            clearStorage();
        }
    }

    async function fnNFTNameCoverImg() {
        const res = await getNFTNameCoverImg();
        setNftCoverImages(res.data);
    }

    useEffect(() => {
        if (!currentAddress) return;
        if (nftCoverImages.length) return;
        // 后台读取 NFTS 查找对应 CoverImage
        fnNFTNameCoverImg();
    }, [currentAddress]);

    useEffect(() => {
        initLogin();
    }, []);

    useEffect(() => {
        if (loginWalletType === LoginWalletType.WALLET_CONNECT) {
            if (!chain || ![CONFIG.GODWOKEN_CHAIN_ID, CONFIG.ETHEREUM_CHAIN_ID].includes(chain.id)) {
                setSwitchChain(true);
            } else {
                setSwitchChain(false);
                setShowChainInfo(false);
                document.body.style.overflow = 'auto';
            }
        }
    }, [chain, loginWalletType]);

    useEffect(() => {
        if (!address || !chain) return;
        setCurrentAddress(address);
        setLoginWalletType(LoginWalletType.WALLET_CONNECT);
        setStorage({
            type: LoginWalletType.WALLET_CONNECT,
            address,
            username: ''
        });
    }, [address, loginWalletType, chain]);

    useEffect(() => {
        if (loginWalletType === LoginWalletType.UNIPASS_V3) return;
        if (!currentAddress) return;
        document.body.style.overflow = 'auto';
        getPoaps(currentAddress);
    }, [loginWalletType, currentAddress]);

    const doTransferCKB = async (toAddress: string, amount: string) => {
        setLoading(true);
        try {
            const res = await layerOneWrapper?.transferCKB(toAddress, new Amount(amount));
            setShowTransferSuccess(true);
            await insertTransferCkbHistory(currentAddress, toAddress, amount, res);
            console.log(res);
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    return (
        <div className="wallet-page">
            {currentAddress && (
                <div className={`wallet-home-container show`}>
                    <SwitchChain
                        show={switchChain}
                        setSwitchChain={setSwitchChain}
                        setShowChainInfo={setShowChainInfo}
                    ></SwitchChain>
                    <div className="container">
                        {loginWalletType === LoginWalletType.UNIPASS_V3 && (
                            <Account
                                loginWalletType={loginWalletType || ''}
                                address={currentAddress}
                                balance={balance}
                                showTransfer={() => {
                                    setShowTransfer(true);
                                    document.body.style.overflow = 'hidden';
                                }}
                            ></Account>
                        )}

                        {showPoapBadge && loginWalletType !== LoginWalletType.UNIPASS_V3 && (
                            <PoapBadge badges={badges}></PoapBadge>
                        )}
                        <div className="tabs-container">
                            {/* <div className="tabs flex-center">
                                {tabs.map((tab, index) => (
                                    <div
                                        className={`tab ${selectTab === tab ? 'active' : ''}`}
                                        key={index}
                                        onClick={() => {
                                            setSelectTab(tab);
                                        }}
                                    >
                                        {tab}
                                    </div>
                                ))}
                            </div> */}
                            <div className="content">
                                <NFT_CONTENT
                                    setLoading={setLoading}
                                    nftCoverImages={nftCoverImages}
                                    loginWalletType={loginWalletType}
                                    address={currentAddress}
                                    setShowTransferSuccess={setShowTransferSuccess}
                                    balance={balance}
                                    switchChain={switchChain}
                                ></NFT_CONTENT>

                                <History
                                    ref={historyRef}
                                    setLoading={setLoading}
                                    loginWalletType={loginWalletType as LoginWalletType}
                                    nftCoverImages={nftCoverImages}
                                    address={currentAddress}
                                    updateBalance={updateUnipassCkbBalance}
                                ></History>
                            </div>
                        </div>
                    </div>
                    <Footer></Footer>
                </div>
            )}
            {/* <LoadingModal show={loading}></LoadingModal> */}
            <ChainInfo
                show={showChainInfo}
                close={() => {
                    setShowChainInfo(false);
                    document.body.style.overflow = 'auto';
                }}
            ></ChainInfo>
            <TransferCkb
                show={showTransfer}
                close={() => {
                    setShowTransfer(false);
                    document.body.style.overflow = 'auto';
                }}
                balance={balance}
                doTransferCKB={doTransferCKB}
            ></TransferCkb>
            <TransferSuccess
                show={showTransferSuccess}
                close={() => setShowTransferSuccess(false)}
                viewHistory={() => {
                    scrollToTop();
                    // if (selectTab === 'HISTORY') {
                    //     const current = historyRef.current as any;
                    //     current.fnGetUnipassHistories(currentAddress);
                    // }
                }}
            ></TransferSuccess>
        </div>
    );
}
