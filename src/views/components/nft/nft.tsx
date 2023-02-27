/* eslint-disable radix */
import React, { useEffect, useState } from 'react';
import './nft.less';

import { Address, AddressType } from '@lay2/pw-core';
import { getNFTsAtAddress } from '../../../utils/api';
import useFetchAllTokenIds from '../../../hooks/useERC721';

import DetailCloseIcon from '../../../assets/images/nft/close_detail.svg';
import { NFT, NFT_TYPE_VALUE } from '../../../utils/nft-utils';
import { LoginWalletType } from '../../../utils/Wallet';
import NftCardDetail, { PreviewModel } from './detail';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            'model-viewer': React.DetailedHTMLProps<any, any>;
        }
    }
}

export function TransferSuccess(props: { show: boolean; close: Function; viewHistory: Function }) {
    const { show, close, viewHistory } = props;
    return (
        <div
            className={`bridge-success-content ${show && 'show'}`}
            onClick={() => {
                close();
            }}
        >
            <div
                className="bridge-success"
                onClick={e => {
                    e.stopPropagation();
                }}
            >
                <div className="tip">
                    Transfer request submitted! You can now view the transaction progress in the
                    history tab.
                </div>
                <div className="btn-groups">
                    <button
                        className="btn view-history cursor"
                        onClick={() => {
                            close();
                            viewHistory();
                        }}
                    >
                        VIEW IN HISTORY
                    </button>
                </div>
            </div>
        </div>
    );
}

// 全屏预览
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FullscreenPreview(props: { nft?: NFT; close: any }) {
    const { nft, close } = props;
    return (
        <div className="fullscreen-container mask-cover">
            <PreviewModel enableModuleUrl={nft?.renderer}></PreviewModel>
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function NFTItem(props: { nft: NFT; showDetail: any }) {
    const { nft, showDetail } = props;

    return (
        <div className="nft-item cursor" onClick={showDetail}>
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function NFT_CONTENT(props: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {
        setShowTransferSuccess,
        address,
        loginWalletType,
        setLoading,
        nftCoverImages
    } = props;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [types, setTypes] = useState(['All', 'Character', 'Item', 'Scene', 'Special']);
    const [selectedType, setSelectedType] = useState('All');
    const [nfts, setNfts] = useState<NFT[]>([]);
    const [filterNfts, setFilterNfts] = useState<NFT[]>([]);

    const [showNftCard, setShowNftCard] = useState(false);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [nftDetail, setNftDetail] = useState<NFT>();

    const [tokenIds, setTokenIds] = useState<string[]>([]);

    const fetchAllTokenIds = useFetchAllTokenIds(address);

    async function fnFetchAllTokenIds() {
        setLoading(true);
        const res = await fetchAllTokenIds();
        setTokenIds(res);
        setLoading(false);
    }

    function formatTokenId(tokenId: number) {
        if (tokenId < 10) return `00${tokenId}`;
        if (tokenId < 100) return `0${tokenId}`;
        return tokenId;
    }

    function getNftTypeByName(filterName: string) {
        const _filterNfts = nftCoverImages.filter(({ name } : { name: string }) => name === filterName);
        if (_filterNfts.length) {
            return _filterNfts[0];
        }
        return null;
    }

    async function fetchMNFTs() {
        setNfts([]);
        setLoading(true);
        try {
            const _address = new Address(address, AddressType.ckb);
            const _MNFTs = await getNFTsAtAddress(_address);
            const _processedMNFTs: NFT[] = [];
            for (const token of _MNFTs) {
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
            }
            setNfts(_processedMNFTs);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }

    async function fetchERC721NFTS() {
        setNfts([]);
        setLoading(true);
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
    }

    function disableOverflowBody(disable: boolean) {
        document.body.style.overflow = disable ? 'hidden' : 'auto';
    }

    useEffect(() => {
        if (!loginWalletType || loginWalletType === LoginWalletType.UNIPASS_V3) return;
        if (!tokenIds.length || !selectedType || !nftCoverImages.length) return;
        fetchERC721NFTS();
    }, [tokenIds, selectedType, nftCoverImages, loginWalletType]);

    useEffect(() => {
        if (nfts.length && selectedType) {
            if (selectedType === 'All') setFilterNfts(nfts);
            else setFilterNfts(nfts.filter(nft => nft.type === selectedType));
        }
    }, [nfts, selectedType]);

    useEffect(() => {
        if (!loginWalletType || !address || !nftCoverImages.length) return;
        if (loginWalletType === LoginWalletType.UNIPASS_V3) {
            fetchMNFTs();
        } else {
            // 查询 GODWOKEN 持用的 NFTS
            fnFetchAllTokenIds();
        }
    }, [address, nftCoverImages, loginWalletType]);

    return (
        <div className="wallet-nft-container">
            <div className="nft-content">
                <div className="nft-title">NFT</div>
                <div className="type-content">
                    <div className="type-tabs">
                        {types.map((type: string) => {
                            return (
                                <div
                                    key={type}
                                    onClick={() => {
                                        if (type !== selectedType) setFilterNfts([]);
                                        setSelectedType(type);
                                    }}
                                    className={`type cursor ${selectedType === type && 'selected'}`}
                                >
                                    {type.toUpperCase()}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="nfts">
                    {filterNfts.map((filter, index) => {
                        return (
                            <NFTItem
                                showDetail={() => {
                                    setShowNftCard(true);
                                    disableOverflowBody(true);
                                    setNftDetail(filter);
                                }}
                                key={`${selectedType}-${index}`}
                                nft={filter}
                            ></NFTItem>
                        );
                    })}
                </div>
            </div>
            {showNftCard && nftDetail && (
                <NftCardDetail
                    setLoading={setLoading}
                    loginWalletType={loginWalletType}
                    address={address}
                    nft={nftDetail}
                    close={() => {
                        setShowNftCard(false);
                        disableOverflowBody(false);
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
            )}
            {showFullscreen && (
                <FullscreenPreview
                    nft={nftDetail}
                    close={() => setShowFullscreen(false)}
                ></FullscreenPreview>
            )}
        </div>
    );
}
