import React, { useEffect, useState } from 'react';
import './index.less';
import { getConfig } from '@ckb-lumos/config-manager';
import { Amount } from '@lay2/pw-core';
import ArrowIcon from '../../../assets/images/icons/arrow.svg';
import {
    parseFullFormatAddress,
    parseDeprecatedCkb2019Address
} from '../../../utils/address-to-script';
import TransferConfirm from '../bridge/confirm';

export default function TransferCkb(props: { show: boolean; close: any; balance: string; doTransferCKB: Function; }) {
    const { show, close, balance, doTransferCKB } = props;
    const [confirmText, setConfirmText] = useState('ENTER TRANSFER AMOUNT');
    const [selectBalance, setSelectBalance] = useState('');
    const [L1Address, setL1Address] = useState('');
    const [gasFee, setGasFee] = useState<Amount>();
    const [canTransfer, setCanTransfer] = useState(false);
    const [showTransferConfirm, setShowTransferConfirm] = useState(false);
    const [minAmount, setMinAmount] = useState<Amount>();
    const [zeroAmount, setZeroAmount] = useState<Amount>();

    const [balanceMessage, setBalanceMessage] = useState('');
    const [addressMessage, setAddressMessage] = useState('');

    function parseAddress(address: string) {
        // eslint-disable-next-line no-param-reassign
        const config = getConfig();
        try {
            return parseFullFormatAddress(address, { config });
        } catch {
            return parseDeprecatedCkb2019Address(address, { config });
        }
    }

    useEffect(() => {
        setMinAmount(new Amount('63'));
        setZeroAmount(new Amount('0'));
        setGasFee(new Amount('0.001'));
        if (show) {
            setSelectBalance('');
            setL1Address('');
        }
    }, [show]);
    useEffect(() => {
        if (!minAmount) return;
        setBalanceMessage('');
        setAddressMessage('');
        setCanTransfer(false);
        const _selectAmount = new Amount(selectBalance);
        if (selectBalance && _selectAmount.lt(minAmount)) {
            setConfirmText('MINIMUM 63 CKB');
            setBalanceMessage('*Minimum transfer amount: 63 CKB');
        }
        let validAddress = true;
        if (L1Address) {
            try {
                parseAddress(L1Address);
                setConfirmText('CONFIRM TRANSFER');
            } catch (err) {
                validAddress = false;
                setConfirmText('INVALID ADDRESS');
                setAddressMessage('*Invalid address');
            }
        }

        if (!selectBalance) {
            setConfirmText('ENTER TRANSFER AMOUN');
            return;
        }
        if (!L1Address) {
            setConfirmText('ENTER ADDRESS');
            return;
        }
        if (_selectAmount.lt(minAmount)) {
            setConfirmText('MINIMUM 63 CKB');
            return;
        }
        setCanTransfer(validAddress);
    }, [selectBalance, L1Address, minAmount]);

    return (
        <>
            <div className={`transfer-ckb popup-container ${show && 'show'}`} onClick={close}>
                <div
                    className="t-bg"
                    onClick={e => {
                        e.stopPropagation();
                    }}
                >
                    <div className="t-content">
                        <div className="title">L1 CKB Transfer</div>
                        <div className="transfer-c">
                            <div className="top">
                                <div className="t-title">Transfer</div>
                                <div
                                    className="max cursor"
                                    onClick={() => {
                                        const _balance = new Amount(balance);
                                        setSelectBalance(_balance.sub(gasFee as Amount).toString());
                                    }}
                                >
                                    MAX: {balance}
                                </div>
                            </div>
                            <div className="bottom">
                                <div className="input">
                                    <input
                                        type="number"
                                        placeholder="0.0"
                                        value={selectBalance}
                                        onChange={e => {
                                            if (new Amount(e.target.value).gt(new Amount(balance)))
                                                setSelectBalance(balance);
                                            else setSelectBalance(e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="text">CKB</div>
                            </div>
                            <div className="gas-fee">{`Gas Fee ${gasFee} CKB`}</div>
                        </div>
                        {balanceMessage && <div className="error-message">{balanceMessage}</div>}
                        <div className="arrow-c">
                            <img className="arrow" src={ArrowIcon} alt="ArrowIcon" />
                        </div>
                        <div className="recipient-c">
                            <div className="top">
                                <div className="t-title">Recipient</div>
                            </div>
                            <div className="bottom">
                                <div className="input">
                                    <div className="hidden-c">{L1Address}</div>
                                    <textarea
                                        value={L1Address}
                                        placeholder="L1 CKB Address"
                                        maxLength={300}
                                        onChange={e => {
                                            setL1Address(e.target.value);
                                        }}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        {addressMessage && <div className="error-message">{addressMessage}</div>}
                        <div className="btn-groups">
                            <button
                                className={`btn confirm-btn cursor ${canTransfer && 'active'}`}
                                onClick={() => {
                                    if (!canTransfer) return;
                                    const remain = new Amount(balance)
                                        .sub(new Amount(selectBalance))
                                        .sub(gasFee as Amount);
                                    console.log('remain', remain);
                                    if (remain.lt(minAmount as Amount) && remain.gt(zeroAmount as Amount)) {
                                        setShowTransferConfirm(true);
                                    } else {
                                        close();
                                        doTransferCKB(L1Address, selectBalance);
                                    }
                                }}
                            >
                                {confirmText}
                            </button>
                            <button className="btn cancel-btn cursor" onClick={close}>
                                CANCEL
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <TransferConfirm
                useMaxAmount={() => {
                    setShowTransferConfirm(false);
                    const _balance = new Amount(balance);
                    setSelectBalance(_balance.sub(gasFee as Amount).toString());
                }}
                show={showTransferConfirm}
                close={() => {
                    setShowTransferConfirm(false);
                }}
            ></TransferConfirm>
        </>
    );
}
