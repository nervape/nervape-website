import React, { useEffect, useState } from 'react';
import './account.less';
import 'antd/dist/antd.css';
import { Dropdown, MenuProps, message } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useAccount, useDisconnect } from 'wagmi';
import ETHBalance from './EthBalance';
import { IconMap, LoginWalletType } from '../../../utils/Wallet';

export default function Account(props: { loginWalletType: string; address: string, balance: string; showTransfer: any; }) {
    const {loginWalletType, address, balance, showTransfer} = props;
    
    const [myAddress, setMyAddress] = useState('');
    const [open, setOpen] = useState(false);

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

    const myBalance = () => {
        const balanceArr = balance.split('.');
        return (
            <>
                {balanceArr[0]}
                <span>{balanceArr[1] ? `.${balanceArr[1]}` : ''}</span>
                &thinsp;CKB
            </>
        );
    };

    const items: MenuProps['items'] = [
        {
            label: (
                <CopyToClipboard
                    text={address}
                    onCopy={() => {
                        message.success(`Copy Success!`);
                        setOpen(false);
                    }}
                >
                    <span>Copy Address</span>
                </CopyToClipboard>
            ),
            key: '0'
        },
        {
            label: (
                <button
                    className="logout-out cursor"
                    onClick={() => {
                        // sessionStorage.removeItem('UP-A');
                        // clearStorage();
                        disconnectReload();
                    }}
                >
                    Sign Out
                </button>
            ),
            key: '1'
        }
    ];

    useEffect(() => {
        const subLength = 5;
        const dotStr = '......';
        setMyAddress(
            `${address.substr(0, subLength)}${dotStr}${address.substr(
                address.length - subLength,
                subLength
            )}`
        );
    }, [address]);

    const walletName = () => {
        if (loginWalletType === LoginWalletType.UNIPASS_V3) return 'Unipass Wallet';
        if (connector?.name === 'MetaMask') return 'Metamask Wallet';
        if (connector?.name === 'Coinbase Wallet') return 'Coinbase Wallet';
        return 'WalletConnect';
    };

    const walletIcon = () => {
        if (loginWalletType === LoginWalletType.UNIPASS_V3) return IconMap.get('Unipass');
        return IconMap.get(connector?.name || '');
    };

    return (
        <div className="account">
            <div className={`wallet-address ${loginWalletType}`}>
                <div className="title">{walletName()}</div>
                <Dropdown
                    menu={{ items }}
                    trigger={['click', 'hover']}
                    overlayClassName="account-dropmenu"
                    onOpenChange={_open => {
                        setOpen(_open);
                    }}
                >
                    <div className={`address cursor ${open && 'open'}`}>
                        <img src={walletIcon()} alt="UnipassIcon" />
                        <div className="span">{myAddress}</div>
                    </div>
                </Dropdown>
            </div>
            <div className="wallet-balance">
                <div className="title">
                    Balance
                    {loginWalletType === LoginWalletType.UNIPASS_V3 && (
                        <div className="transfer-btn cursor" onClick={showTransfer}>
                            Transfer
                        </div>
                    )}
                </div>
                {loginWalletType === LoginWalletType.UNIPASS_V3 ? (
                    <div className="balance">{myBalance()}</div>
                ) : (
                    <ETHBalance />
                )}
            </div>
        </div>
    );
}
