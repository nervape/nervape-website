import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import './index.less';
import { Amount } from '@lay2/pw-core';
import { goerli, mainnet, useNetwork, useSignMessage } from 'wagmi';
import { DataContext, getWindowScrollTop, ownerOf, showErrorNotification } from '../../utils/utils';
import { TransferSuccess } from '../components/nft/nft';
import { LoginWalletType, WALLET_FRONT_TOKEN } from '../../utils/Wallet';

import { PoapItem, PoapWrapper } from '../../utils/poap';
import { getNFTNameCoverImg, getPublishedPoaps, insertTransferCkbHistory } from '../../utils/api';
import SwitchChain from '../components/switchChain';
import { NFT } from '../../utils/nft-utils';
import TransferCkb from '../components/transfer';
import { useUnipassBalance } from '../../hooks/useUnipassBalance';
import ChainInfo from '../components/switchChain/chain-info';
import { Types } from '../../utils/reducers';

import WalletNacp from "./nacp";
import { nervapeApi } from "../../api/nervape-api";
import WalletNFT3D from "./nft";
import WalletTx from "./tx";
import WalletBadge from "./badge";
import WalletEvent from "./event";
import WalletHeader from "./header";
import { useLocation } from "react-router";

import NacpIcon from "../../assets/wallet/navbar/nacp.svg";
import NftIcon from "../../assets/wallet/navbar/nft.svg";
import EventIcon from "../../assets/wallet/navbar/event.svg";
import BadgeIcon from "../../assets/wallet/navbar/badge.svg";
import TxIcon from "../../assets/wallet/navbar/tx.svg";
import InvitationClaim from "./invitation";
import { CONFIG } from "../../utils/config";
import { SiweMessage } from "siwe";

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

    const [showChainInfo, setShowChainInfo] = useState(false);
    const [isFold, setIsFold] = useState(false);
    const [inviteClaim, setInviteClaim] = useState(false);

    const { chain } = useNetwork();

    const [nftCoverImages, setNftCoverImages] = useState<NFT[]>([]);
    const historyRef = useRef();

    // UNIPASS V3 钱包 Balance
    const [balance, setBalance] = useState('0.0');
    const [userProfile, setUserProfile] = useState(null);

    const [navbars, setNavbars] = useState<WalletNavBar[]>([]);
    const [currNavbar, setCurrNavbar] = useState(-1);
    const [isBonelist, setIsBonelist] = useState(false);

    const setLoading = (flag: boolean, focus: boolean = false) => {
        dispatch({
            type: flag ? Types.ShowLoading : Types.HideLoading,
            value: focus
        })
    }

    const setSwitchChain = (flag: boolean) => {
        const _extra_padding = flag ? (state.windowWidth > 750 ? '60px' : '64px') : '0px'
        document.body.style.setProperty('--extra-padding', _extra_padding);

        dispatch({
            type: Types.SwitchChain,
            value: flag
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

    async function fnCheckAddressLogin() {
        let frontAccessToken: WALLET_FRONT_TOKEN = localStorage.getItem('front-token') ? JSON.parse(localStorage.getItem('front-token') || '') : {};

        const now = new Date().getTime();

        if (frontAccessToken.address && frontAccessToken.address == state.currentAddress && now < frontAccessToken.expiresIn) {
            fnGetUserProfile();
        } else {
            localStorage.removeItem('front-token');

            signInWithEthereum();
        }
    }

    const domain = window.location.host;
    const origin = window.location.origin;

    const { signMessageAsync, error } = useSignMessage();
    
    const createSiweMessage = async (_address: string, statement: string) => {
        const res = await nervapeApi.fnFrontLoginNonce();

        const message = new SiweMessage({
            domain,
            address: _address,
            statement,
            uri: origin,
            version: '1',
            chainId: mainnet.id,
            nonce: res.nonce
        });

        return {
            message: message.prepareMessage(),
        };
    }

    const signInWithEthereum = async () => {
        setLoading(true);

        try {
            const { message } = await createSiweMessage(state.currentAddress, 'Sign in to Login Nervape.');

            const signature = await signMessageAsync({ message });
            const res = await nervapeApi.fnFrontLoginVerify(message, signature, state.currentAddress);
            console.log('signInWithEthereum', res);
            localStorage.setItem('front-token', JSON.stringify({
                address: state.currentAddress,
                access_token: res.data.access_token,
                expiresIn: new Date().getTime() + res.data.expiresIn * 1000
            }));
            setLoading(false, true);
            fnGetUserProfile();
        } catch (err: any) {
            console.log(err);

            showErrorNotification({
                message: 'Request Error',
                description: err.message
            });
            setLoading(false);

            signInWithEthereum();
        }
    }
    
    useEffect(() => {
        if (!state.currentAddress) return;
        if (nftCoverImages.length) return;
        // 后台读取 NFTS 查找对应 CoverImage
        fnNFTNameCoverImg();
    }, [state.currentAddress]);

    // useEffect(() => {
    //     if (!state.currentAddress) return;
    //     fnGetUserProfile();
    // }, [state.currentAddress]);

    useEffect(() => {
        updateUnipassCkbBalance();
    }, [state.layerOneWrapper]);

    useEffect(() => {
        if (!navbars.length) return;
        const { hash } = history;
        if (!hash) {
            setCurrNavbar(0);
        } else {
            const index = navbars.findIndex(n => '#' + n.name.toLocaleLowerCase() == hash);
            setCurrNavbar(index != -1 ? index : 0);
        }

    }, [history, navbars]);

    useEffect(() => {
        if (!chain) return;
        if (state.loginWalletType === LoginWalletType.WALLET_CONNECT) {
            if (!CONFIG.WALLET_ALLOW_CHAINS.includes(chain.id)) {
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
            searchBonelist();
        };

        document.body.style.overflow = 'auto';
        getPoaps(state.currentAddress);
        // 检查是否登录
        setTimeout(() => {
            fnCheckAddressLogin();
        }, 500);
    }, [state.loginWalletType, state.currentAddress]);

    const searchBonelist = () => {
        nervapeApi.fnSearchBonelist(state.currentAddress).then(res => {
            setIsBonelist(res > 0);
        });
    }

    const doTransferCKB = async (toAddress: string, amount: string) => {
        setLoading(true);
        try {
            const res = await state.layerOneWrapper?.transferCKB(toAddress, new Amount(amount));
            setShowTransferSuccess(true);
            await insertTransferCkbHistory(state.currentAddress, toAddress, amount, res);
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    // 获取用户设置的头像
    async function fnGetUserProfile() {
        const res = await nervapeApi.fnGetUserProfile(state.currentAddress);

        setLoading(false);
        if (res && res.nacp) {
            // 验证 tokenId 的持有者
            if (await ownerOf(res.nacp, state.currentAddress)) {
                const _nacp = await nervapeApi.fnGetMetadataByTokenId(res.nacp);
                setUserProfile(_nacp.data);
            } else {
                // 删除绑定关系
                nervapeApi.fnDeleteUserProfile(state.currentAddress, res.nacp);
                setUserProfile(null);
            }
        } else {
            setUserProfile(null);
        }
    }

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
        if (state.windowWidth > 750) {
            window.addEventListener('scroll', fnScrollPage, true);

            return () => window.removeEventListener('scroll', fnScrollPage, true);
        }
    });

    useEffect(() => {
        if (currNavbar > -1 && navbars.length && navbars[currNavbar]?.name == WalletNavbarTypes.NACP) {
            if (chain && chain.id == goerli.id) {
                setLoading(true);
            }
        }
    }, [currNavbar, navbars]);

    return (
        <div className="wallet-new-page">
            {state.currentAddress && (
                <div className={`wallet-home-container transition show`} style={{ paddingTop: state.switchChain ? '0' : '64px' }}>
                    <SwitchChain
                        show={state.switchChain}
                        setSwitchChain={setSwitchChain}
                        setShowChainInfo={setShowChainInfo}
                    ></SwitchChain>
                    <div className="container">
                        <WalletHeader
                            isFold={isFold}
                            setInviteClaim={setInviteClaim}
                            isBonelist={isBonelist}
                            setShowTransfer={setShowTransfer}
                            userProfile={userProfile}
                            balance={balance}></WalletHeader>

                        <section className={`wallet-section flex-align ${isFold && 'fold'}`}>
                            {state.windowWidth > 750 && (
                                <div className="wallet-navbar-content transition">
                                    <NavbarItems></NavbarItems>
                                </div>
                            )}
                            <div className="wallet-content transition">
                                {/* <NavbarContent></NavbarContent> */}
                                {navbars[currNavbar]?.name == WalletNavbarTypes.NACP ? (
                                    <WalletNacp
                                        isFold={isFold}
                                        isBonelist={isBonelist}
                                        fnGetUserProfile={fnGetUserProfile}
                                        userProfile={userProfile}
                                        setLoading={setLoading}></WalletNacp>
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
                            {state.windowWidth <= 750 && (
                                <div className="wallet-navbar-content transition">
                                    <NavbarItems></NavbarItems>
                                </div>
                            )}
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
            <InvitationClaim
                show={inviteClaim}
                setLoading={setLoading}
                isBonelist={isBonelist}
                setInviteClaim={setInviteClaim}
                searchBonelist={searchBonelist}
            ></InvitationClaim>
        </div>
    );
}

