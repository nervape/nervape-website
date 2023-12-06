import { BigNumberish } from 'ethers';
import React, { useContext, useEffect, useState } from 'react';
import { writeContract } from '@wagmi/core';
import { ContractMap, NFT } from '../../../utils/nft-utils';
import { DataContext, parseBalance } from '../../../utils/utils';
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
import { useNetwork } from 'wagmi';
import { JOYID_NFT } from '.';

export default function NftCardDetail(props: {
    show: boolean;
    nft: JOYID_NFT;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    close: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fullscreen: any;
}) {
    const {
        show,
        nft,
        close,
        fullscreen
    } = props;

    const { state } = useContext(DataContext);

    if (!nft) return <></>;

    return (
        <>
            <div className={`wallet-nft-card-detail-container popup-container ${show && 'show'}`} onClick={close}>
                <div className="popup-content nft-card-detail" onClick={e => e.stopPropagation()}>
                    <div className="preview-model">
                        <img className='cover-image-url' src={nft.image} alt="" />
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
                    <div className="detail-info m">
                        <div className="info-content">
                            <div className="name">{nft.name}</div>

                            <div className="attributes attributes-1 flex">
                                <div className="range flex-1">
                                    <div className="text">ID</div>
                                    <div className="value">{parseBalance(nft.token_index, 0)}</div>
                                </div>
                                <div className="origin flex-1">
                                    <div className="text">Number of Participant</div>
                                    <div className="value">900</div>
                                </div>
                            </div>
                            <div className="attributes flex">
                                <div className="type flex-1">
                                    <div className="text">Event Period</div>
                                    <div className="value">11/15/2023 - 11/20/2023</div>
                                </div>
                            </div>
                            <div className={`description`}>
                                {nft.description}
                            </div>
                            <div className="btn-groups">
                                <button
                                    className="btn cursor"
                                    onClick={() => {
                                        window.open('https://app.joy.id/?asset=Collectible', '_blank')
                                    }}
                                >
                                    VIEW ON NFT BOX
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
