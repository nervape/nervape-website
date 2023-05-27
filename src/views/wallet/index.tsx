import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import './index.less';
import { Amount } from '@lay2/pw-core';
import { mainnet, useAccount, useNetwork } from 'wagmi';
import { DataContext, getWindowScrollTop, updateBodyOverflow } from '../../utils/utils';
import { TransferSuccess } from '../components/nft/nft';
import { LoginWalletType } from '../../utils/Wallet';

import { PoapItem, PoapWrapper } from '../../utils/poap';
import { getNFTNameCoverImg, getPublishedPoaps, insertTransferCkbHistory, queryOatPoaps } from '../../utils/api';
import SwitchChain from '../components/switchChain';
import { NFT } from '../../utils/nft-utils';
import TransferCkb from '../components/transfer';
import { useUnipassBalance } from '../../hooks/useUnipassBalance';
import ChainInfo from '../components/switchChain/chain-info';
import { Types } from '../../utils/reducers';
import { godWoken } from '../../utils/Chain';

import WalletNacp from "./nacp";
import { nervapeApi } from "../../api/nervape-api";
import WalletNFT3D from "./nft";
import WalletTx from "./tx";
import WalletBadge from "./badge";
import WalletEvent from "./event";
import { scrollToTop } from "../../utils/utils";
import WalletHeader from "./header";
import { useLocation } from "react-router";

import NacpIcon from "../../assets/wallet/navbar/nacp.svg";
import NftIcon from "../../assets/wallet/navbar/nft.svg";
import EventIcon from "../../assets/wallet/navbar/event.svg";
import BadgeIcon from "../../assets/wallet/navbar/badge.svg";
import TxIcon from "../../assets/wallet/navbar/tx.svg";

export class WalletNavBar {
    name: string = "";
    icon: string = "";
}

export enum WalletNavbarTypes {
    NACP = 'NACP',
    NFT = '3DNFT',
    EVENT = 'EVENT',
    BADGE = 'BADGE',
    TX = 'TX'
}

export default function WalletNewPage() {
    const { state, dispatch } = useContext(DataContext);
    const history = useLocation();

    const [switchChain, setSwitchChain] = useState(false);
    const [showChainInfo, setShowChainInfo] = useState(false);
    const [isFold, setIsFold] = useState(false);

    const { chain } = useNetwork();

    const [nftCoverImages, setNftCoverImages] = useState<NFT[]>([]);
    const historyRef = useRef();

    // UNIPASS V3 钱包 Balance
    const [balance, setBalance] = useState('0.0');

    const [navbars, setNavbars] = useState<WalletNavBar[]>([]);
    const [currNavbar, setCurrNavbar] = useState(0);
    const [isBonelist, setIsBonelist] = useState(false);

    const setLoading = (flag: boolean) => {
        dispatch({
            type: flag ? Types.ShowLoading : Types.HideLoading
        })
    }
    const [showTransfer, setShowTransfer] = useState(false);
    const [showTransferSuccess, setShowTransferSuccess] = useState(false);

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
        if (!navbars.length) return;
        console.log('history', history);
        const { hash } = history;
        if (!hash) setCurrNavbar(0)
        else setCurrNavbar(navbars.findIndex(n => '#' + n.name.toLocaleLowerCase() == hash));
    }, [history, navbars]);

    useEffect(() => {
        console.log('chain', chain);
        if (!chain) return;
        if (state.loginWalletType === LoginWalletType.WALLET_CONNECT) {
            if (![godWoken.id, mainnet.id].includes(chain.id)) {
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
        if (state.loginWalletType === LoginWalletType.UNIPASS_V3) {
            // 设置 navbars
            setNavbars([
                {
                    name: '3DNFT',
                    icon: NftIcon
                },
                {
                    name: 'TX',
                    icon: TxIcon
                }
            ]);
            return
        } else {
            // 设置 navbars
            setNavbars([
                {
                    name: 'NACP',
                    icon: NacpIcon
                },
                {
                    name: '3DNFT',
                    icon: NftIcon
                },
                {
                    name: 'EVENT',
                    icon: EventIcon
                },
                {
                    name: 'BADGE',
                    icon: BadgeIcon
                },
                {
                    name: 'TX',
                    icon: TxIcon
                }
            ]);
            // 查询是否持有 Nacp bonelist
            nervapeApi.fnSearchBonelist(state.currentAddress).then(res => {
                setIsBonelist(res > 0);
            });
        };

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

    const NavbarItems = () => {
        return (
            <div className="navbar-items">
                {navbars.map((navbar, index) => {
                    return (
                        <div key={index} className={`navbar-item flex-center cursor ${currNavbar == index && 'active'}`}>
                            <div className="navbar-icon" onClick={() => {
                                setCurrNavbar(index);
                                window.location.hash = navbars[index].name.toLocaleLowerCase();
                            }}>
                                <img className="icon" src={navbar.icon} alt="" />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    const fnFilter = useCallback(filterNfts(), []);

    function filterNfts() {
        let timer: any;
        let lastTop = 0;
        let canUpdate = true;
        return function () {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                const currTop = getWindowScrollTop();

                if (canUpdate) {
                    if (currTop - lastTop > 0 && currTop - lastTop < 100) {
                        if (currTop > 50) {
                            setIsFold(true);
                            canUpdate = false;
                            window.scrollTo({
                                top: lastTop
                            });

                            setTimeout(() => {
                                canUpdate = true;
                            }, 300);
                        }
                    } else if (currTop - lastTop < 0 && currTop - lastTop > -100) {
                        if (currTop <= 50) {
                            setIsFold(false);
                            canUpdate = false;
                            window.scrollTo({
                                top: lastTop
                            });

                            setTimeout(() => {
                                canUpdate = true;
                            }, 300);
                        }
                    }
                }

                lastTop = currTop;
            }, 0);
        }
    }

    function fnScrollPage() {
        fnFilter();
    }

    useEffect(() => {
        if (state.windowWidth > 375) {
            window.addEventListener('scroll', fnScrollPage, true);

            return () => window.removeEventListener('scroll', fnScrollPage, true);
        }
    });

    return (
        <div className="wallet-new-page">
            {state.currentAddress && (
                <div className={`wallet-home-container show`}>
                    <SwitchChain
                        show={switchChain}
                        setSwitchChain={setSwitchChain}
                        setShowChainInfo={setShowChainInfo}
                    ></SwitchChain>
                    <div className="container">
                        <WalletHeader
                            isFold={isFold}
                            isBonelist={isBonelist}
                            setShowTransfer={setShowTransfer}
                            balance={balance}></WalletHeader>

                        <section className={`wallet-section flex-align ${isFold && 'fold'}`}>
                            <div className="wallet-navbar-content transition">
                                <NavbarItems></NavbarItems>
                            </div>
                            <div className="wallet-content transition">
                                {/* <NavbarContent></NavbarContent> */}
                                {navbars[currNavbar]?.name == WalletNavbarTypes.NACP ? (
                                    <WalletNacp isFold={isFold} isBonelist={isBonelist} setLoading={setLoading}></WalletNacp>
                                ) : (
                                    navbars[currNavbar]?.name == WalletNavbarTypes.NFT ? (
                                        <WalletNFT3D
                                            isFold={isFold}
                                            nftCoverImages={nftCoverImages}
                                            setLoading={setLoading}
                                            setShowTransferSuccess={setShowTransferSuccess}></WalletNFT3D>
                                    ) : (
                                        navbars[currNavbar]?.name == WalletNavbarTypes.TX ? (
                                            <WalletTx
                                                isFold={isFold}
                                                nftCoverImages={nftCoverImages}
                                                setLoading={setLoading}
                                                updateBalance={updateUnipassCkbBalance}></WalletTx>
                                        ) : (
                                            navbars[currNavbar]?.name == WalletNavbarTypes.BADGE ? (
                                                <WalletBadge isFold={isFold} badges={badges} setLoading={setLoading}></WalletBadge>
                                            ) : (
                                                navbars[currNavbar]?.name == WalletNavbarTypes.EVENT ? (
                                                    <WalletEvent isFold={isFold} setLoading={setLoading}></WalletEvent>
                                                ) : (
                                                    <></>
                                                )
                                            )
                                        )
                                    )
                                )}
                            </div>
                        </section>
                    </div>
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
