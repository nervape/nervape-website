import React, { useContext, useEffect, useState } from "react";
import './index.less';
import { DataContext, parseBalance, updateBodyOverflow } from "../../../utils/utils";
import { ClaimStatus, Physical_NFT } from "../../../nervape/physical-nft";
import NftEmptyIcon from '../../../assets/wallet/nft/nft_empty.png';
import { FullscreenPreview } from "../co-created";
import NftCardDetail from "./detail";
import { Types } from "../../../utils/reducers";
import PhysicalNftClaim from "./claim";
import { useFetchPhysicalNFTIds } from "../../../hooks/useERC721";

export default function WalletPhysicalNft(props: any) {
    const { state, dispatch } = useContext(DataContext);
    const { isFold, setLoading } = props;

    const fetchAllTokenIds = useFetchPhysicalNFTIds(state.currentAddress, 5);

    async function fnFetchAllTokenIds() {
        setLoading(true);
        const res = await fetchAllTokenIds();
        console.log("res = ", res)
        setLoading(false);
    }
    useEffect(() => {
        fnFetchAllTokenIds()
    }, [])

    const [isInit, setIsInit] = useState(false);
    const [showNftCard, setShowNftCard] = useState(false);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [showPhysicalClaim, setShowPhysicalClaim] = useState(false);
    const [physicalNfts, setPhysicalNfts] = useState<Physical_NFT[]>([]);
    const [nftDetail, setNftDetail] = useState<Physical_NFT>();

    const NFTItem = (props: { nft: Physical_NFT; showDetail: Function; }) => {
        const { nft, showDetail } = props;

        return (
            <div className="nft-item cursor" onClick={() => { 
                if (!nft.status || nft.status == ClaimStatus.PENDING) return;

                showDetail();
             }}>
                <div className="cover-image">
                    <img
                        src={`${nft.image}?x-oss-process=image/resize,h_100,m_lfit`}
                        alt=""
                    />
                    {(!nft.status || nft.status == ClaimStatus.PENDING) && (
                        <div className="cover-tip">Receiving...</div>
                    )}
                </div>
                <div className="name" title={nft.name}>
                    {nft.name}
                </div>
                <div className="id">{`#${nft.token_index}`}</div>
            </div>
        );
    }

    useEffect(() => {
        setIsInit(true);
        setPhysicalNfts([
            {
               name: 'Spooky Nervape',
               image: 'https://nervape-storage.s3.ap-southeast-1.amazonaws.com/album-dev/production/d481128c-d532-49a4-846a-43a7ec4ab678.png',
               description: 'A winner’s reward for 2023 Halloween Event - Spooky Nervape',
               token_index: 70010001,
               status: ClaimStatus.MINTED
            }
        ]);
    }, []);

    if (!isInit) return <></>;

    return (
        <div className="wallet-physical-nft-container">
            <div className="wallet-physical-nft-header transition position-sticky flex-align">
                <div className="co-created-title">Physical NFT</div>
                <div className="claim-btn cursor" onClick={() => { setShowPhysicalClaim(true); }}>CLAIM</div>
            </div>

            <div className="wallet-physical-nft-content">
                {physicalNfts.length ? (
                    <div className="wallet-nft-3ds flex-align">
                        {physicalNfts.map((filter, index) => {
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
                                <p>You currently don’t have any Physical NFT.</p>
                                <p>Obtain a claim codes by winning physical Nervapes through events!</p>
                            </div>

                            <div className="claim-btn cursor" onClick={() => { setShowPhysicalClaim(true); }}>I HAVE A CLAIM CODE</div>
                        </div>
                    </div>
                )}
            </div>

            <NftCardDetail
                show={showNftCard}
                nft={nftDetail as Physical_NFT}
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

            <PhysicalNftClaim
                show={showPhysicalClaim}
                setLoading={setLoading}
                setPhysicalClaim={setShowPhysicalClaim}
            ></PhysicalNftClaim>
        </div>
    );
}
