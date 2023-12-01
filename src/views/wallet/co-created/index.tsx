import React, { useContext, useEffect, useState } from "react";
import './index.less';
import { DataContext, updateBodyOverflow } from "../../../utils/utils";
import { nervapeApi } from "../../../api/nervape-api";
import JoyIdNfts from "../../../utils/joyid-nfts";
import NftEmptyIcon from '../../../assets/wallet/nft/nft_empty.png';
import DetailCloseIcon from '../../../assets/images/nft/close_detail.svg';
import NftCardDetail from "./detail";
import { Types } from "../../../utils/reducers";

export class JOYID_NFT {
    class_cover_image_url: string = '';
    class_description: string = '';
    class_name: string = '';
    issuer_avatar_url: string = '';
    issuer_name: string = '';
    n_token_id: number = 0;
    on_chain_at_timestamp: number = 0;
    renderer_type: string = '';
    script_type: string = '';
    token_key: string = '';
}

// 全屏预览
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FullscreenPreview(props: { nft?: JOYID_NFT; close: any; show: boolean; }) {
    const { nft, close, show } = props;

    return (
        <div className={`fullscreen-container transition mask-cover ${show && 'show'}`}>
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
        JoyIdNfts(state.currentAddress);
        setLoading(true);
        const res = await nervapeApi.fnGetJoyIdNfts(state.currentAddress);
        console.log('fnGetJoyIdNfts', res);
        const filters = res.tokens.filter((t: JOYID_NFT) => t.issuer_name == 'Nervape')

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
                        src={`${nft.class_cover_image_url}?x-oss-process=image/resize,h_100,m_lfit`}
                        alt=""
                    />
                </div>
                <div className="name" title={nft.class_name}>
                    {nft.class_name}
                </div>
                <div className="id">{`#${nft.n_token_id}`}</div>
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
                                <p>You currently don’t have any Co-Created NFT</p>
                                <p>Stay tuned and participate in co-creative events!</p>
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
