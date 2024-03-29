import { Address, NervosAddressVersion } from "@lay2/pw-core";
import './login-modal.less';
import { useContext, useEffect, useState } from "react";
import { useConnect } from "wagmi";
import { CONFIG } from "../../../utils/config";
import { Types } from "../../../utils/reducers";
import { UnipassV3Wrapper } from "../../../utils/UnipassV3Wrapper";
import { DataContext, isMetaMaskMobile, isMobile } from "../../../utils/utils";
import { IconMap, LoginWalletType, setStorage } from "../../../utils/Wallet";
import { initConfig, connect } from "@joyid/ckb";

initConfig({
    name: "Nervape",
    network: "mainnet",
    joyidAppURL: "https://app.joy.id",
    logo: "https://www.nervape.com/assets/logo_nervape-6fc05221.svg"
});

export default function LoginModal(props: any) {
    const { state, dispatch } = useContext(DataContext);

    const { connectAsync, connectors, error } = useConnect();
    const { activeIndex } = props;

    // unipass v3 address
    const [layerOneAddress, setLayerOneAddress] = useState<Address>();

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

    if (!state.isInit) return <></>;

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
                <div className="wallet-way">
                    <div className="godwoken-content">
                        <div className="title">GODWOKEN / ETHEREUM</div>
                        <div className="btn-groups">
                            {connectors.map(connector => (
                                <button
                                    key={connector.id}
                                    className="btn metamask cursor"
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
                        </div>
                    </div>
                    <div className="line"></div>
                    <div className="nervos-l1-content">
                        <div className="title">NERVOS L1</div>
                        <div className="btn-groups">
                            <button className="btn unipass cursor" onClick={connectJoyId}>
                                <img
                                    className="wallet-icon"
                                    src={IconMap.get('JOYID')}
                                    alt=""
                                />
                                JOYID
                            </button>

                            <button className="btn unipass cursor" onClick={connectUnipass}>
                                <img
                                    className="wallet-icon"
                                    src={IconMap.get('Unipass')}
                                    alt=""
                                />
                                UNIPASS V3
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
