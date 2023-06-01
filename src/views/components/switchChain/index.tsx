import React, { useEffect, useState } from 'react';
import { mainnet, useSwitchNetwork } from 'wagmi';
import { godWoken } from '../../../utils/Chain';
import { getWallectConnect } from '../../../utils/Wallet';
import './index.less';

export function SwitchChainSpan(props: any) {
    const { title, setShowChainInfo, chainId, setOpenClose } = props;

    const [excludeWalletList] = useState(['Trust Wallet']);
    const wallectConnect = getWallectConnect();
    const [wallectConnectInfo, setWalletConnectInfo] = useState<any>(null);

    useEffect(() => {
        if (!wallectConnect) return;
        setWalletConnectInfo(JSON.parse(wallectConnect));
    }, [wallectConnect]);

    const { switchNetworkAsync } = useSwitchNetwork({
        chainId: chainId,
        throwForSwitchChainNotSupported: true,
        onError(error: any) {
            const { cause } = error;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (!/user rejected (the )?request/i.test((cause as any).message)) {
                setShowChainInfo && setShowChainInfo(true);
                document.body.style.overflow = 'hidden';
            }
        }
    });

    return (
        <span
            className="cursor"
            onClick={async () => {
                setOpenClose && setOpenClose()
                if (!switchNetworkAsync) {
                    setShowChainInfo && setShowChainInfo(true);
                    document.body.style.overflow = 'hidden';
                    return;
                }
                if (excludeWalletList.includes(wallectConnectInfo?.peerMeta?.name)) {
                    setShowChainInfo && setShowChainInfo(true);
                    document.body.style.overflow = 'hidden';
                    return;
                }
                await switchNetworkAsync?.(chainId);
            }}
        >
            {title}
        </span>
    );
}

export default function SwitchChain(props: {
    show: boolean;
    setSwitchChain: Function;
    setShowChainInfo: Function;
}) {
    const { show, setSwitchChain, setShowChainInfo } = props;
    
    return (
        <div
            className={`switch-chain popup-container ${show && 'show'}`}
            onClick={() => {
                setSwitchChain(false);
            }}
        >
            <div className="visible-header-line transition"></div>
            <div
                className="bg"
                onClick={e => {
                    e.stopPropagation();
                }}
            >
                <div className="tip">
                    Nervape Wallet does not support current network. Please switch to {' '}
                    <SwitchChainSpan
                        title={'Godwoken Mainnet'}
                        setShowChainInfo={setShowChainInfo}
                        chainId={godWoken.id}></SwitchChainSpan>
                    {' '} or {' '}
                    <SwitchChainSpan
                        title={'Ethereum Mainnet'}
                        setShowChainInfo={setShowChainInfo}
                        chainId={mainnet.id}></SwitchChainSpan>
                </div>
            </div>
        </div>
    );
}
