/* eslint-disable no-nested-ternary */
import React from 'react';
import './detail.less';
import { CONFIG } from '../../../utils/config';
import { getWindowWidthRange } from '../../../utils/utils';
import { HISTORY, HISTORY_NFT, TransferType, TRANSFER_STATUS_STRING } from './history';
import { LoginWalletType } from '../../../utils/Wallet';

export const contractAddress = new Map<string, string>();
contractAddress.set("character", CONFIG.L2_CHARACTER_ADDRESS as string);
contractAddress.set("scene", CONFIG.L2_SCENE_ADDRESS as string);
contractAddress.set("item", CONFIG.L2_ITEM_ADDRESS as string);
contractAddress.set("special", CONFIG.L2_SPECIAL_ADDRESS as string);

export default function HistoryDetail(props: {
    close: Function;
    history: HISTORY;
    loginWalletType: LoginWalletType;
    show: boolean;
    address: string;
}) {
    const { close, history, loginWalletType, show, address } = props;
    const widthRange = getWindowWidthRange();

    function formatTime(time: number) {
        const date = new Date(time * 1000);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        if (widthRange !== 375) {
            return `${year}/${month > 9 ? month : `0${month}`}/${day > 9 ? day : `0${day}`} ${
                hour > 9 ? hour : `0${hour}`
            }:${minute > 9 ? minute : `0${minute}`}:${second > 9 ? second : `0${second}`}`;
        }
        return (
            <>
                <div className="time-line">{`${year}/${month > 9 ? month : `0${month}`}/${
                    day > 9 ? day : `0${day}`
                }`}</div>
                <div className="time-line">{`${hour > 9 ? hour : `0${hour}`}:${
                    minute > 9 ? minute : `0${minute}`
                }:${second > 9 ? second : `0${second}`}`}</div>
            </>
        );
    }

    function formatTxHash(txHash: string) {
        const subLength = widthRange !== 375 ? 10 : 5;
        return `${txHash.substr(0, subLength)}...${txHash.substr(
            txHash.length - subLength,
            subLength
        )}`;
    }

    function formatTokenId(tokenId: number) {
        if (tokenId < 10) return `00${tokenId}`;
        if (tokenId < 100) return `0${tokenId}`;
        return tokenId;
    }

    function showType() {
        if (loginWalletType !== LoginWalletType.UNIPASS_V3) {
            if (history.transferType !== TransferType.TRANSFER)
                return history.transferType?.toLowerCase();
            if (address === history.from) return 'send';
            return 'receive';
        }
        return history.type;
    }

    const UnipassCKB = () => {
        return (
            <div className="row one nft-row">
                <div className="label bridged-nft">
                    {history?.type?.includes('send') ? 'Sent Amount' : 'Received Amount'}:
                </div>
                <div className="nfts">
                    <div className="ckb">{history?.amount} CKB</div>
                </div>
            </div>
        );
    };

    const UnipassNfts = () => {
        return (
            <div className="row one nft-row unipass-nfts">
                <div className="label bridged-nft">Bridged NFT(s):</div>
                <div className="nfts">
                    {history.nfts &&
                        history.nfts.map((nft: HISTORY_NFT, index: number) => (
                            <div className="nft" key={index}>
                                <div
                                    className="span cursor"
                                    onClick={() => {
                                        // eslint-disable-next-line no-useless-return
                                        if (!nft.to_chain_token_id) return;
                                        const _address = `${CONFIG.BRIDGE_L2_TX_ADDRESS}nft-item/${
                                            contractAddress.get(nft?.to_chain_class_type.toLocaleLowerCase())
                                        }/${nft.to_chain_token_id}`;
                                        window.open(_address);
                                    }}
                                >
                                    {`${nft.from_chain_class_name} #${formatTokenId(
                                        nft.from_chain_token_id
                                    )}`}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        );
    };

    const MetamaskNft = () => {
        return (
            <div className="row one nft-row">
                <div className="label bridged-nft">NFT:</div>
                <div className="nfts">
                    <div className="nft">
                        <div
                            className="span cursor"
                            onClick={() => {
                                // eslint-disable-next-line no-useless-return
                                if (!history.tokenId) return;
                                const _address = `${CONFIG.BRIDGE_L2_TX_ADDRESS}nft-item/${history.contract}/${history.tokenId}`;
                                window.open(_address);
                            }}
                        >
                            <p>{history.name}</p>
                            <p>{`#${formatTokenId(history.tokenId)}`}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div
            className={`history-detail popup-container ${show && 'show'}`}
            onClick={() => {
                close();
            }}
        >
            <div
                className="bg"
                onClick={e => {
                    e.stopPropagation();
                }}
            >
                {history && (
                    <div className="detail-content">
                        <div className="row">
                            <div className="left status">
                                <div className="label">Timestamp:</div>
                                <div className="value">
                                    {history.timestamp ? formatTime(history.timestamp) : '/'}
                                </div>
                            </div>
                            <div className="right last-update">
                                <div className="label">Status:</div>{' '}
                                {loginWalletType === LoginWalletType.METAMASK
                                    ? TRANSFER_STATUS_STRING[history.status]
                                    : history.status}
                            </div>
                        </div>
                        {/* <div className="row">
                            <div className="left status">
                                <div className="label">Date:</div>{' '}
                                <div className="value">
                                    {history.submittedAt ? formatTime(history.submittedAt) : '/'}
                                </div>
                            </div>
                            <div className="right last-update">
                                <div className="label">Last Update:</div>{' '}
                                <div className="value">
                                    {history.timestamp ? formatTime(history.timestamp) : '/'}
                                </div>
                            </div>
                        </div> */}
                        <div className="row flex">
                            <div className="left type">
                                <div className="label">Type:</div>
                                <div className="value">{showType()}</div>
                            </div>
                            {(loginWalletType === LoginWalletType.METAMASK ||
                                history.type !== 'NFT bridge') && (
                                <div className="right bridge-no">
                                    <div className="label">TX:</div>
                                    <div className="value">
                                        {history.txHash ? (
                                            <a
                                                target="_blank"
                                                href={`${
                                                    history.type && history.type.includes('CKB')
                                                        ? CONFIG.BRIDGE_L1_TX_ADDRESS
                                                        : `${CONFIG.BRIDGE_L2_TX_ADDRESS}tx`
                                                }/${history.txHash}`}
                                            >
                                                {formatTxHash(history.txHash)}
                                            </a>
                                        ) : (
                                            '/'
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        {loginWalletType === LoginWalletType.UNIPASS_V3 &&
                            history.type === 'NFT bridge' && (
                                <div className="row flex">
                                    <div className="left bridge-no">
                                        <div className="label">L1 TX:</div>
                                        <div className="value">
                                            <a
                                                target="_blank"
                                                href={`${CONFIG.BRIDGE_L1_TX_ADDRESS}/${history.fromTxHash}`}
                                            >
                                                {formatTxHash(history.fromTxHash || '')}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="right bridge-no">
                                        <div className="label">L2 TX:</div>
                                        <div className="value">
                                            {history.txHash ? (
                                                <a
                                                    target="_blank"
                                                    href={`${CONFIG.BRIDGE_L2_TX_ADDRESS}tx/${history.txHash}`}
                                                >
                                                    {formatTxHash(history.txHash)}
                                                </a>
                                            ) : (
                                                '/'
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        <div className="row one receipient">
                            <div className="label name">
                                {loginWalletType === LoginWalletType.UNIPASS_V3 &&
                                history.type === 'NFT bridge'
                                    ? 'Destination Address'
                                    : history.transferType === TransferType.TRANSFER &&
                                      address === history.from
                                    ? 'To'
                                    : 'From'}
                                :
                            </div>
                            <div className="value">
                                {(loginWalletType === LoginWalletType.UNIPASS_V3 &&
                                    history.type === 'NFT bridge') ||
                                (history.transferType === TransferType.TRANSFER &&
                                    address === history.from)
                                    ? history.to || '/'
                                    : history.from || '/'}
                            </div>
                        </div>
                        {loginWalletType !== LoginWalletType.UNIPASS_V3
                            ? MetamaskNft()
                            : history.type === 'NFT bridge'
                            ? UnipassNfts()
                            : UnipassCKB()}
                    </div>
                )}
            </div>
        </div>
    );
}
