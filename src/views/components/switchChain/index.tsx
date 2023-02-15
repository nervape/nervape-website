import React, { useEffect, useState } from 'react';
import { SwitchChainError, useSwitchNetwork } from 'wagmi';
import { godWoken } from '../../../utils/Chain';
import { getWallectConnect } from '../../../utils/Wallet';
import './index.less';

export default function SwitchChain(props: {
    show: boolean;
    setSwitchChain: Function;
    setShowChainInfo: Function;
}) {
    const [excludeWalletList] = useState(['Trust Wallet']);
    const [wallectConnectInfo, setWalletConnectInfo] = useState<any>(null);

    const wallectConnect = getWallectConnect();
    const { show, setSwitchChain, setShowChainInfo } = props;
    const { switchNetworkAsync } = useSwitchNetwork({
        chainId: godWoken.id,
        throwForSwitchChainNotSupported: true,
        onError(error: any) {
            const { cause } = error;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (!/user rejected (the )?request/i.test((cause as any).message)) {
                setShowChainInfo(true);
                document.body.style.overflow = 'hidden';
            }
        }
    });

    useEffect(() => {
        if (!wallectConnect) return;
        setWalletConnectInfo(JSON.parse(wallectConnect));
    }, [wallectConnect]);
    return (
        <div
            className={`switch-chain ${show && 'show'}`}
            onClick={() => {
                setSwitchChain(false);
            }}
        >
            <div
                className="bg"
                onClick={e => {
                    e.stopPropagation();
                }}
            >
                <div className="tip">
                    Nervape Wallet does not support current network. Please{' '}
                    <span
                        className="cursor"
                        onClick={async () => {
                            if (!switchNetworkAsync) {
                                setShowChainInfo(true);
                                document.body.style.overflow = 'hidden';
                                return;
                            }
                            if (excludeWalletList.includes(wallectConnectInfo?.peerMeta?.name)) {
                                setShowChainInfo(true);
                                document.body.style.overflow = 'hidden';
                                return;
                            }
                            await switchNetworkAsync?.(godWoken.id);
                            console.log('switchNetworkAsync');
                        }}
                    >
                        switch to Godwoken Mainnet
                    </span>
                </div>
            </div>
        </div>
    );
}
