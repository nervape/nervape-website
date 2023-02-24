import React, { useContext, useEffect, useState } from "react";
import { CONFIG } from "../../../utils/config";
import { DataContext, isMetaMaskMobile, isMobile, scrollToTop } from "../../../utils/utils";
import './index.less';

import { clearStorage, getStorage, IconMap, LoginWalletType, setStorage, WALLET_CONNECT } from '../../../utils/Wallet';
import { useAccount, useConnect, useDisconnect, useNetwork } from "wagmi";
import { UnipassV3Wrapper } from "../../../utils/UnipassV3Wrapper";
import LoadingModal from "../loading/loading";
import { Address, NervosAddressVersion } from "@lay2/pw-core";
import { Dropdown, MenuProps, message } from "antd";
import CopyToClipboard from "react-copy-to-clipboard";
import { NavTool } from "../../../route/navi-tool";

import NervosLogo from '../../../assets/logo/nervos_logo.svg';
import GodwokenLogo from '../../../assets/logo/godwoken_logo.svg';
import InfoIcon from '../../../assets/icons/info_icon.svg';
import Logout from "../logout";
import { Types } from "../../../utils/reducers";

export default function WallectConnect(props: any) {
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

    // 当前链接的钱包
    const setLoginWalletType = (type: string) => {
        dispatch({
            type: Types.LoginWalletType,
            value: type
        })
    }
    // Wallet Connect
    const { connector: activeConnector, address, isConnected } = useAccount();
    const { chain } = useNetwork();

    const setShowLogin = (flag: boolean) => {
        console.log('setShowLogin')
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

    const { connector } = useAccount({
        onDisconnect() {
            disconnectReload();
        }
    });

    async function initLogin() {
        const _storage = getStorage();
        if (!_storage) {
            return;
        }
        if (state.currentAddress) return;
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
    }

    useEffect(() => {
        initLogin();
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
    }, [address, state.loginWalletType, chain]);

    const _items: MenuProps['items'] = [
        {
            label: (
                <button
                    className="nervape-asset cursor"
                    onClick={() => {
                        NavTool.fnJumpToPage('/wallet');
                        window.scrollTo(0, 0);
                    }}
                >
                    MY NERVAPE ASSETS
                </button>
            ),
            key: '0'
        },
        {
            label: (
                <CopyToClipboard
                    text={state.currentAddress}
                    onCopy={() => {
                        message.success(`Copy Success!`);
                        setOpen(false);
                    }}
                >
                    <button className="copy-address cursor">Copy Address</button>
                </CopyToClipboard>
            ),
            key: '1'
        },
        {
            label: (
                <button
                    className="logout-out cursor"
                    onClick={() => {
                        // sessionStorage.removeItem('UP-A');
                        // clearStorage();
                        setShowLogout(true);
                    }}
                >
                    Sign Out
                </button>
            ),
            key: '2'
        }
    ];

    const _items1: MenuProps['items'] = [
        {
            label: (
                <div className="wallet-chain-tip">
                    Nervape Wallet does not support current network. Please switch to Godwoken Mainnet or Ethereum Mainnet
                </div>
            ),
            key: '-1'
        },
        {
            label: (
                <button
                    className="nervape-asset cursor"
                    onClick={() => {
                        NavTool.fnJumpToPage('/wallet');
                        window.scrollTo(0, 0);
                    }}
                >
                    MY NERVAPE ASSETS
                </button>
            ),
            key: '0'
        },
        {
            label: (
                <CopyToClipboard
                    text={state.currentAddress}
                    onCopy={() => {
                        message.success(`Copy Success!`);
                        setOpen(false);
                    }}
                >
                    <button className="copy-address cursor">Copy Address</button>
                </CopyToClipboard>
            ),
            key: '1'
        },
        {
            label: (
                <button
                    className="logout-out cursor"
                    onClick={() => {
                        // sessionStorage.removeItem('UP-A');
                        // clearStorage();
                        setShowLogout(true);
                    }}
                >
                    Sign Out
                </button>
            ),
            key: '2'
        }
    ];

    const walletIcon = () => {
        if (state.loginWalletType === LoginWalletType.UNIPASS_V3) return NervosLogo;
        // 检查是否支持当前网络
        if (!chain || ![CONFIG.GODWOKEN_CHAIN_ID, CONFIG.ETHEREUM_CHAIN_ID].includes(chain.id)) {
            return InfoIcon;
        }
        return GodwokenLogo;
    };

    useEffect(() => {
        setItems([]);
        if (state.loginWalletType === LoginWalletType.WALLET_CONNECT) {
            if (!chain || ![CONFIG.GODWOKEN_CHAIN_ID, CONFIG.ETHEREUM_CHAIN_ID].includes(chain.id)) {
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
            {state.windowWidth !== 375 ? (
                !state.currentAddress ? (
                    <button
                        className="login-image cursor"
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
                            trigger={['click', 'hover']}
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
                    <div className="m-connect-group">
                        <button
                            className="login-image cursor"
                            onClick={() => {
                                document.body.style.overflow = 'hidden';
                                setShowLogin(true)
                            }}>
                            CONNECT
                        </button>
                        <div className="login-icon"></div>
                    </div>
                ) : (
                    <div className={`wallet-address cursor ${state.loginWalletType}`}>
                        <Dropdown
                            menu={{ items }}
                            trigger={['click', 'hover']}
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
