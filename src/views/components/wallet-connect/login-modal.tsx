import { Address, NervosAddressVersion } from "@lay2/pw-core";
import './login-modal.less';
import { useContext, useEffect, useRef, useState } from "react";
import { useConnect } from "wagmi";
import { CONFIG } from "../../../utils/config";
import { Types } from "../../../utils/reducers";
import { UnipassV3Wrapper } from "../../../utils/UnipassV3Wrapper";
import { DataContext, isMetaMaskMobile, isMobile, showErrorNotification } from "../../../utils/utils";
import { IconMap, LoginWalletType, setStorage } from "../../../utils/Wallet";
import { initConfig, connect } from "@joyid/ckb";
import { initConfig as bitInitConfig, requestAccounts } from "@joyid/bitcoin";
import { ConnectWay, Wallet, WalletChain } from "../../../nervape/wallet";

initConfig({
    name: "Nervape",
    network: "mainnet",
    joyidAppURL: "https://app.joy.id",
    logo: "https://www.nervape.com/assets/logo_nervape-6fc05221.svg"
});

bitInitConfig({
    name: "Nervape",
    logo: "https://www.nervape.com/assets/logo_nervape-6fc05221.svg",
    joyidAppURL: "https://app.joy.id",
    requestAddressType: 'p2tr',
});

export default function LoginModal(props: any) {
    const { state, dispatch } = useContext(DataContext);

    const { connectAsync, connectors, error } = useConnect();
    const { activeIndex } = props;

    // unipass v3 address
    const [layerOneAddress, setLayerOneAddress] = useState<Address>();

    const [walletWay, setWalletWay] = useState<ConnectWay[]>([]);
    const [walletWayActive, setWalletWayActive] = useState(0);

    const [unisatInstalled, setUnisatInstalled] = useState(false);
    const [accounts, setAccounts] = useState<string[]>([]);
    const [connected, setConnected] = useState(false);
    const [network, setNetwork] = useState("livenet");

    const setLayerOneWrapper = (wrapper: UnipassV3Wrapper) => {
        dispatch({
            type: Types.LayerOneWrapper,
            value: wrapper
        })
    }

    const setLoading = (flag: boolean) => {
        dispatch({
            type: flag ? Types.ShowLoading : Types.HideLoading
        })
    }

    const setLoginModal = (flag: boolean) => {
        dispatch({
            type: flag ? Types.ShowLoginModal : Types.HideLoginModal
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

    useEffect(() => {
        if (layerOneAddress) {
            const _address = layerOneAddress.toCKBAddress(NervosAddressVersion.latest);
            setStorage({
                type: LoginWalletType.UNIPASS_V3,
                address: _address,
                username: state.layerOneWrapper?.username,
                layerOneAddress
            });
        }
    }, [layerOneAddress]);

    const selfRef = useRef<{ accounts: string[] }>({
        accounts: [],
    });
    const self = selfRef.current;
    
    const selfOKxRef = useRef<{ accounts: string[] }>({
        accounts: [],
    });
    const selfOkx = selfOKxRef.current;

    const getBasicInfo = async () => {
        const unisat = (window as any).unisat;
        const [address] = await unisat.getAccounts();

        setStorage({
            type: LoginWalletType.UniSat,
            address: address,
            username: ''
        });

        setCurrentAddress(address);
        setLoginWalletType(LoginWalletType.UniSat);

        const network = await unisat.getNetwork();
        setNetwork(network);
    };
    
    const getOKXBasicInfo = async () => {
        const okxwallet = window.okxwallet;
        const [address] = await okxwallet.bitcoin.getAccounts();

        setStorage({
            type: LoginWalletType.OKX,
            address: address,
            username: ''
        });

        setCurrentAddress(address);
        setLoginWalletType(LoginWalletType.OKX);
    };

    const handleAccountsChanged = (_accounts: string[]) => {
        if (self.accounts[0] === _accounts[0]) {
            // prevent from triggering twice
            return;
        }
        self.accounts = _accounts;
        if (_accounts.length > 0) {
            setAccounts(_accounts);
            setConnected(true);

            setStorage({
                type: LoginWalletType.UniSat,
                address: _accounts[0],
                username: ''
            });

            setCurrentAddress(_accounts[0]);
            setLoginWalletType(LoginWalletType.UniSat);

            getBasicInfo();
        } else {
            setConnected(false);
        }
    };
    
    const handleOkxAccountsChanged = (_accounts: string[]) => {
        if (selfOkx.accounts[0] === _accounts[0]) {
            // prevent from triggering twice
            return;
        }
        selfOkx.accounts = _accounts;
        if (_accounts.length > 0) {
            setStorage({
                type: LoginWalletType.OKX,
                address: _accounts[0],
                username: ''
            });

            setCurrentAddress(_accounts[0]);
            setLoginWalletType(LoginWalletType.OKX);

            getOKXBasicInfo();
        } else {
        }
    };

    const handleNetworkChanged = (network: string) => {
        setNetwork(network);
        getBasicInfo();
    };
    
    const handleOKxNetworkChanged = (network: string) => {
        getOKXBasicInfo();
    };

    

    async function connectUnipass() {
        (async () => {
            try {
                setLoading(true);
                const wrapper = new UnipassV3Wrapper();
                await wrapper.init();
                await wrapper.connect();
                setLoading(false);
                setLayerOneWrapper(wrapper);
                setLayerOneAddress(wrapper.layerOneAddress);
                window.location.reload();
            } catch (err) {
                setLoading(false);
            }
        })();
    }

    async function connectJoyId() {
        setLoading(true);
        try {
            const authData = await connect();

            setStorage({
                type: LoginWalletType.JOYID,
                address: authData.address,
                username: ''
            });
            setLoading(false);
            window.location.reload();
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    async function connectJoyIdBtc() {
        setLoading(true);
        try {
            const accounts = await requestAccounts();

            setStorage({
                type: LoginWalletType.JOYID_BTC,
                address: accounts[0],
                username: ''
            });

            setLoginWalletType(LoginWalletType.JOYID_BTC);
            setCurrentAddress(accounts[0]);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

    async function connectOkx() {
        setLoading(true);

        try {
            const ua = navigator.userAgent;
            const isIOS = /iphone|ipad|ipod|ios/i.test(ua);
            const isAndroid = /android|XiaoMi|MiuiBrowser/i.test(ua);
            const isMobile = isIOS || isAndroid;
            const isOKApp = /OKApp/i.test(ua);

            if (isMobile && !isOKApp) {
                const encodedUrl = "https://www.okx.com/download?deeplink=" + encodeURIComponent("okx://wallet/dapp/url?dappUrl=" + encodeURIComponent(location.href));
                window.location.href = encodedUrl;
            } else if (window.okxwallet) {
                const result = await window.okxwallet.bitcoin.connect();
                console.log('okxwallet', result);

                setStorage({
                    type: LoginWalletType.OKX,
                    address: result.address,
                    username: ''
                });

                window.location.reload();
            } else {
                showErrorNotification({
                    message: 'Error',
                    description: 'OKX Is Not Installed'
                });
            }

            setLoading(false);
        } catch {
            setLoading(false);
        }
    }

    async function checkUnisat() {
        let unisat = window.unisat;

        for (let i = 1; i < 10 && !unisat; i += 1) {
            await new Promise((resolve) => setTimeout(resolve, 100 * i));
            unisat = (window as any).unisat;
        }

        if (unisat) {
            setUnisatInstalled(true);
        } else if (!unisat)
            return;

        if (state.loginWalletType === LoginWalletType.UniSat) {
            unisat.getAccounts().then((accounts: string[]) => {
                handleAccountsChanged(accounts);
            });

            unisat.on("accountsChanged", handleAccountsChanged);
            unisat.on("networkChanged", handleNetworkChanged);
        }
    }

    async function checkOkx() {
        let okxwallet = window.okxwallet;
        console.log('LoginWalletType.OKX', state.loginWalletType);
        if (state.loginWalletType === LoginWalletType.OKX) {
            okxwallet.bitcoin.getAccounts().then((accounts: string[]) => {
                handleOkxAccountsChanged(accounts);
            });

            okxwallet.bitcoin.on("accountsChanged", handleOkxAccountsChanged);
            okxwallet.bitcoin.on("networkChanged", handleOKxNetworkChanged);
        }
    }

    async function connectUnisat() {
        if (!unisatInstalled) {
            window.location.href = "https://unisat.io";
            return;
        }

        const result = await window.unisat.requestAccounts();
        handleAccountsChanged(result);
    }

    useEffect(() => {
        setWalletWay([
            {
                name: 'BTC',
                color: '#F44D37',
                chain: WalletChain.BTC,
                wallets: [
                    {
                        name: 'JoyID',

                        type: LoginWalletType.JOYID_BTC,
                        logo: IconMap.get('JOYID')
                    },
                    {
                        name: 'OKX',
                        type: LoginWalletType.OKX,
                        logo: IconMap.get('OKX')
                    },
                    {
                        name: 'UniSat',
                        type: LoginWalletType.UniSat,
                        logo: IconMap.get('UniSat')
                    }
                ]
            },
            {
                name: 'CKB',
                color: '#1CBF67',
                chain: WalletChain.CKB,
                wallets: [
                    {
                        name: 'JoyID',
                        type: LoginWalletType.JOYID,
                        logo: IconMap.get('JOYID')
                    },
                    {
                        name: 'UniPass',
                        type: LoginWalletType.UNIPASS_V3,
                        logo: IconMap.get('Unipass')
                    }
                ]
            },
            {
                name: 'Godwoken / Ethereum',
                color: '#4A7EFF',
                chain: WalletChain.Godwoken,
                wallets: [
                    {
                        name: 'METAMASK',
                        type: LoginWalletType.METAMASK,
                        logo: IconMap.get('MetaMask')
                    },
                    {
                        name: 'WALLETCONNECT',
                        type: LoginWalletType.WALLET_CONNECT,
                        logo: IconMap.get('WalletConnect')
                    },
                    {
                        name: 'COINBASE WALLET',
                        type: LoginWalletType.WALLET_CONNECT,
                        logo: IconMap.get('Coinbase Wallet')
                    }
                ]
            }
        ]);
    }, []);

    useEffect(() => {
        checkUnisat();
        checkOkx();
    }, [state.loginWalletType])

    const fnConnectWallet = async (way: ConnectWay, wallet: Wallet) => {
        switch (way.chain) {
            case WalletChain.BTC:
                switch (wallet.type) {
                    case LoginWalletType.JOYID_BTC:
                        connectJoyIdBtc();
                        break;
                    case LoginWalletType.OKX:
                        connectOkx();
                        break;
                    case LoginWalletType.UniSat:
                        connectUnisat();
                        break;
                }
                break;
            case WalletChain.CKB:
                switch (wallet.type) {
                    case LoginWalletType.JOYID:
                        connectJoyId();
                        break;
                    case LoginWalletType.UNIPASS_V3:
                        connectUnipass();
                        break;
                }
                break;
            case WalletChain.Godwoken:
                switch (wallet.type) {
                    case LoginWalletType.METAMASK:
                        break;
                    case LoginWalletType.WALLET_CONNECT:
                        break;
                    case LoginWalletType.WALLET_CONNECT:
                        break;
                }
                break;
        }
    }

    if (!state.isInit || !walletWay.length) return <></>;

    return (
        <div
            className={`login-modal popup-container ${(!state.currentAddress && (activeIndex == 6 || activeIndex == 7)) && 'opacity'} ${(!state.currentAddress && (state.showLoginModal || activeIndex == 6 || activeIndex == 7)) && 'show'}`}
            onClick={() => {
                document.body.style.overflow = 'auto';
                setLoginModal(false);
            }}
        >
            <div
                className="login-content"
                onClick={e => {
                    e.stopPropagation();
                }}
            >
                <div className="title">Connect Wallet</div>
                <div className="wallet-way flex-align">
                    {walletWay.map((w, index) => {
                        return (
                            <div key={index} className={`way-item transition cursor flex-center ${walletWayActive == index && 'active'}`}
                                style={{ color: walletWayActive == index ? `${w.color}` : '#FFFFFF' }}
                                onClick={() => {
                                    setWalletWayActive(index);
                                }}>
                                {index == 2 ? (
                                    <div className="g-e">
                                        <p>Godwoken</p>
                                        <p>/ Ethereum</p>
                                    </div>
                                ) : (
                                    w.name
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="line"></div>

                <div className="wallet-items">
                    {
                        walletWayActive == 2 ? (
                            <>
                                {connectors.map(connector => (
                                    <button
                                        key={connector.id}
                                        className="wallet-item cursor transition flex-align"
                                        disabled={!isMobile() && !connector.ready}
                                        onClick={async () => {
                                            if (
                                                !isMetaMaskMobile() &&
                                                isMobile() &&
                                                connector.name === 'MetaMask'
                                            ) {
                                                window.open(CONFIG.METAMASK_APP_URL, '_blank');
                                            } else {
                                                try {
                                                    await connectAsync({ connector });
                                                } catch (err) {
                                                    if (connector.name === 'Coinbase Wallet') {
                                                        window.location.reload();
                                                    }
                                                }
                                            }
                                        }}
                                    >
                                        <img
                                            className="wallet-icon"
                                            src={IconMap.get(connector?.name)}
                                            alt=""
                                        />
                                        {connector.name.toLocaleUpperCase()}
                                    </button>
                                ))}
                            </>
                        ) :
                            walletWay[walletWayActive].wallets.map((w, i) => {
                                return (
                                    <div className="wallet-item cursor transition flex-align" key={i} onClick={() => {
                                        fnConnectWallet(walletWay[walletWayActive], w);
                                    }}>
                                        <img src={w.logo} alt="" />
                                        {w.name}
                                    </div>
                                );
                            })
                    }
                </div>
            </div>
        </div>
    );
}
