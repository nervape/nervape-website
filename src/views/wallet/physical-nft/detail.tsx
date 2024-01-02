import React, { useContext, useEffect, useState } from 'react';
import { DataContext, parseBalance } from '../../../utils/utils';

import DetailCloseIcon from '../../../assets/images/nft/close_detail.svg';
import FullscrenIcon from '../../../assets/images/nft/fullscreen.svg';
import OpenseaLogo from '../../../assets/logo/opensea_logo.svg';

import './detail.less';
import { Physical_NFT } from '../../../nervape/physical-nft';

export default function NftCardDetail(props: {
    show: boolean;
    nft: Physical_NFT;
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
                            <div className="name">{`${nft.name} #${nft.token_index}`}</div>

                            <div className="attributes attributes-1 flex">
                                <div className="range flex-1">
                                    <div className="text">ID</div>
                                    <div className="value">{nft.token_index}</div>
                                </div>
                            </div>
                            <div className={`description`}>
                                {nft.description}
                            </div>
                            <div className="btn-groups">
                                <button
                                    className="opensea-btn cursor"
                                    onClick={() => {
                                        window.open('https://app.joy.id/?asset=Collectible', '_blank')
                                    }}
                                >
                                    <img src={OpenseaLogo} alt="OpenseaLogo" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
