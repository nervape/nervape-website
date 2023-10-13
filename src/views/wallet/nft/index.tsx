import React, { useContext, useEffect, useState } from "react";
import './index.less';
import { ContractMap, NFT, NFT_TYPE_VALUE } from "../../../utils/nft-utils";
import { DataContext } from "../../../utils/utils";
import { LoginWalletType } from "../../../utils/Wallet";
import useFetchAllTokenIds from "../../../hooks/useERC721";
import { Address, AddressType } from "@lay2/pw-core";
import { getNFTsAtAddress } from "../../../utils/api";
import { updateBodyOverflow } from "../../../utils/utils";
import NftCardDetail, { PreviewModel } from "../../components/nft/detail";

import DetailCloseIcon from '../../../assets/images/nft/close_detail.svg';
import NftEmptyIcon from '../../../assets/wallet/nft/nft_empty.png';
import { Types } from "../../../utils/reducers";
import { CONFIG } from "../../../utils/config";

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            'model-viewer': React.DetailedHTMLProps<any, any>;
        }
    }
}

// 全屏预览
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FullscreenPreview(props: { nft?: NFT; close: any; show: boolean; }) {
    const { nft, close, show } = props;

    return (
        <div className={`fullscreen-container transition mask-cover ${show && 'show'}`}>
            <PreviewModel enableModuleUrl={nft?.renderer} id="fullscreen"></PreviewModel>
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

export default function WalletNFT3D(props: any) {
    const {
        isFold,
        nftCoverImages,
        setLoading,
        setShowTransferSuccess } = props;

    const { state, dispatch } = useContext(DataContext);

    const [types, setTypes] = useState(['All', 'Character', 'Item', 'Scene', 'Special']);
    const [selectedType, setSelectedType] = useState('All');
    const [tokenIds, setTokenIds] = useState<string[]>([]);
    const [nfts, setNfts] = useState<NFT[]>([]);
    const [filterNfts, setFilterNfts] = useState<NFT[]>([]);

    const [showNftCard, setShowNftCard] = useState(false);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [nftDetail, setNftDetail] = useState<NFT>();

    const fetchAllTokenIds = useFetchAllTokenIds(state.currentAddress);

    async function fnFetchAllTokenIds() {
        setLoading(true);
        const res = await fetchAllTokenIds();
        setTokenIds(res);
    }

    function formatTokenId(tokenId: number) {
        if (tokenId < 10) return `00${tokenId}`;
        if (tokenId < 100) return `0${tokenId}`;
        return tokenId;
    }

    function getNftTypeByName(filterName: string) {
        const _filterNfts = nftCoverImages.filter(({ name }: { name: string }) => name === filterName);
        if (_filterNfts.length) {
            return _filterNfts[0];
        }
        return null;
    }

    async function fetchMNFTs() {
        setNfts([]);
        try {
            const _address = new Address(state.currentAddress, AddressType.ckb);
            const _MNFTs = await getNFTsAtAddress(_address);
            const _processedMNFTs: NFT[] = [];
            await Promise.all(_MNFTs.map(async token => {
                await token.getConnectedClass();
                await token.getConnectedIssuer();

                const classData = token.getClassData();

                const nft = getNftTypeByName(classData?.name.replace('Nervape / ', ''));
                if (nft) {
                    const { tokenId } = token.getTypeScriptArguments();
                    _processedMNFTs.push({
                        ...nft,
                        showId: tokenId.toString(),
                        formatId: `#${formatTokenId(tokenId)}`
                    });
                }
            }));
            setNfts(_processedMNFTs);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
        setLoading(false);
    }

    async function fetchERC721NFTS() {
        setNfts([]);
        try {
            const _processedMNFTs: NFT[] = [];
            tokenIds.forEach(tokenId => {
                // 查询 class_id 对应 address
                const class_name = parseInt(tokenId.substring(0, 4)) % 1000;
                const typeId = Math.round(parseInt(tokenId.substring(0, 4)) / 1000);

                const _nft = nftCoverImages.filter((nft: { address: string; type: string | number; }) => {
                    return (
                        nft.address === class_name.toString() &&
                        parseInt(NFT_TYPE_VALUE[nft.type]) === typeId
                    );
                });
                if (_nft.length) {
                    _processedMNFTs.push({
                        ..._nft[0],
                        showId: tokenId,
                        formatId: `#${tokenId}`
                    });
                }
            });
            setNfts(_processedMNFTs);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
        setLoading(false);
    }

    useEffect(() => {
        if (!state.loginWalletType || state.loginWalletType === LoginWalletType.UNIPASS_V3) return;
        if (!tokenIds.length || !selectedType || !nftCoverImages.length) return;
        fetchERC721NFTS();
    }, [tokenIds, selectedType, nftCoverImages, state.loginWalletType]);

    useEffect(() => {
        if (nfts.length && selectedType) {
            if (selectedType === 'All') setFilterNfts(nfts);
            else setFilterNfts(nfts.filter(nft => nft.type === selectedType));
        }
    }, [nfts, selectedType]);

    useEffect(() => {
        if (!state.loginWalletType || !state.currentAddress || !nftCoverImages.length) return;
        if (state.loginWalletType === LoginWalletType.UNIPASS_V3) {
            fetchMNFTs();
        } else {
            // 查询 GODWOKEN 持用的 NFTS
            fnFetchAllTokenIds();
        }
    }, [state.currentAddress, nftCoverImages, state.loginWalletType]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const NFTItem = (props: { nft: NFT; showDetail: Function; }) => {
        const { nft, showDetail } = props;

        return (
            <div className="nft-item cursor" onClick={() => { showDetail() }}>
                <div className="cover-image">
                    <img
                        src={`${nft.cover_image_url ||
                            nft.image}?x-oss-process=image/resize,h_100,m_lfit`}
                        alt=""
                    />
                </div>
                <div className="name" title={nft.name}>
                    {nft.name && nft.name.replace(/Nervape \//g, '')}
                </div>
                <div className="id">{nft.formatId}</div>
            </div>
        );
    }

    const YokaiNftButton = (props: { selectedType: string; }) => {
        const { selectedType } = props;
        return (
            <button
                className="yokai-nft-btn cursor button-hover-action-red"
                onClick={() => {
                    window.open(
                        `${(CONFIG.YOKAI_URL) +
                        ContractMap[selectedType]}`
                    );
                }}>
                {`${selectedType.toUpperCase()} NFT`}
            </button>
        );
    }

    return (
        <div className={`wallet-nft-3d-container ${isFold && 'fold'}`}>
            <div className={`wallet-nft-3d-header transition position-sticky ${state.windowWidth > 750 && 'flex-align'}`}>
                <div className="nft-3d-title">3D NFT</div>

                <div className="nft-3d-tabs flex-align">
                    {types.map(type => {
                        return (
                            <div
                                key={type}
                                className={`nft-3d-tab cursor transition nacp-ape-tab ${selectedType == type && 'active'}`}
                                onClick={() => {
                                    setSelectedType(type)
                                }}>
                                {type}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="wallet-nft-3d-content">
                {filterNfts.length ? (
                    <div className="wallet-nft-3ds flex-align">
                        {filterNfts.map((filter, index) => {
                            return <NFTItem
                                showDetail={() => {
                                    setShowNftCard(true);
                                    updateBodyOverflow(false);
                                    if (state.windowWidth <= 750) {
                                        dispatch({
                                            type: Types.IsVisibleHeader,
                                            value: false
                                        })
                                    }
                                    setNftDetail(filter);
                                }}
                                key={`${selectedType}-${index}`}
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
                                <p>Currently don’t have any {selectedType == 'All' ? 'Nervape' : 'Nervape ' + selectedType} NFTs</p>
                                <p>Buy Nervape NFTs on Yokai Dojo, the link below</p>
                            </div>
                            {
                                selectedType == 'All' ? (
                                    <div className="yokai-nft-btns flex-center">
                                        {types.map(type => {
                                            if (type !== 'All')
                                                return <YokaiNftButton key={type} selectedType={type}></YokaiNftButton>;
                                        })}
                                    </div>
                                ) : <YokaiNftButton selectedType={selectedType}></YokaiNftButton>
                            }
                        </div>
                    </div>
                )}
            </div>

            <NftCardDetail
                show={showNftCard}
                setLoading={setLoading}
                loginWalletType={state.loginWalletType as LoginWalletType}
                address={state.currentAddress}
                nft={nftDetail}
                close={() => {
                    setShowNftCard(false);
                    updateBodyOverflow(true);
                }}
                fullscreen={() => {
                    setShowNftCard(false);
                    setShowFullscreen(true);
                }}
                showTransferSuccess={() => {
                    setShowTransferSuccess(true);
                    fnFetchAllTokenIds();
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
