import React from 'react';
import './account.less';
import ETHBalance from './EthBalance';
import { LoginWalletType } from '../../../utils/Wallet';

export default function Account(props: { loginWalletType: string; address: string, balance: string; showTransfer: any; }) {
    const {loginWalletType, address, balance, showTransfer} = props;

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

    return (
        <div className="account">
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
