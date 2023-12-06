import React, { useContext, useEffect, useState } from "react";
import './index.less';
import { DataContext, parseBalance, updateBodyOverflow } from "../../../utils/utils";
import { nervapeApi } from "../../../api/nervape-api";
import JoyIdNfts, { cotaId } from "../../../utils/joyid-nfts";
import NftEmptyIcon from '../../../assets/wallet/nft/nft_empty.png';
import DetailCloseIcon from '../../../assets/images/nft/close_detail.svg';
import NftCardDetail from "./detail";
import { Types } from "../../../utils/reducers";

export class JOYID_NFT {
    audio: string = "";
    audios: any[] = [];
    characteristic: string = "";
    configure: string = "";
    cota_id: string = "";
    description: string = "";
    image: string = "";
    meta_characteristic: string = "";
    model: string = "";
    name: string = "";
    properties: string = "";
    state: string = "";
    symbol: string = "";
    token_index: string = "";
    video: string = "";
}

// 全屏预览
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FullscreenPreview(props: { nft?: JOYID_NFT; close: any; show: boolean; }) {
    const { nft, close, show } = props;

    return (
        <div className={`fullscreen-container transition mask-cover ${show && 'show'}`}>
            <div className="fullscreen-image-cover">
                <img className="fullscreen-image" src={nft?.image} alt="fullscreen-image" />
            </div>
            
            <div className="close-c cursor" onClick={close}>
                <img
                    loading="lazy"
                    className="close-icon transform-center"
                    src={DetailCloseIcon}
                    alt="IconPreviewClose"
                />
            </div>
        </div>
    );
}

export default function WalletCoCreatedNFT(props: any) {
    const { state, dispatch } = useContext(DataContext);
    const { isFold, setLoading } = props;

    const [createdNfts, setCreatedNfts] = useState<JOYID_NFT[]>([]);
    const [isInit, setIsInit] = useState(false);
    const [showNftCard, setShowNftCard] = useState(false);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [nftDetail, setNftDetail] = useState<JOYID_NFT>();

    async function fnGetJoyIdNfts() {
        setLoading(true);
        const result = await JoyIdNfts(state.currentAddress);
        console.log('fnGetJoyIdNfts', result);
        const filters = result.nfts.filter((t: JOYID_NFT) => t.cota_id == cotaId)

        setCreatedNfts(filters);
        setLoading(false);
        setIsInit(true);
    }

    useEffect(() => {
        fnGetJoyIdNfts();
    }, []);

    const NFTItem = (props: { nft: JOYID_NFT; showDetail: Function; }) => {
        const { nft, showDetail } = props;

        return (
            <div className="nft-item cursor" onClick={() => { showDetail() }}>
                <div className="cover-image">
                    <img
                        src={`${nft.image}?x-oss-process=image/resize,h_100,m_lfit`}
                        alt=""
                    />
                </div>
                <div className="name" title={nft.name}>
                    {nft.name}
                </div>
                <div className="id">{`#${parseBalance(nft.token_index, 0)}`}</div>
            </div>
        );
    }

    if (!isInit) return <></>;
    return (
        <div className="wallet-co-created-nft-container">
            <div className="wallet-co-created-nft-header transition position-sticky flex-align">
                <div className="co-created-title">Co-Created NFT</div>
            </div>

            <div className="wallet-co-created-nft-content">
                {createdNfts.length ? (
                    <div className="wallet-nft-3ds flex-align">
                        {createdNfts.map((filter, index) => {
                            return <NFTItem
                                showDetail={() => {
                                    setShowNftCard(true);
                                    updateBodyOverflow(false);
                                    if (state.windowWidth <= 375) {
                                        dispatch({
                                            type: Types.IsVisibleHeader,
                                            value: false
                                        })
                                    }
                                    setNftDetail(filter);
                                }}
                                key={`${index}`}
                                nft={filter}></NFTItem>;
                        })}
                    </div>
                ) : (
                    <div className="no-result flex-center">
                        <div className="no-result-content">
                            <div className="cover-image">
                                <img src={NftEmptyIcon} alt="NftEmptyIcon" />
                            </div>
                            <div className="tip">
                                <p>It’s empty…you currently don’t have any Collab NFTs.</p>
                                <p>Stay tuned and participate in co-creative events to add them here!</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <NftCardDetail
                show={showNftCard}
                nft={nftDetail as JOYID_NFT}
                close={() => {
                    setShowNftCard(false);
                    updateBodyOverflow(true);
                }}
                fullscreen={() => {
                    setShowNftCard(false);
                    setShowFullscreen(true);
                }}
            ></NftCardDetail>
            <FullscreenPreview
                show={showFullscreen}
                nft={nftDetail}
                close={() => {
                    setShowFullscreen(false);
                    updateBodyOverflow(true);
                }}
            ></FullscreenPreview>
        </div>
    );
}
