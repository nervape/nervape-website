import React, { useContext, useEffect, useRef, useState } from 'react';
import './index.less';
import { Amount } from '@lay2/pw-core';
import { mainnet, useNetwork } from 'wagmi';
import Account from '../components/account/account';
import History from '../components/history/history';
import Footer from '../components/footer';
import { DataContext } from '../../utils/utils';
import PoapBadge from '../components/poap-badge/poap-badge';
import NFT_CONTENT, { TransferSuccess } from '../components/nft/nft';
import { LoginWalletType } from '../../utils/Wallet';

import { PoapItem, PoapWrapper } from '../../utils/poap';
import { getNFTNameCoverImg, getPublishedPoaps, insertTransferCkbHistory } from '../../utils/api';
import SwitchChain from '../components/switchChain';
import { NFT } from '../../utils/nft-utils';
import TransferCkb from '../components/transfer';
import { useUnipassBalance } from '../../hooks/useUnipassBalance';
import ChainInfo from '../components/switchChain/chain-info';
import { Types } from '../../utils/reducers';
import { godWoken } from '../../utils/Chain';

export default function WallectPage() {
    const { state, dispatch } = useContext(DataContext);

    const [switchChain, setSwitchChain] = useState(false);
    const [showChainInfo, setShowChainInfo] = useState(false);

    const { chain } = useNetwork();

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
        if (state.loginWalletType !== LoginWalletType.UNIPASS_V3 || !state.layerOneWrapper) return;
        await state.layerOneWrapper.getBalance();
        setBalance(state.layerOneWrapper.myBalance);
    }

    async function fnNFTNameCoverImg() {
        const res = await getNFTNameCoverImg();
        setNftCoverImages(res.data);
    }

    useEffect(() => {
        if (!state.currentAddress) return;
        if (nftCoverImages.length) return;
        // 后台读取 NFTS 查找对应 CoverImage
        fnNFTNameCoverImg();
    }, [state.currentAddress]);

    useEffect(() => {
        updateUnipassCkbBalance();
    }, [state.layerOneWrapper]);

    useEffect(() => {
        console.log('chain', chain);
        if (state.loginWalletType === LoginWalletType.WALLET_CONNECT) {
            if (!chain || ![godWoken.id, mainnet.id].includes(chain.id)) {
                setSwitchChain(true);
            } else {
                setSwitchChain(false);
                setShowChainInfo(false);
                document.body.style.overflow = 'auto';
            }
        }
    }, [chain, state.loginWalletType]);

    useEffect(() => {
        if (!state.loginWalletType || !state.currentAddress) return;
        if (state.loginWalletType === LoginWalletType.UNIPASS_V3) return;
       
        document.body.style.overflow = 'auto';
        getPoaps(state.currentAddress);
    }, [state.loginWalletType, state.currentAddress]);

    const doTransferCKB = async (toAddress: string, amount: string) => {
        setLoading(true);
        try {
            const res = await state.layerOneWrapper?.transferCKB(toAddress, new Amount(amount));
            setShowTransferSuccess(true);
            await insertTransferCkbHistory(state.currentAddress, toAddress, amount, res);
            console.log(res);
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    return (
        <div className="wallet-page">
            {state.currentAddress && (
                <div className={`wallet-home-container show`}>
                    <SwitchChain
                        show={switchChain}
                        setSwitchChain={setSwitchChain}
                        setShowChainInfo={setShowChainInfo}
                    ></SwitchChain>
                    <div className="container">
                        {state.loginWalletType === LoginWalletType.UNIPASS_V3 && (
                            <Account
                                loginWalletType={state.loginWalletType || ''}
                                address={state.currentAddress}
                                balance={balance}
                                showTransfer={() => {
                                    setShowTransfer(true);
                                    document.body.style.overflow = 'hidden';
                                }}
                            ></Account>
                        )}

                        {showPoapBadge && state.loginWalletType === LoginWalletType.WALLET_CONNECT && (
                            <PoapBadge badges={badges}></PoapBadge>
                        )}
                        <div className="tabs-container">
                            <div className="content">
                                <NFT_CONTENT
                                    setLoading={setLoading}
                                    nftCoverImages={nftCoverImages}
                                    loginWalletType={state.loginWalletType}
                                    address={state.currentAddress}
                                    setShowTransferSuccess={setShowTransferSuccess}
                                    balance={balance}
                                ></NFT_CONTENT>

                                <History
                                    ref={historyRef}
                                    setLoading={setLoading}
                                    loginWalletType={state.loginWalletType as LoginWalletType}
                                    nftCoverImages={nftCoverImages}
                                    address={state.currentAddress}
                                    updateBalance={updateUnipassCkbBalance}
                                ></History>
                            </div>
                        </div>
                    </div>
                    <Footer></Footer>
                </div>
            )}
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
                    const current = historyRef.current as any;
                    if (state.loginWalletType === LoginWalletType.UNIPASS_V3) {
                        current.fnGetUnipassHistories(state.currentAddress);
                    } else {
                        current.fnGetHistories(state.currentAddress);
                    } 
                }}
            ></TransferSuccess>
        </div>
    );
}
