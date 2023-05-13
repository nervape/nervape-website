import React, { useContext, useEffect, useRef, useState } from "react";
import './new.less';
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

import DefaultAvatar from '../../assets/wallet/default_avatar.svg';
import NervosLogo from '../../assets/logo/nervos_logo.svg';
import GodwokenLogo from '../../assets/logo/godwoken_logo.svg';
import EthLogo from '../../assets/logo/etherum.svg';
import InfoIcon from '../../assets/icons/info_icon.svg';
import WalletNacp from "./nacp";
import { nervapeApi } from "../../api/nervape-api";

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

    const [switchChain, setSwitchChain] = useState(false);
    const [showChainInfo, setShowChainInfo] = useState(false);

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
            return
        } else {
            // 设置 navbars
            setNavbars([
                {
                    name: 'NACP',
                    icon: ''
                },
                {
                    name: '3DNFT',
                    icon: ''
                },
                {
                    name: 'EVENT',
                    icon: ''
                },
                {
                    name: 'BADGE',
                    icon: ''
                },
                {
                    name: 'TX',
                    icon: ''
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

    const walletIcon = () => {
        if (state.loginWalletType === LoginWalletType.UNIPASS_V3) return NervosLogo;
        // 检查是否支持当前网络
        if (!chain || ![godWoken.id, mainnet.id].includes(chain.id)) {
            return InfoIcon;
        }
        return chain.id === godWoken.id ? GodwokenLogo : EthLogo;
    };

    const NavbarItems = () => {
        return (
            <div className="navbar-items">
                {navbars.map((navbar, index) => {
                    return (
                        <div className={`navbar-item flex-center cursor ${currNavbar == index && 'active'}`}>
                            <div className="navbar-icon" onClick={() => {
                                setCurrNavbar(index);
                            }}>{navbar.name}</div>
                        </div>
                    );
                })}
            </div>
        );
    }

    const NavbarContent = () => {
        if (!navbars.length) return <></>;
        switch(navbars[currNavbar].name) {
            case WalletNavbarTypes.NACP:
                return <WalletNacp isBonelist={isBonelist}></WalletNacp>;
            default: return <></>;
        }
    }

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

                        <section className="user-center-content flex-align">
                            <div className="user-avatar">
                                <img src={DefaultAvatar} alt="UserAvatar" />
                            </div>
                            <div className="user-info">
                                <div className="user-address flex-align">
                                    <div className={`address flex-align cursor`}>
                                        <img src={walletIcon()} alt="UnipassIcon" />
                                        <div className="span">{state.formatAddress}</div>
                                    </div>
                                </div>

                                <div className="bone-list-points flex-align">
                                    <div className="bone-item bone-list">
                                        <div className="title">BONE LIST</div>
                                        <div className={`nacp ${isBonelist && 'holder'}`}>NACP</div>
                                        <div className="nft-3d">3D NFT</div>
                                    </div>
                                    <div className="bone-item bone-points">
                                        <div className="title flex-align">
                                            BONE POINTS
                                            {/* <div className="record cursor">Record</div> */}
                                        </div>
                                        {/* <div className="points">1,000,000</div>
                                        <div className="daily-add">+1,000,000 daily</div> */}
                                        <div className="coming-soon">COMING SOON</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="wallet-section flex-align">
                            <div className="wallet-navbar-content">
                                <NavbarItems></NavbarItems>
                            </div>
                            <div className="wallet-content">
                                <NavbarContent></NavbarContent>
                            </div>
                        </section>

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
