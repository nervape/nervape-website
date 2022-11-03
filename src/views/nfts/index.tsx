import React, { MouseEventHandler, useCallback, useContext, useEffect, useState } from "react";
import { nervapeApi } from "../../api/nervape-api";
import { IconMap, NFT, NFT_BANNER, NFT_FILTER, NFT_FILTER_ITEM, NFT_QUERY } from "../../nervape/nft";
import "./index.less";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination } from "swiper";
import "swiper/css";
import 'swiper/css/pagination';

import PlayIcon from '../../assets/icons/play_icon.png';
import FilterArrowIcon from '../../assets/icons/filter_arrow_icon.png';
import FilterIcon from '../../assets/icons/filter_icon.png';
import CloseIcon from '../../assets/icons/close_icon.png';
import FullscrenIcon from '../../assets/icons/fullscreen.png';
import IconPreviewClose from "../../assets/gallery/preview-close-button.svg";
import LoadingGif from "../../assets/gallery/loading.gif";
import { DataContext } from "../../utils/utils";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "model-viewer": React.DetailedHTMLProps<any, any>;
        }
    }
}

export interface BannerVideoProp {
    promoVideoUrl: string;
    resetUrl: MouseEventHandler;
}

function NftBannerVideo(props: BannerVideoProp) {
    const { promoVideoUrl, resetUrl } = props;
    return (
        <div className="video-container mask-cover" onClick={resetUrl}>
            <iframe src={promoVideoUrl} frameBorder="0"></iframe>
        </div>
    );
}

function PreviewModel(props: any) {
    const {enableModuleUrl} = props;
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

function NftCardDetail(props: { nft: NFT; close: any; fullscreen: any; }) {
    const {nft, close, fullscreen} = props;
    return (
        <div className="nft-card-detail-container mask-cover" onClick={close}>
            <div className="nft-card-detail" onClick={e => e.stopPropagation()}>
                <div className="preview-model">
                    <PreviewModel enableModuleUrl={nft.renderer}></PreviewModel>
                    <img loading="lazy" onClick={fullscreen} className="full-screen" src={FullscrenIcon} alt="FullscrenIcon" />
                </div>
                <div className="detail-info" style={{background: nft.card_background}}>
                    <div className="info-content">
                        <div className="name">{nft.name}</div>
                        <div className="distribution">
                            <div className="title">Distribution</div>
                            <div className="flex">
                                <div className="nervos-l1 flex-1">
                                    <span className="text">NERVOS L1</span>
                                    <span className="value">{`${parseInt(nft.total) - parseInt(nft.issued)}/${nft.total}`}</span>
                                </div>
                                <div className="godwoken flex-1">
                                    <span className="text">GODWOKEN</span>
                                    <span className="value">{`${nft.issued}/${nft.total}`}</span>
                                </div>
                            </div>
                        </div>
                        <div className="attributes flex">
                            <div className="range flex-1">
                                <div className="text">ID Range</div>
                                <div className="value">10010001 - 10010256</div>
                            </div>
                            <div className="origin flex-1">
                                <div className="text">Origin</div>
                                <div className="value">{nft.origin}</div>
                            </div>
                        </div>
                        <div className="attributes flex">
                            <div className="name flex-1">
                                <div className="text">Name</div>
                                <div className="value">{nft.short_name}</div>
                            </div>
                            <div className="birthday flex-1">
                                <div className="text">Birthday</div>
                                <div className="value">{nft.birthday && nft.birthday.replace(/-/g, '/')}</div>
                            </div>
                            <div className="type flex-1">
                                <div className="text">Type</div>
                                <div className="value">{nft.type}</div>
                            </div>
                        </div>
                        <div className="description">{nft.description}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FullscreenPreview(props: {nft?: NFT, close: any}) {
    const { nft, close } = props;
    return (
        <div className="fullscreen-container mask-cover">
            <PreviewModel enableModuleUrl={nft?.renderer}></PreviewModel>
            <img loading="lazy" className="close-icon" onClick={close} src={IconPreviewClose} alt="IconPreviewClose" />
        </div>
    );
}

export default function NFTPage() {
    const [banners, setBanners] = useState<NFT_BANNER[]>();
    const [filters, setFilters] = useState<NFT_FILTER[]>();
    const [nfts, setNfts] = useState<NFT[]>();
    const [query, setQuery] = useState<NFT_QUERY>({});
    const [filterSelectCount, setFilterSelectCount] = useState(0);
    const [showMFilter, setShowMFilter] = useState(true);
    const [promoVideoUrl, setPromoVideoUrl] = useState("");

    const [showNftCard, setShowNftCard] = useState(false);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [nftDetail, setNftDetail] = useState<NFT>();

    const { windowWidth } = useContext(DataContext);

    SwiperCore.use([Autoplay, Pagination]);

    const fnFilter = useCallback(filterNfts(), []);

    function filterNfts() {
        let timer: any;
        return function (_query?: NFT_QUERY) {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                nervapeApi.fnGetNfts(_query).then(res => {
                    setNfts(res);
                })
            }, 1000);
        }
    }

    function delSelectedFilter(name: string) {
        const _filters: NFT_FILTER[] = JSON.parse(JSON.stringify(filters));
        _filters.map((filter) => {
            filter.items.map((item) => {
                if (item.name === name) {
                    item.checked = false;
                }
            })
        })
        setFilters(_filters);
    }

    useEffect(() => {
        nervapeApi.fnGetNFTBanners().then(res => {
            setBanners(res);
        })
        nervapeApi.fnGetNftFilterList().then(res => {
            const _filters: NFT_FILTER[] = [];
            Object.keys(res).forEach((item: string) => {
                const _item: NFT_FILTER_ITEM[] = [];
                Object.keys(res[item]).forEach((c: string) => {
                    _item.push({
                        name: c,
                        count: res[item][c],
                        checked: false
                    })
                });
                _filters.push({
                    name: item,
                    open: true,
                    items: _item
                })
            });
            setFilters(_filters);
        });
    }, []);

    useEffect(() => {
        fnFilter(query);
        setFilterSelectCount((query.origin?.length || 0) + (query.type?.length || 0))
    }, [query]);

    useEffect(() => {
        if (!filters?.length) return;
        const _query: any = JSON.parse(JSON.stringify(query));
        filters.map((filter) => {
            const selected = filter.items.filter(item => item.checked).map(item => item.name);
            _query[filter.name.toLocaleLowerCase()] = selected;
        });

        setQuery(_query);
    }, [filters])
    return (
        <div className="nft-container main-container">
            <Swiper
                autoplay={{ delay: 50000 }}
                speed={1000}
                loop
                pagination={{ clickable: true }}
                onSlideChange={() => console.log('slide change')}
            >
                {banners?.map((banner, index) => {
                    return (
                        <SwiperSlide key={index}>
                            <div className="banner-image">
                                <img loading="lazy" src={windowWidth !== 375 ? banner.imageUrl4k : banner.imageUrlsmail} alt="imageUrl4k" />
                            </div>
                            <div className="cover-mask"></div>
                            <div className="banner-info">
                                <div className="info-item">
                                    <div className="name">{banner.name}</div>
                                    <div className="job">{banner.job.toUpperCase()}</div>
                                    <div className="type-video">
                                        <div className="type-c">
                                            <embed src={IconMap.get(banner.type)} className="icon" type="" />
                                            {/* <img loading="lazy" src={IconMap.get(banner.type)} className="icon" alt="" /> */}
                                            <div className="type">{`${banner.type} NFT`.toUpperCase()}</div>
                                        </div>
                                        <img loading="lazy" src={PlayIcon} onClick={() => {
                                            setPromoVideoUrl(banner.promoVideoUrl);
                                        }} className="play-icon cursor" alt="" />
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
            <div className="nfts-content">
                <div className="content">
                    <div className="filter-items">
                        <div className="input-c">
                            <div className={`filter-menu ${windowWidth == 1200 && 'hidden'}`} onClick={() => {
                                setShowMFilter(!showMFilter);
                            }}>
                                <img loading="lazy" src={FilterIcon} alt="FilterIcon" />
                                {filterSelectCount > 0 && <span>{filterSelectCount}</span>}
                            </div>
                            <input
                                type="text"
                                className="filter-name"
                                placeholder="Search by name"
                                value={query?.name || ''}
                                onInput={(e: any) => {
                                    setQuery({ ...query, name: e.target.value })
                                }}
                                onBlur={(e) => {
                                    setQuery({ ...query, name: e.target.value })
                                    fnFilter(query);
                                }}
                            />
                        </div>
                        {showMFilter && (
                            <div className="filters">
                                {filters?.map((filter, i) => {
                                    return (
                                        <div className="filter" key={i}>
                                            <div className="f-title cursor" onClick={() => {
                                                if (windowWidth !== 1200) return;
                                                const _filters = JSON.parse(JSON.stringify(filters));
                                                _filters[i].open = !_filters[i].open;
                                                setFilters(_filters);
                                            }}>
                                                <img loading="lazy" className={`filter-arrow-icon ${!filter.open && 'close'} ${windowWidth !== 1200 && 'hidden'}`} src={FilterArrowIcon} alt="filterArrowIcon" />
                                                <div className="name">{filter.name}</div>
                                            </div>
                                            {
                                                filter.open && (
                                                    <div className={`childrens ${!filter.open && 'close'}`}>
                                                        {filter.items.map((children, j) => {
                                                            return (
                                                                <div className="children cursor" key={j} onClick={() => {
                                                                    const _filters = JSON.parse(JSON.stringify(filters));
                                                                    _filters[i].items[j].checked = !_filters[i].items[j].checked;
                                                                    setFilters(_filters);
                                                                }}>
                                                                    <div className={`checkout ${children.checked && 'selected'}`}></div>
                                                                    <div className="name">{`${children.name} (${children.count})`}</div>
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
                        )}
                        {!showMFilter && filterSelectCount > 0 && (
                            <div className="filter-selected-items">
                                {query.origin?.map(origin => {
                                    return (
                                        <div className="filter-selected" key={origin}>
                                            <span>{origin}</span>
                                            <img loading="lazy" src={CloseIcon} onClick={() => {
                                                delSelectedFilter(origin);
                                            }} alt="CloseIcon" />
                                        </div>
                                    )
                                })}
                                {query.type?.map(type => {
                                    return (
                                        <div className="filter-selected" key={type}>
                                            <span>{type}</span>
                                            <img loading="lazy" className="cursor" src={CloseIcon} onClick={() => {
                                                delSelectedFilter(type);
                                            }} alt="CloseIcon" />
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                    <div className="nft-items">
                        <div className="nfts">
                            {nfts?.map((nft, index) => {
                                return (
                                    <div className="nft" key={index}>
                                        <div 
                                            className="cover-image cursor" 
                                            onClick={() => {
                                                setShowNftCard(true);
                                                setNftDetail(nft);
                                            }}
                                        >
                                            <img loading="lazy" src={nft.cover_image_url || nft.image} alt="cover-image" />
                                        </div>
                                        <div className="nft-info">
                                            <div className="nervape">NERVAPE</div>
                                            <div className="name">{nft.name}</div>
                                            <div className="distributed">{`${nft.issued}/${nft.total} distributed`}</div>
                                            <div className="nft-icon">
                                                <img loading="lazy" src={IconMap.get(nft.type)} alt="icon" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            {promoVideoUrl && (
                <NftBannerVideo promoVideoUrl={promoVideoUrl} resetUrl={() => {
                    setPromoVideoUrl("");
                }}></NftBannerVideo>
            )}
            {showNftCard && nftDetail && (
                <NftCardDetail 
                    nft={nftDetail} 
                    close={() => setShowNftCard(false)}
                    fullscreen={() => {
                        setShowNftCard(false);
                        setShowFullscreen(true);
                    }}></NftCardDetail>
            )}
            {showFullscreen && (
                <FullscreenPreview nft={nftDetail} close={() => setShowFullscreen(false)}></FullscreenPreview>
            )}
        </div>
    );
}
