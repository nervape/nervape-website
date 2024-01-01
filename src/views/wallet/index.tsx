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
import PhysicalNftIcon from "../../assets/wallet/navbar/physical_nft.svg";
import EventIcon from "../../assets/wallet/navbar/event.svg";
import BadgeIcon from "../../assets/wallet/navbar/badge.svg";
import TxIcon from "../../assets/wallet/navbar/tx.svg";
import CollabNFTIcon from "../../assets/wallet/navbar/collab_nfts.svg";
import JoyIdNFTIcon from "../../assets/wallet/navbar/joyid_nft.svg";
import InvitationClaim from "./invitation";
import WalletCoCreatedNFT from "./co-created";
import { Menu, MenuProps } from "antd";
import WalletPhysicalNft from "./physical-nft";

type MenuItem = Required<MenuProps>['items'][number];
export class WalletNavBar {
    name: WalletNavbarTypes = WalletNavbarTypes.NACP;
    icon: string = "";
    menu_name?: WalletNavbarTypes;
    children?: WalletNavBar[];
}

export enum WalletNavbarTypes {
    NACP = 'NACP',
    NFT = '3DNFT',
    EVENT = 'EVENT',
    BADGE = 'BADGE',
    TX = 'TX',
    JOYID = 'JOYID',
    CoCreatedNFT = 'Co-CreatedNFT',
    L2NFT = 'L2NFT',
    PHYSICALNFT = 'PHYSICAL-NFT'
}

const getItem = (
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
) => {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

const JoyIdItems: MenuItem[] = [
    getItem((<img className="icon" src={JoyIdNFTIcon} alt="" />), WalletNavbarTypes.JOYID, null, [
        getItem((
            <div className="navbar-icon" onClick={() => { }}>
                <img className="icon" src={CollabNFTIcon} alt="" />
            </div>
        ), WalletNavbarTypes.CoCreatedNFT)
    ])
];

const L2NFTItems: MenuItem[] = [
    getItem((<img className="icon" src={JoyIdNFTIcon} alt="" />), WalletNavbarTypes.JOYID, null, [
        getItem((
            <div className="navbar-icon" onClick={() => { }}>
                <img className="icon" src={NacpIcon} alt="" />
            </div>
        ), WalletNavbarTypes.NACP),
        getItem((
            <div className="navbar-icon" onClick={() => { }}>
                <img className="icon" src={NftIcon} alt="" />
            </div>
        ), WalletNavbarTypes.NFT),
        getItem((
            <div className="navbar-icon" onClick={() => { }}>
                <img className="icon" src={PhysicalNftIcon} alt="" />
            </div>
        ), WalletNavbarTypes.PHYSICALNFT)
    ])
];

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

    const [navbars, setNavbars] = useState<WalletNavBar[]>([]);
    const [currNavbarName, setCurrNavbarName] = useState<WalletNavbarTypes>();
    const [isBonelist, setIsBonelist] = useState(false);
    const [isInit, setIsInit] = useState(false);
    const [current, setCurrent] = useState('');

    const setLoading = (flag: boolean) => {
        dispatch({
            type: flag ? Types.ShowLoading : Types.HideLoading
        })
    }

    const setSwitchChain = (flag: boolean) => {
        const _extra_padding = flag ? '64px' : '0px'
        document.body.style.setProperty('--extra-padding', _extra_padding);
        document.body.style.setProperty('--padding-top', flag ? '0px' : '64px');
        document.body.style.setProperty('--header-top', flag ? '16px' : '0px');
        document.body.style.setProperty('--switch-height', flag ? '44px' : '0px');

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

    useEffect(() => {
        console.log('current', current);
    }, [current]);
    useEffect(() => {
        if (!state.currentAddress) return;
        if (nftCoverImages.length) return;
        // 后台读取 NFTS 查找对应 CoverImage
        fnNFTNameCoverImg();
    }, [state.currentAddress]);

    useEffect(() => {
        updateUnipassCkbBalance();
    }, [state.layerOneWrapper]);

    const fnGetNavbarName = (arr: WalletNavBar[], hash?: string) => {
        if (arr[0].menu_name) {
            setCurrNavbarName(arr[0].menu_name);
            setCurrent(arr[0].menu_name);

            window.location.hash = arr[0].menu_name.toLocaleLowerCase() as string;
        } else {
            setCurrNavbarName(arr[0].name);

            window.location.hash = arr[0].name.toLocaleLowerCase() as string;
        }
    }

    useEffect(() => {
        if (!navbars.length || isInit) return;
        console.log('history', history);
        const { hash } = history;
        let _filters : WalletNavBar[] = [];

        if (!hash) {
            fnGetNavbarName(navbars);
        } else {
            const filters = navbars.filter(n => {
                if (n.children) {
                    _filters = n.children.filter(f => '#' + f.menu_name?.toLocaleLowerCase() == hash)
                    return _filters.length > 0;
                }

                if (n.menu_name) {
                    return '#' + n.menu_name.toLocaleLowerCase() == hash;
                }

                return '#' + n.name.toLocaleLowerCase() == hash;
            });

            if (filters.length) {
                fnGetNavbarName(_filters.length ? _filters : filters, hash);
            } else {
                fnGetNavbarName(navbars);
            }
        }

        setIsInit(true);
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

    const CollabNFTMenu = () => {
        return <Menu mode={state.windowWidth > 750 ? 'vertical' : 'horizontal'}
            onClick={(e) => {
                const key = e.key as WalletNavbarTypes
                setCurrent(key);
                setCurrNavbarName(key);
                window.location.hash = key.toLocaleLowerCase();
            }}
            rootClassName="collab-nft-item"
            // openKeys={['joyid-nfts']}
            // defaultSelectedKeys={['collab-nfts']}
            selectedKeys={[current]}
            expandIcon={() => {
                return <></>;
            }}
            items={JoyIdItems}
            triggerSubMenuAction="click" />
    }

    useEffect(() => {
        console.log('currNavbarName', currNavbarName)
        if ([WalletNavbarTypes.EVENT, WalletNavbarTypes.BADGE, WalletNavbarTypes.TX].includes(currNavbarName as WalletNavbarTypes)) {
            setCurrent('');
        }
    }, [currNavbarName]);

    const L2NFTMenu = () => {
        return <Menu mode={state.windowWidth > 750 ? 'vertical' : 'horizontal'}
            onClick={(e) => {
                const key = e.key as WalletNavbarTypes
                setCurrent(key);
                console.log('setCurrNavbarName', key)
                setCurrNavbarName(key);
                window.location.hash = key.toLocaleLowerCase();
            }}
            rootClassName="collab-nft-item"
            // openKeys={['joyid-nfts']}
            // defaultSelectedKeys={['collab-nfts']}
            selectedKeys={[current]}
            expandIcon={() => {
                return <></>;
            }}
            items={L2NFTItems}
            triggerSubMenuAction="click" />
    }

    useEffect(() => {
        if (!state.loginWalletType || !state.currentAddress) return;
        if (state.loginWalletType === LoginWalletType.UNIPASS_V3) {
            // 设置 navbars
            setNavbars([
                {
                    name: WalletNavbarTypes.NFT,
                    icon: NftIcon
                },
                {
                    name: WalletNavbarTypes.TX,
                    icon: TxIcon
                }
            ]);
            return
        } else if (state.loginWalletType === LoginWalletType.JOYID) {
            setNavbars([
                {
                    // name: WalletNavbarTypes.JOYID,
                    name: WalletNavbarTypes.CoCreatedNFT,
                    icon: JoyIdNFTIcon,
                    // menu_name: WalletNavbarTypes.CoCreatedNFT 
                }
            ]);
        } else {
            // 设置 navbars
            setNavbars([
                {
                    name: WalletNavbarTypes.L2NFT,
                    icon: JoyIdNFTIcon,
                    children: [
                        {
                            name: WalletNavbarTypes.NACP,
                            icon: '',
                            menu_name: WalletNavbarTypes.NACP
                        },
                        {
                            name: WalletNavbarTypes.NFT,
                            icon: '',
                            menu_name: WalletNavbarTypes.NFT
                        },
                        {
                            name: WalletNavbarTypes.PHYSICALNFT,
                            icon: '',
                            menu_name: WalletNavbarTypes.PHYSICALNFT
                        }
                    ]
                },
                {
                    name: WalletNavbarTypes.EVENT,
                    icon: EventIcon
                },
                {
                    name: WalletNavbarTypes.BADGE,
                    icon: BadgeIcon
                },
                {
                    name: WalletNavbarTypes.TX,
                    icon: TxIcon
                }
            ]);
            // 查询是否持有 Nacp bonelist
            searchBonelist();
        };

        document.body.style.overflow = 'auto';
        getPoaps(state.currentAddress);
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
                    if (navbar.name == WalletNavbarTypes.JOYID) {
                        return <div key={index} className={`navbar-item flex-center cursor ${navbar.name}`}>
                            {CollabNFTMenu()}
                        </div>
                    } else if (navbar.name == WalletNavbarTypes.L2NFT) {
                        return <div key={index} className={`navbar-item flex-center cursor ${navbar.name}`}>
                            {L2NFTMenu()}
                        </div>
                    }

                    return (
                        <div key={index} className={`navbar-item flex-center cursor ${currNavbarName == navbar.name && 'active'}`}>
                            <div className="navbar-icon" onClick={() => {
                                setCurrNavbarName(navbar.name);
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
                            balance={balance}></WalletHeader>

                        <section className={`wallet-section flex-align ${isFold && 'fold'}`}>
                            <div className="wallet-navbar-content transition">
                                <NavbarItems></NavbarItems>
                            </div>
                            <div className="wallet-content transition">
                                {/* <NavbarContent></NavbarContent> */}
                                {currNavbarName == WalletNavbarTypes.NACP ? (
                                    <WalletNacp isFold={isFold} isBonelist={isBonelist} setLoading={setLoading}></WalletNacp>
                                ) : (
                                    currNavbarName == WalletNavbarTypes.NFT ? (
                                        <WalletNFT3D
                                            isFold={isFold}
                                            nftCoverImages={nftCoverImages}
                                            setLoading={setLoading}
                                            setShowTransferSuccess={setShowTransferSuccess}></WalletNFT3D>
                                    ) : (
                                        currNavbarName == WalletNavbarTypes.TX ? (
                                            <WalletTx
                                                isFold={isFold}
                                                nftCoverImages={nftCoverImages}
                                                setLoading={setLoading}
                                                updateBalance={updateUnipassCkbBalance}></WalletTx>
                                        ) : (
                                            currNavbarName == WalletNavbarTypes.BADGE ? (
                                                <WalletBadge isFold={isFold} badges={badges} setLoading={setLoading}></WalletBadge>
                                            ) : (
                                                currNavbarName == WalletNavbarTypes.EVENT ? (
                                                    <WalletEvent isFold={isFold} setLoading={setLoading}></WalletEvent>
                                                ) : (
                                                    currNavbarName == WalletNavbarTypes.CoCreatedNFT ? (
                                                        <WalletCoCreatedNFT isFold={isFold} setLoading={setLoading}></WalletCoCreatedNFT>
                                                    ) : (
                                                        currNavbarName == WalletNavbarTypes.PHYSICALNFT ? (
                                                            <WalletPhysicalNft isFold={isFold} setLoading={setLoading}></WalletPhysicalNft>
                                                        ) : (
                                                            <></>
                                                        )
                                                    )
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
