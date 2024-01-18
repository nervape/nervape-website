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
import { nervapeApi } from "../../../api/nervape-api";

let timer: any = null;

export default function WalletPhysicalNft(props: any) {
    const { state, dispatch } = useContext(DataContext);
    const { isFold, setLoading } = props;

    const [isInit, setIsInit] = useState(false);
    const [showNftCard, setShowNftCard] = useState(false);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [showPhysicalClaim, setShowPhysicalClaim] = useState(false);
    const [physicalNfts, setPhysicalNfts] = useState<Physical_NFT[]>([]);
    const [nftDetail, setNftDetail] = useState<Physical_NFT>();

    const fetchAllTokenIds = useFetchPhysicalNFTIds(state.currentAddress, 5);

    async function fnFetchAllTokenIds() {
        setLoading(true);
        let _res = await nervapeApi.fnGetPhysicalNfts(state.currentAddress);
        const res = await fetchAllTokenIds();
        let _nfts: Physical_NFT[] = [];
        let refresh = false;

        await Promise.all(res.map(async (token_id: number) => {
            const metadata = await fnGetMetadata(token_id);
            metadata.status = ClaimStatus.MINTED;
            _nfts.push(metadata);
        }));

        _res = _res.filter((nft: any) => {
            return !res.includes(nft.token_id.toString());
        });

        await Promise.all(_res.map(async (nft: any) => {
            refresh = true;
            const metadata = await fnGetMetadata(nft.token_id);
            metadata.status = ClaimStatus.PENDING;
            _nfts.push(metadata);
        }))

        setPhysicalNfts(_nfts);
        setLoading(false);
        setIsInit(true);

        if (refresh) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            
            timer = setTimeout(() => {
                fnFetchAllTokenIds();
            }, 8000);

            console.log('fnFetchAllTokenIds', timer);
        }
    }

    async function fnGetMetadata(token_id: number) {
        return await nervapeApi.fnGetMetadataByTokenId('naaf', token_id)
    }

    useEffect(() => {
        fnFetchAllTokenIds();

        return () => {
            console.log('fnFetchAllTokenIds', timer);

            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
        }
    }, []);

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
                    {nft.name.split('#')[0]}
                </div>
                <div className="id">{`#${nft.token_index || nft.id}`}</div>
            </div>
        );
    }

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
                refresh={() => { fnFetchAllTokenIds(); }}
                setPhysicalClaim={setShowPhysicalClaim}
            ></PhysicalNftClaim>
        </div>
    );
}
