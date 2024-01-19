import React, { useCallback, useContext, useEffect, useState } from "react";
import './index.less';

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination } from "swiper";

import PlayIcon from '../../../assets/icons/play_icon.svg';
import FilterIcon from '../../../assets/icons/filter_icon.png';
import CloseIcon from '../../../assets/icons/close_icon.png';
import LoadingGif from "../../../assets/gallery/loading.gif";
import FullscrenIcon from '../../../assets/nft/fullscreen.svg';
import FilterArrowIcon from '../../../assets/icons/filter_arrow_icon.png';
import DetailCloseIcon from '../../../assets/nft/close_detail.svg';

import { Parallax } from 'rc-scroll-anim';
import { Co_Created_NFT, NFT_BANNER, NFT_FILTER, NFT_FILTER_ITEM, NFT_QUERY } from "../../../nervape/co-created-nft";
import { DataContext } from "../../../utils/utils";
import { IconMap } from "../../../nervape/nft";
import { nervapeApi } from "../../../api/nervape-api";
import { NftBannerVideo } from "..";
import { FullscreenPreview } from "../../wallet/co-created";

// 预览 3D 模型
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PreviewModel(props: any) {
    const { enableModuleUrl, id } = props;

    const revealId = '#reveal' + id;

    document.querySelector(revealId)?.addEventListener('progress', (e: any) => {
        console.log('dismissPoster', e);
        if (e.detail.totalProgress == 1) {
            (document.querySelector(revealId) as any).dismissPoster();
        }
    });

    useEffect(() => {
        console.log(enableModuleUrl)
        if (!enableModuleUrl) return;
        (document.querySelector(revealId) as any)?.showPoster();

    }, [enableModuleUrl]);

    return (
        <model-viewer
            class="model-viewer-class"
            id={`reveal` + id}
            // reveal="interaction"
            loading="eager"
            reveal="manual"
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

function NftCardDetail(props: { nft: Co_Created_NFT; close: any; fullscreen: any; show: boolean; }) {
    const { nft, close, fullscreen, show } = props;

    const { state } = useContext(DataContext);

    return (
        <div className={`wallet-nft-card-detail-container popup-container ${show && 'show'}`} onClick={close}>
            <div className="popup-content nft-card-detail" onClick={e => e.stopPropagation()}>
                <div className="preview-model">
                    <img className='cover-image-url' src={nft?.image} alt="" />
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
                        <div className="name">{nft?.name}</div>

                        <div className="attributes attributes-1 flex">
                            <div className="range flex-1">
                                <div className="text">ID Range</div>
                                <div className="value">0 - 900</div>
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
                            {nft?.description}
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
    );
}

export default function NFTCoCreation() {
    const [banners, setBanners] = useState<NFT_BANNER[]>();
    const [promoVideoUrl, setPromoVideoUrl] = useState("");
    const [showMFilter, setShowMFilter] = useState(true);
    const [filterSelectCount, setFilterSelectCount] = useState(0);
    const [query, setQuery] = useState<NFT_QUERY>({});
    const [nfts, setNfts] = useState<Co_Created_NFT[]>();
    const [filters, setFilters] = useState<NFT_FILTER[]>();

    const [showNftCard, setShowNftCard] = useState(false);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [nftDetail, setNftDetail] = useState<Co_Created_NFT>();

    const { state } = useContext(DataContext);

    SwiperCore.use([Autoplay, Pagination]);

    const fnFilter = useCallback(filterNfts(), []);

    function filterNfts() {
        let timer: any;
        return function (_query?: NFT_QUERY) {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                nervapeApi.fnGetCoCreatedNfts(_query).then(res => {
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
        nervapeApi.fnGetCoCreatedNFTBanners().then(res => {
            setBanners(res);
        })
        nervapeApi.fnGetCoCreatedNftFilterList().then(res => {
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
        setFilterSelectCount(query.event?.length || 0)
    }, [query]);

    useEffect(() => {
        if (!filters?.length) return;
        const _query: any = JSON.parse(JSON.stringify(query));
        filters.map((filter) => {
            const selected = filter.items.filter(item => item.checked).map(item => item.name);
            _query[filter.name.toLocaleLowerCase()] = selected;
        });

        setQuery(_query);
    }, [filters]);

    useEffect(() => {
        if (state.windowWidth == 1200) setShowMFilter(true);
    }, [state.windowWidth]);

    return (
        <div className="nft-co-creation-container main-container">
            <Parallax
                animation={{ translateY: '-100vh', playScale: [1, 2.5] }}
                style={{ transform: 'translateY(0)' }}
                location="home-slider"
                className="swiper-c"
            >
                <Swiper
                    autoplay={{ delay: 5000 }}
                    speed={1500}
                    loop={banners && banners?.length > 1}
                    pagination={{ clickable: true }}
                >
                    {banners?.map((banner, index) => {
                        return (
                            <SwiperSlide key={index}>
                                {({ isActive }) => (
                                    <>
                                        <div className="banner-image">
                                            <img loading="lazy" src={state.windowWidth !== 375 ? banner.imageUrl4k : banner.imageUrlsmail} alt="imageUrl4k" />
                                        </div>
                                        <div className="cover-mask"></div>
                                        <div className={`banner-info ${isActive ? 'active' : 'notActive'}`}>
                                            <div className="info-item">
                                                <div className="name">{banner.name}</div>
                                                <div className="job">{banner.desc}</div>
                                                <div className="type-video">
                                                    <div className="type-c">
                                                        <embed src={IconMap.get(banner.type)} className="icon" type="" />
                                                        {/* <img loading="lazy" src={IconMap.get(banner.type)} className="icon" alt="" /> */}
                                                        <div className="type">{`${banner.type}`.toUpperCase()}</div>
                                                    </div>
                                                    <div
                                                        className="play-icon-c cursor"
                                                        onClick={() => {
                                                            setPromoVideoUrl(banner.promoVideoUrl);
                                                        }}>
                                                        <img loading="lazy" src={PlayIcon} className="play-icon" alt="" />
                                                    </div>
                                                </div>
                                                {banner.status && (
                                                    <div className={`c-status ${banner.status}`}>
                                                        <div className="span">{banner.status}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
                {state.windowWidth !== 375 ? (
                    <Parallax
                        animation={{ opacity: 1, playScale: [1, 2.5] }}
                        style={{ opacity: 0 }}
                        location="home-slider"
                        className="swiper-mask"
                    >
                    </Parallax>
                ) : banners?.length && (
                    <Parallax
                        animation={{ opacity: 1, playScale: [1, 1.8] }}
                        style={{ opacity: 0 }}
                        location="home-slider"
                        className="swiper-mask"
                    >
                    </Parallax>
                )}
            </Parallax>
            <div className="home-slider" id="home-slider"></div>
            <div className="nfts-content">
                <div className="content-title">
                    <div className="title">Collab NFTs</div>
                    <div className="desc">We believe the true power of web3 is in collaboration. That’s why at Nervape, we invite our community members to collaborate and create NFT art with us that truly expresses themselves.</div>
                </div>
                <div className="content">
                    <div className="filter-items">
                        <div className="input-c">
                            <div className={`filter-menu ${state.windowWidth == 1200 && 'hidden'}`} onClick={() => {
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
                                                if (state.windowWidth !== 1200) return;
                                                const _filters = JSON.parse(JSON.stringify(filters));
                                                _filters[i].open = !_filters[i].open;
                                                setFilters(_filters);
                                            }}>
                                                <img loading="lazy" className={`filter-arrow-icon ${!filter.open && 'close'} ${state.windowWidth !== 1200 && 'hidden'}`} src={FilterArrowIcon} alt="filterArrowIcon" />
                                                <div className="name">{filter.name}</div>
                                            </div>
                                            {
                                                ((state.windowWidth == 1200 && filter.open) || state.windowWidth != 1200) && (
                                                    <div className={`childrens ${(state.windowWidth == 1200 && !filter.open) && 'close'}`}>
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
                                {query.event?.map(origin => {
                                    return (
                                        <div
                                            className="filter-selected cursor"
                                            onClick={() => {
                                                delSelectedFilter(origin);
                                            }}
                                            key={origin}>
                                            <span>{origin}</span>
                                            <img loading="lazy" src={CloseIcon} alt="CloseIcon" />
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
                                                document.body.style.overflow = 'hidden';
                                                setShowNftCard(true);
                                                setNftDetail(nft);
                                            }}
                                        >
                                            <img loading="lazy" src={nft.image} alt="cover-image" />
                                        </div>
                                        <div className="nft-info">
                                            <div className="nervape">NERVAPE</div>
                                            <div className="name">{nft.name}</div>
                                            {nft?.coming_soon ? (
                                                <div className="coming-soon">Coming soon</div>
                                            ) : (
                                                <div className="distributed">{`${nft.issued}/${nft.total} distributed`}</div>
                                            )}
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
            <NftCardDetail
                show={showNftCard}
                nft={nftDetail as Co_Created_NFT}
                close={() => {
                    document.body.style.overflow = 'auto';
                    setShowNftCard(false)
                }}
                fullscreen={() => {
                    setShowNftCard(false);
                    setShowFullscreen(true);
                }}></NftCardDetail>
            <FullscreenPreview
                show={showFullscreen}
                nft={nftDetail as Co_Created_NFT}
                close={() => {
                    document.body.style.overflow = 'auto';
                    setShowFullscreen(false)
                }}></FullscreenPreview>
        </div>
    );
}
