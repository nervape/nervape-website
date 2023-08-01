import React, { useCallback, useContext, useEffect, useState } from "react";
import { nervapeApi } from "../../../api/nervape-api";
import { IconMap, NACP_ASSET_QUERY, NACP_NFT_FILTER, NACP_NFT_FILTER_ITEM, NACP_NFT_QUERY, NFT } from "../../../nervape/nft";
import "./index.less";

import FilterArrowIcon from '../../../assets/icons/filter_arrow_icon.png';
import FilterIcon from '../../../assets/icons/filter_icon.png';
import FullscrenIcon from '../../../assets/nft/fullscreen.svg';
import DetailCloseIcon from '../../../assets/nft/close_detail.svg';
import { DataContext, updateBodyOverflow } from "../../../utils/utils";

import { Types } from "../../../utils/reducers";
import { NacpMetadata } from "../../../nervape/nacp";

function NftCardDetail(props: { nft: NFT; close: any; fullscreen: any; show: boolean; }) {
    const { nft, close, fullscreen, show } = props;

    const { state } = useContext(DataContext);

    return (
        <div className={`nft-card-detail-container popup-container mask-cover ${show && 'show'}`} onClick={close}>
            <div className="nft-card-detail" onClick={e => e.stopPropagation()}>
                <div className="preview-model">
                    {state.windowWidth <= 1200 && (
                        <div className="close-detail-c">
                            <img loading="lazy" onClick={close} className="close-detail cursor" src={DetailCloseIcon} alt="DetailCloseIcon" />
                        </div>
                    )}
                    <div className="fullscreen-c">
                        <img loading="lazy" onClick={fullscreen} className="full-screen cursor" src={FullscrenIcon} alt="FullscrenIcon" />
                    </div>
                </div>
                <div className="detail-info" style={{ background: nft?.card_background }}>
                    <div className="info-content">
                        <div className="name">{nft?.name}</div>
                        {!nft?.coming_soon && (
                            <div className="distribution">
                                <div className="title">Distribution</div>
                                <div className="flex">
                                    <div className="godwoken flex-1">
                                        <span className="text">GODWOKEN</span>
                                        <span className="value">{`${nft?.issued}/${nft?.total}`}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="attributes attributes-1 flex">
                            <div className="range flex-1">
                                <div className="text">ID Range</div>
                                <div className="value">{nft?.coming_soon ? '-' : nft?.id_range}</div>
                            </div>
                            <div className="origin flex-1">
                                <div className="text">Origin</div>
                                <div className="value">{nft?.origin}</div>
                            </div>
                        </div>
                        <div className="attributes flex">
                            {nft?.type === 'Character' && (
                                <>
                                    <div className="name flex-1">
                                        <div className="text">Name</div>
                                        <div className="value">{nft?.short_name}</div>
                                    </div>
                                    <div className="birthday flex-1">
                                        <div className="text">Birthday</div>
                                        <div className="value">{nft?.birthday && nft.birthday.replace(/-/g, '/')}</div>
                                    </div>
                                </>
                            )}
                            <div className="type flex-1">
                                <div className="text">Type</div>
                                <div className="value">{nft?.type}</div>
                            </div>
                        </div>
                        <div className="description">
                            <div className="desc-c">{nft?.description}</div>
                        </div>
                        <div className="btn-groups">
                            <button
                                className={`btn cursor ${nft?.coming_soon && 'coming-soon'}`}
                                onClick={() => {
                                    if (nft?.coming_soon) return;
                                    window.open(nft?.yokaiUrl);
                                }}
                            >
                                {nft?.coming_soon ? 'COMING SOON' : 'BUY ON YOKAI'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FullscreenPreview(props: { nft?: NFT, close: any }) {
    const { nft, close } = props;
    return (
        <div className="fullscreen-container mask-cover">
            <div className="close-c cursor">
                <img loading="lazy" className="close-icon transform-center" onClick={close} src={DetailCloseIcon} alt="IconPreviewClose" />
            </div>
        </div>
    );
}

export default function NacpNFTPage() {
    const [filters, setFilters] = useState<NACP_NFT_FILTER[]>();
    const [nfts, setNfts] = useState<NacpMetadata[]>();
    const [query, setQuery] = useState<NACP_NFT_QUERY>({});
    const [lastQuery, setLastQuery] = useState('');
    const [showMFilter, setShowMFilter] = useState(true);

    const [showNftCard, setShowNftCard] = useState(false);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [nftDetail, setNftDetail] = useState<NFT>();

    const { state, dispatch } = useContext(DataContext);

    const setHideHeader = (value: boolean) => {
        dispatch({
            type: Types.IsVisibleHeader,
            value: value
        })
    }

    const setLoading = (flag: boolean) => {
        dispatch({
            type: flag ? Types.ShowLoading : Types.HideLoading
        })
    }

    const fnFilter = useCallback(filterNfts(), []);
    const fnGetAssetByName = useCallback(getAssetByName(), []);

    function filterNfts() {
        let timer: any;
        return function (_query?: NACP_NFT_QUERY) {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                setLoading(true);
                setLastQuery(JSON.stringify(_query));
                nervapeApi.fnfilterNacp(_query?.tokenId, _query?.assets).then(res => {
                    setNfts(res);
                    setLoading(false);
                })
            }, 1000);
        }
    }
    
    function getAssetByName() {
        let timer: any;
        return function (_filters: NACP_NFT_FILTER[], _query?: NACP_ASSET_QUERY) {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                setLoading(true);
                nervapeApi.fnGetNacpAssetsByCategory(_query?.categoryId || '', _query?.name || '').then(res => {
                    setLoading(false);
                    
                    _filters.map((filter) => {
                        if (filter._id == _query?.categoryId) {
                            filter.assets = res;
                        }
                        return filter;
                    })

                    setFilters(_filters);
                })
            }, 1000);
        }
    }

    function delSelectedFilter(name: string) {
        const _filters: NACP_NFT_FILTER[] = JSON.parse(JSON.stringify(filters));
        _filters.map((filter) => {
            filter.assets.map((item) => {
                if (item.name === name) {
                    item.checked = false;
                }
            })
        })
        setFilters(_filters);
    }

    useEffect(() => {
        nervapeApi.fnGetNacpCategories().then(res => {
            setFilters(res);
        });
    }, []);

    useEffect(() => {
        if (JSON.stringify(query) == lastQuery) return;
        fnFilter(query);
    }, [query]);

    useEffect(() => {
        if (!filters?.length) return;
        const _query: any = JSON.parse(JSON.stringify(query));
        _query.assets = [];
        filters.map((filter) => {
            const selected = filter.assets.filter(item => item.checked).map(item => item._id);
            _query.assets = _query.assets ? _query.assets.concat(selected) : selected;
        });

        setQuery(_query);
    }, [filters]);

    useEffect(() => {
        if (state.windowWidth <= 1000) {
            setShowMFilter(false);
        }
    }, [state.windowWidth]);
    return (
        <div className="nacp-nft-container main-container">
            <div className="nfts-content">
                <div className="content">
                    <div className="filter-items">
                        <div className="input-c">
                            <div className={`filter-menu ${state.windowWidth > 1000 && 'hidden'}`} onClick={() => {
                                setHideHeader(false);
                                setShowMFilter(!showMFilter);
                                updateBodyOverflow(false);
                            }}>
                                <img loading="lazy" src={FilterIcon} alt="FilterIcon" />
                            </div>
                            <input
                                type="number"
                                min={1}
                                className="filter-name"
                                placeholder="Search by ID"
                                value={query?.tokenId}
                                onInput={(e: any) => {
                                    setQuery({ ...query, tokenId: e.target.value })
                                }}
                                onBlur={(e: any) => {
                                    setQuery({ ...query, tokenId: e.target.value })
                                    fnFilter(query);
                                }}
                            />
                        </div>
                        <div className={`filter-container ${state.windowWidth <= 1000 && 'popup-container'} ${showMFilter && 'show'}`}
                            onClick={() => {
                                setShowMFilter(!showMFilter);
                                updateBodyOverflow(true);
                            }}>
                            <div className="filters"
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}>
                                {filters?.map((filter, i) => {
                                    return (
                                        <div className="filter" key={i}>
                                            <div className="f-title cursor" onClick={() => {
                                                const _filters = JSON.parse(JSON.stringify(filters));
                                                _filters[i].open = !_filters[i].open;
                                                setFilters(_filters);
                                            }}>
                                                <img loading="lazy" className={`filter-arrow-icon ${!filter.open && 'close'}`} src={FilterArrowIcon} alt="filterArrowIcon" />
                                                <div className="name">{filter.name}</div>
                                            </div>
                                            {
                                                filter.open && (
                                                    <div className={`childrens ${!filter.open && 'close'}`}>
                                                        <input
                                                            type="text"
                                                            className="asset-name"
                                                            placeholder="Search by asset name"
                                                            value={filter.asset_name}
                                                            onInput={(e: any) => {
                                                                //
                                                                const _filters = JSON.parse(JSON.stringify(filters));
                                                                _filters[i].asset_name = e.target.value;
                                                                setFilters(_filters);
                                                            }}
                                                            onBlur={(e: any) => {
                                                                const _filters = JSON.parse(JSON.stringify(filters));
                                                                fnGetAssetByName(_filters, { categoryId: filter._id, name: e.target.value });
                                                            }}
                                                        />
                                                        {filter.assets.map((children, j) => {
                                                            return (
                                                                <div className="children cursor" key={j} onClick={() => {
                                                                    const _filters = JSON.parse(JSON.stringify(filters));
                                                                    _filters[i].assets[j].checked = !_filters[i].assets[j].checked;
                                                                    setFilters(_filters);
                                                                }}>
                                                                    <div className={`checkout ${children.checked && 'selected'}`}></div>
                                                                    <div className="name">{`${children.name}`}</div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )
                                            }
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="nft-items">
                        <div className="nfts">
                            {nfts?.map((nft, index) => {
                                return (
                                    <div className="nft" key={index}>
                                        <div
                                            className="cover-image cursor"
                                            onClick={() => {
                                                // document.body.style.overflow = 'hidden';
                                                // setShowNftCard(true);
                                            }}
                                        >
                                            <img loading="lazy" src={nft.image} alt="cover-image" />
                                        </div>
                                        <div className="nft-info">
                                            <div className="name-item flex-align">
                                                <div className="name">{nft.name + ' #' + nft.token_id}</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <NftCardDetail
                show={showNftCard}
                nft={nftDetail as NFT}
                close={() => {
                    document.body.style.overflow = 'auto';
                    setShowNftCard(false)
                }}
                fullscreen={() => {
                    setShowNftCard(false);
                    setShowFullscreen(true);
                }}></NftCardDetail>
            {showFullscreen && (
                <FullscreenPreview
                    nft={nftDetail}
                    close={() => {
                        document.body.style.overflow = 'auto';
                        setShowFullscreen(false)
                    }}></FullscreenPreview>
            )}
        </div>
    );
}
