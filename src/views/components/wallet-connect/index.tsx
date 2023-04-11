import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../../utils/utils";
import './index.less';

import { clearStorage, getStorage, LoginWalletType, setStorage, WALLET_CONNECT } from '../../../utils/Wallet';
import { mainnet, useAccount, useDisconnect, useNetwork } from "wagmi";
import { UnipassV3Wrapper } from "../../../utils/UnipassV3Wrapper";
import { Dropdown, MenuProps, message } from "antd";
import CopyToClipboard from "react-copy-to-clipboard";
import { NavTool } from "../../../route/navi-tool";

import NervosLogo from '../../../assets/logo/nervos_logo.svg';
import GodwokenLogo from '../../../assets/logo/godwoken_logo.svg';
import EthLogo from '../../../assets/logo/etherum.svg';
import InfoIcon from '../../../assets/icons/info_icon.svg';
import ConnectIcon from '../../../assets/icons/connect.svg';
import DisconnectIcon from '../../../assets/icons/disconnect.svg';
import Logout from "../logout";
import { Types } from "../../../utils/reducers";
import { godWoken } from "../../../utils/Chain";
import { SwitchChainSpan } from "../switchChain";
import { queryGetVotes } from "../../../utils/snapshot";

export default function WallectConnect(props: any) {
    const { setDisableList } = props;
    const { state, dispatch } = useContext(DataContext);

    const setLayerOneWrapper = (wrapper: UnipassV3Wrapper) => {
        dispatch({
            type: Types.LayerOneWrapper,
            value: wrapper
        })
    }

    // 当前链接钱包的地址
    const setCurrentAddress = (_address: string) => {
        dispatch({
            type: Types.CurrentAddress,
            value: _address
        })
    }

    const setIsInit = (isInit: boolean) => {
        dispatch({
            type: Types.IsInit,
            value: isInit
        })
    }

    // 当前链接的钱包
    const setLoginWalletType = (type: string) => {
        dispatch({
            type: Types.LoginWalletType,
            value: type
        })
    }
    // Wallet Connect
    const { address, isConnected } = useAccount();
    const { chain } = useNetwork();

    const setShowLogin = (flag: boolean) => {
        dispatch({
            type: flag ? Types.ShowLoginModal : Types.HideLoginModal
        })
    }
    // 打开 Dropdown
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<MenuProps['items']>([]);
    // 格式化的地址
    const [formatAddress, setFormatAddress] = useState('');

    const [showLogout, setShowLogout] = useState(false);
    const { disconnect } = useDisconnect();
    const disconnectReload = () => {
        localStorage.clear();
        disconnect();
        window.location.reload();
    };

    useAccount({
        onDisconnect() {
            disconnectReload();
        }
    });

    async function initLogin() {
        const _storage = getStorage();
        if (!_storage || state.currentAddress) {
            setIsInit(true);
            return;
        }

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
            }
        } else {
            clearStorage();
        }

        setIsInit(true);
    }

    useEffect(() => {
        initLogin();
        queryGetVotes("0x9e09396e7d9d47e47cf29e2d74cd9cb041e70d54bc43c1152abb137bf179ccce");
    }, []);

    useEffect(() => {
        if (!address || !chain) return;
        setCurrentAddress(address);
        setLoginWalletType(LoginWalletType.WALLET_CONNECT);
        setStorage({
            type: LoginWalletType.WALLET_CONNECT,
            address,
            username: ''
        });
        document.body.style.overflow = 'auto';
    }, [address, state.loginWalletType, chain]);

    const NervapeAssets = () => {
        return (
            <button
                className="nervape-asset cursor"
                onClick={() => {
                    setOpen(false);
                    NavTool.fnJumpToPage('/wallet');
                    window.scrollTo(0, 0);
                }}
            >
                My Nervape Assets
            </button>
        );
    }

    const CopyAddress = () => {
        return (
            <CopyToClipboard
                text={state.currentAddress}
                onCopy={() => {
                    message.success(`Copy Success!`);
                    setOpen(false);
                }}
            >
                <button className="copy-address cursor">Copy Address</button>
            </CopyToClipboard>
        );
    }

    const SignOut = () => {
        return (
            <button
                className="logout-out cursor"
                onClick={() => {
                    // sessionStorage.removeItem('UP-A');
                    setOpen(false);
                    setShowLogout(true);
                }}
            >
                Sign Out
            </button>
        );
    }

    const SwitchChainTip = () => {
        return (
            <div className="wallet-chain-tip">
                Nervape Wallet does not support current network. Please switch to {' '}
                <SwitchChainSpan
                    setOpenClose={() => {
                        setOpen(false);
                    }}
                    title={'Godwoken Mainnet'}
                    chainId={godWoken.id}></SwitchChainSpan>
                {' '} or {' '}
                <SwitchChainSpan
                    setOpenClose={() => {
                        setOpen(false);
                    }}
                    title={'Ethereum Mainnet'}
                    chainId={mainnet.id}></SwitchChainSpan>
            </div>
        );
    }
    const _items: MenuProps['items'] = [
        {
            label: NervapeAssets(),
            key: '0'
        },
        {
            label: CopyAddress(),
            key: '1'
        },
        {
            label: SignOut(),
            key: '2'
        }
    ];

    const _items1: MenuProps['items'] = [
        {
            label: SwitchChainTip(),
            key: '-1'
        },
        {
            label: NervapeAssets(),
            key: '0'
        },
        {
            label: CopyAddress(),
            key: '1'
        },
        {
            label: SignOut(),
            key: '2'
        }
    ];

    const walletIcon = () => {
        if (state.loginWalletType === LoginWalletType.UNIPASS_V3) return NervosLogo;
        // 检查是否支持当前网络
        if (!chain || ![godWoken.id, mainnet.id].includes(chain.id)) {
            return InfoIcon;
        }
        return chain.id === godWoken.id ? GodwokenLogo : EthLogo;
    };

    async function loginOrLogout() {
        if (state.currentAddress) {
            setShowLogout(true);
        } else {
            setShowLogin(true);
            setDisableList(true);
            document.body.style.overflow = 'hidden';
        }
    }

    const connectOrDisIcon = () => {
        return (
            <img
                className="logout-btn"
                src={state.currentAddress ? DisconnectIcon : ConnectIcon}
                alt="" />
        );
    }

    useEffect(() => {
        setItems([]);
        if (state.loginWalletType === LoginWalletType.WALLET_CONNECT) {
            if (!chain || ![godWoken.id, mainnet.id].includes(chain.id)) {
                setItems(_items1);
            } else {
                setItems(_items);
            }
        } else {
            setItems(_items);
        }
    }, [chain, state.loginWalletType]);

    useEffect(() => {
        const subLength = 5;
        const dotStr = '......';
        setFormatAddress(
            `${state.currentAddress.substr(0, subLength)}${dotStr}${state.currentAddress.substr(
                state.currentAddress.length - subLength,
                subLength
            )}`
        );
    }, [state.currentAddress]);

    return (
        <div className="wallect-connect-modal">
            {state.windowWidth > 750 ? (
                !state.currentAddress ? (
                    <button
                        className="login-image hover cursor"
                        onClick={() => {
                            document.body.style.overflow = 'hidden';
                            setShowLogin(true)
                        }}>
                        CONNECT
                    </button>
                ) : (
                    <div className={`wallet-address cursor ${state.loginWalletType}`}>
                        <Dropdown
                            menu={{ items }}
                            trigger={['hover']}
                            overlayClassName="wallet-connect-dropmenu"
                            onOpenChange={_open => {
                                setOpen(_open);
                            }}
                        >
                            <div className={`address cursor ${open && 'open'}`}>
                                <img src={walletIcon()} alt="UnipassIcon" />
                                <div className="span">{formatAddress}</div>
                            </div>
                        </Dropdown>
                    </div>
                )
            ) : (
                !state.currentAddress ? (
                    <div className="m-connect-group cursor" onClick={loginOrLogout}>
                        <button className="login-image">
                            CONNECT
                        </button>
                        {connectOrDisIcon()}
                    </div>
                ) : (
                    <div className={`m-wallet-address ${state.loginWalletType}`}>
                        <div className={`address address-item cursor`} onClick={loginOrLogout}>
                            <img src={walletIcon()} alt="UnipassIcon" />
                            <div className="span">{formatAddress}</div>
                            {connectOrDisIcon()}
                        </div>
                        {
                            state.loginWalletType === LoginWalletType.WALLET_CONNECT &&
                            isConnected &&
                            (!chain || ![godWoken.id, mainnet.id].includes(chain.id)) &&
                            (
                                <div className="address-item switch-chain-item">
                                    {SwitchChainTip()}
                                </div>
                            )
                        }

                        <div className="address-item cursor">
                            {CopyAddress()}
                        </div>
                        <div className="address-item cursor">
                            {NervapeAssets()}
                        </div>
                    </div>
                )
            )}

            <Logout
                show={showLogout}
                close={() => {
                    setShowLogout(false);
                }}
                logout={disconnectReload}></Logout>
        </div>
    );
}
