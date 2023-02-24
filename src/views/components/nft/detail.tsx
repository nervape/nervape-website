import { BigNumberish } from 'ethers';
import React, { useContext, useState } from 'react';
import { writeContract } from '@wagmi/core';
import { ContractMap, NFT } from '../../../utils/nft-utils';
import { DataContext } from '../../../utils/utils';
import { LoginWalletType } from '../../../utils/Wallet';
import Nervape_ABI from '../../../contracts/Nervape.json';

import LoadingGif from '../../../assets/images/nft/loading.gif';
import DetailCloseIcon from '../../../assets/images/nft/close_detail.svg';
import FullscrenIcon from '../../../assets/images/nft/fullscreen.svg';
import TransferIcon from '../../../assets/images/nft/transfer.svg';
import CloseIcon from '../../../assets/images/bridge/close.png';
import { CONFIG } from '../../../utils/config';

import './detail.less';
import { insertHistories } from '../../../utils/api';
import { godWoken } from '../../../utils/Chain';

function Message(props: { message: string }) {
    const {message} = props;
    return <div className="message">{message}</div>;
}

// 预览 3D 模型
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PreviewModel(props: any) {
    const { enableModuleUrl } = props;
    return (
        <model-viewer
            class="model-viewer-class"
            id="reveal"
            // reveal="interaction"
            loading="eager"
            camera-controls
            auto-rotate
            src={enableModuleUrl}
            ar-modes="webxr scene-viewer quick-look"
            // environment-image="shared-assets/environments/moon_1k.hdr"
            seamless-poster
            shadow-intensity="1"
        >
            <div className="model-loading" slot="poster">
                <img loading="lazy" className="model-loading-gif" src={LoadingGif} alt="" />
            </div>
        </model-viewer>
    );
}

export default function NftCardDetail(props: {
    nft: NFT;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    close: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fullscreen: any;
    switchChain: boolean;
    address: string;
    loginWalletType: LoginWalletType;
    setLoading: Function;
    showTransferSuccess: Function;
}) {
    const {
        nft,
        close,
        fullscreen,
        switchChain,
        loginWalletType,
        address,
        setLoading,
        showTransferSuccess
    } = props;
    const [isTransfer, setIsTransfer] = useState(false);
    const [messages, setMessages] = useState<string[]>([]);
    const [showMessages, setShowMessages] = useState(false);
    const [receiverAddress, setReceiverAddress] = useState('');
    const { state } = useContext(DataContext);

    async function fnTransferFrom(to: string, tokenId: BigNumberish) {
        setLoading(true);
        try {
            
        } catch (error) {
            console.log(error);
        }
        const { hash } = await writeContract({
            mode: 'recklesslyUnprepared',
            address: ContractMap[nft.type],
            abi: Nervape_ABI,
            functionName: 'transferFrom',
            args: [address, to, tokenId],
            chainId: godWoken.id
        });
        console.log('WALLET_CONNECT', hash);
        if (hash) {
            await insertHistories(address, to, hash, tokenId as number);
            close();
            showTransferSuccess(true);
        }
        setLoading(false);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function updateToAddress(e: any) {
        setReceiverAddress(e.target.value);
    }

    return (
        <>
            <div className="nft-card-detail-container mask-cover" onClick={close}>
                <div className="nft-card-detail" onClick={e => e.stopPropagation()}>
                    <div className="preview-model">
                        <PreviewModel enableModuleUrl={nft.renderer}></PreviewModel>
                        {state.windowWidth !== 1200 && (
                            <div className="close-detail-c">
                                <img
                                    loading="lazy"
                                    onClick={close}
                                    className="close-detail cursor"
                                    src={DetailCloseIcon}
                                    alt="DetailCloseIcon"
                                />
                            </div>
                        )}
                        <div className="fullscreen-c">
                            <img
                                loading="lazy"
                                onClick={fullscreen}
                                className="full-screen cursor"
                                src={FullscrenIcon}
                                alt="FullscrenIcon"
                            />
                        </div>
                    </div>
                    <div className="detail-info m" style={{ background: nft.card_background }}>
                        {!isTransfer ? (
                            <div className="info-content">
                                <div className="name">{nft.name.replace(/Nervape \//g, '')}</div>
                                <div className="chain">
                                    <span>
                                        {loginWalletType === LoginWalletType.UNIPASS_V3
                                            ? 'NERVOS L1'
                                            : 'GODWOKEN'}
                                    </span>
                                </div>
                                {loginWalletType !== LoginWalletType.UNIPASS_V3 && (
                                    <div className="contract range flex-1">
                                        <div className="text">Contract</div>
                                        <div className="value">{ContractMap[nft.type]}</div>
                                    </div>
                                )}
                                <div className="attributes attributes-1 flex">
                                    <div className="range flex-1">
                                        <div className="text">ID</div>
                                        <div className="value">{nft.showId}</div>
                                    </div>
                                    <div className="origin flex-1">
                                        <div className="text">Origin</div>
                                        <div className="value">{nft.origin}</div>
                                    </div>
                                </div>
                                <div className="attributes flex">
                                    {nft.type === 'Character' && (
                                        <>
                                            <div className="name flex-1">
                                                <div className="text">Name</div>
                                                <div className="value">{nft.short_name}</div>
                                            </div>
                                            <div className="birthday flex-1">
                                                <div className="text">Birthday</div>
                                                <div className="value">
                                                    {nft.birthday &&
                                                        nft.birthday.replace(/-/g, '/')}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    <div className="type flex-1">
                                        <div className="text">Type</div>
                                        <div className="value">{nft.type}</div>
                                    </div>
                                </div>
                                <div className={`description ${loginWalletType}`}>
                                    {nft.description}
                                </div>
                                {loginWalletType !== LoginWalletType.UNIPASS_V3 && (
                                    <div className="btn-groups">
                                        <button
                                            className="btn cursor"
                                            onClick={() => {
                                                window.open(
                                                    `${(nft.yokaiUrl || CONFIG.YOKAI_URL) +
                                                        ContractMap[nft.type]}/${nft.showId}`
                                                );
                                            }}
                                        >
                                            VIEW ON YOKAI
                                        </button>
                                        {!switchChain && (
                                            <button
                                                className="btn cursor"
                                                onClick={() => {
                                                    // transfer
                                                    setIsTransfer(true);
                                                }}
                                            >
                                                <img src={TransferIcon} alt="" />
                                                TRANSFER
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="info-content transfer-content">
                                <div className="title">Transfer NFT</div>
                                <div className="name">{nft.name.replace(/Nervape \//g, '')}</div>
                                <div className="attributes attributes-1 flex">
                                    <div className="range flex-1">
                                        <div className="text">ID</div>
                                        <div className="value">{nft.showId}</div>
                                    </div>
                                </div>
                                <div className="destination">
                                    <div className="text">Destination</div>
                                    <div className="value">
                                        <input
                                            type="text"
                                            value={receiverAddress}
                                            onInput={e => {
                                                updateToAddress(e);
                                            }}
                                            onChange={e => {
                                                updateToAddress(e);
                                            }}
                                            placeholder="Destination Address"
                                        />
                                    </div>
                                </div>
                                <div className="btn-groups">
                                    <button
                                        className="btn cursor"
                                        onClick={() => {
                                            // 验证
                                            const _messages: string[] = [];
                                            const regex = /^0x[0-9a-fA-F]{40}$/;
                                            if (!regex.test(receiverAddress)) {
                                                _messages.push(
                                                    '- The entered address invalid. Please enter a Godwoken address.'
                                                );
                                            }
                                            setMessages(_messages);
                                            setShowMessages(_messages.length > 0);
                                            if (!_messages.length) {
                                                fnTransferFrom(receiverAddress, nft.showId as BigNumberish);
                                            }
                                        }}
                                    >
                                        CONFIRM TRANSFER
                                    </button>
                                    <button
                                        className="btn cursor cancel"
                                        onClick={() => {
                                            // transfer
                                            setIsTransfer(false);
                                        }}
                                    >
                                        CANCEL
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className={`messages ${showMessages && 'show'}`}>
                <div className="message-content">
                    <img
                        src={CloseIcon}
                        className="close"
                        onClick={() => {
                            setShowMessages(false);
                        }}
                    />
                    {messages.map((message, i) => (
                        <Message key={i} message={message}></Message>
                    ))}
                </div>
            </div>
        </>
    );
}
