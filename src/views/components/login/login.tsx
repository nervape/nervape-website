/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
// import Tutorial from '../tutorial/tutorial';
import './login.less';
import { useConnect } from 'wagmi';
import MaskGroup from '../../../assets/images/login/mask_group.png';
import { getWindowWidthRange, isMetaMaskMobile, isMobile, scrollToTop } from '../../../utils/utils';

// import Footer from '../layout/footer';
import LoadingModal from '../loading/loading';
import { IconMap } from '../../../utils/Wallet';
import { CONFIG } from '../../../utils/config';

interface Props {
    icon?: 'show' | 'hide';
    label?: string;
    balance?: 'show' | 'hide';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Login(props: any) {
    const { connectUnipass } = props;
    const [showLogin, setShowLogin] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const windowWidth = getWindowWidthRange();

    const { connectAsync, connectors, error } = useConnect();

    function filterNfts() {
        return () => {
            const maskCover = document.getElementById('mask-cover');
            const bottomContent = document.getElementById('bottom-content');

            if (windowWidth <= 750) return;
            if (maskCover && bottomContent) {
                if (window.innerHeight - 64 - 95 - 40 < maskCover.offsetHeight) {
                    document.body.style.overflow = 'auto';
                    bottomContent.style.paddingBottom = '120px';
                } else {
                    document.body.style.overflow = 'hidden';
                    bottomContent.style.paddingBottom = `${window.innerHeight -
                        197 -
                        maskCover.offsetHeight}px`;
                }
            }
        };
    }

    const fnFilter = useCallback(filterNfts(), []);

    function fnScrollPage() {
        fnFilter();
    }

    useEffect(() => {
        if (error) {
            setConnecting(false);
        }
    }, [error]);

    useEffect(() => {
        setTimeout(() => {
            scrollToTop();
            fnFilter();
        }, 100);
        window.addEventListener('resize', fnScrollPage, true);
        return () => {
            window.removeEventListener('resize', fnScrollPage, true);
        };
    }, []);

    const LoginModal = () => {
        return (
            <div
                className={`login-modal ${showLogin && 'show'}`}
                onClick={() => {
                    setShowLogin(false);
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
                                                setConnecting(true);
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
    };

    return (
        <div className={`login show`}>
            <div className="content">
                <div className="top" id="top">
                    <div className="title" id="title">
                        WALLET
                    </div>
                    <div className="mask-cover" id="mask-cover">
                        <img className="mask-group" src={MaskGroup} alt="MaskGroup" />
                    </div>
                    <div className="bottom-content" id="bottom-content">
                        <div className="login-btn">
                            <button className="login-image" onClick={() => setShowLogin(true)}>
                                CONNECT WALLET
                            </button>
                        </div>
                        {/* <Tutorial></Tutorial> */}
                    </div>
                </div>
                {windowWidth <= 750 && <div className="bottom"></div>}
            </div>
            {/* <Footer></Footer> */}
            <LoginModal></LoginModal>
            <LoadingModal show={connecting}></LoadingModal>
        </div>
    );
}
