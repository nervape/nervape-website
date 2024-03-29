import React, { useContext, useEffect, useState } from "react";
import './index.less';

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination } from "swiper";
import "swiper/css";
import 'swiper/css/pagination';
import { DataContext, updateBodyOverflow } from "../../utils/utils";
import { NavTool } from "../../route/navi-tool";
import { Community, Community_Type } from "../../nervape/community";
import { nervapeApi } from "../../api/nervape-api";

import ArrowIcon from '../../assets/community/arrow.svg';
import CloseIcon from '../../assets/community/close.svg'
import Footer from "../components/footer";

// 全屏预览
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FullscreenPreview(props: { community?: Community; close: any; show: boolean; }) {
    const { community, close, show } = props;

    const { state } = useContext(DataContext);

    return (
        <div className={`community-fullscreen-container mask-cover ${show && 'show'}`} onClick={close}>
            <div className="fullscreen-image-cover-c" onClick={close}>
                {state.windowRealWidth < 600 && (
                    <img src={CloseIcon} onClick={close} className="close-icon" alt="" />
                )}

                <div className="info-c" onClick={(e) => {
                    e.stopPropagation();
                }}>
                    <div className="fullscreen-image-cover">
                        <img className="fullscreen-image" src={community?.cover_image} alt="fullscreen-image" />
                    </div>

                    <div className="fullscreen-info flex-align">
                        <div className="left">
                            <div className="title">{community?.title}</div>
                            <div className="date">{community?.start_date}</div>
                        </div>

                        <div className="right">
                            <div className="sub-title">{community?.sub_title}</div>
                            <div className="tags flex-align">
                                {community?.tags.split(',').map((tag, t_i) => {
                                    return <div className="tag" key={t_i}>{tag}</div>;
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CommunityPage() {
    const { state } = useContext(DataContext);

    const [banners, setBanners] = useState<Community[]>([]);
    const [blogs, setBlogs] = useState<Community[]>([]);
    const [podcasts, setPodcasts] = useState<Community[]>([]);
    const [communityEvents, setCommunityEvents] = useState<Community[]>([]);
    const [artworks, setArtworks] = useState<Community[]>([]);
    const [currArtwork, setCurrArtwork] = useState<Community>();
    const [bannerActiveIndex, setBannerActiveIndex] = useState(0);
    const [swiper, setSwiper] = useState<SwiperCore>();
    const [communityActiveIndex, setCommunityActiveIndex] = useState(0);
    const [communitySwiper, setCommunitySwiper] = useState<SwiperCore>();

    const [showArtworkDetail, setShowArtworkDetail] = useState(false);

    async function fnGetCommunityData() {
        const { banners, blogs, podcasts, communityEvents, artworks } = await nervapeApi.fnGetCommunityConfig();

        setBanners(banners);
        setBlogs(blogs);
        setPodcasts(podcasts);
        setCommunityEvents(communityEvents);
        setArtworks(artworks);
        setCurrArtwork(artworks.length ? artworks[0] : null);
    }

    function openLink(link: string) {
        link && window.open(link, '_blank');
    }

    SwiperCore.use([Autoplay]);

    useEffect(() => {
        fnGetCommunityData();
    }, []);

    return (
        <div className="community-container">
            <section className="banner-section section">
                {/* <Swiper
                    freeMode={true}
                    grabCursor={true}
                    pagination={{ clickable: true }}
                    className="swiper"
                    onSlideChange={(e) => {
                        setBannerActiveIndex(e.activeIndex);
                    }}
                    onSwiper={(swiper) => {
                        setSwiper(swiper);
                    }}
                >
                    {banners?.map((banner, index) => {
                        return (
                            <SwiperSlide key={index}>
                                <div className="swiper-item flex-align" onClick={() => {
                                }}>
                                    {state.windowRealWidth < 750 && (
                                        <div className="item item-right">
                                            <img className="banner" src={banner.cover_image} alt="" />
                                        </div>
                                    )}
                                    <div className="item item-left flex-align" style={{ background: banner.background }}>
                                        <div className="banner-info">
                                            <div className="type-date flex-align">
                                                <div className="type">{banner.type}</div>
                                                <div className="date">{banner.start_date}</div>
                                            </div>
                                            <div className="item-title ellipsis-1">{banner.title}</div>

                                            {banner.type == Community_Type.Podcast && (
                                                <div className="banner-podcast flex-align">
                                                    {banner.participant_infomation?.map((part, p_i) => {
                                                        return (
                                                            <div className="part-info" key={p_i}>
                                                                <div className="identity">{part.identity}</div>
                                                                <div className="avatar">
                                                                    <img src={part.avatar} alt="" />
                                                                </div>
                                                                <div className="name">{part.name}</div>
                                                                <div className="twitter" onClick={() => {
                                                                    window.open(part.link, '_blank');
                                                                }}>{part.twitter}</div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                            <div className="sub-title ellipsis-2">{banner.sub_title}</div>

                                            <div className="tags flex-center">
                                                {banner.tags.split(',').map((tag, t_i) => {
                                                    return <div className="tag" key={t_i}>{tag}</div>;
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    {state.windowRealWidth >= 750 && (
                                        <div className="item item-right">
                                            <img className="banner" src={banner.cover_image} alt="" />
                                        </div>
                                    )}
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper> */}

                {/* <div className="swiper-dots flex-center">
                    <div className={`left-arrow cursor ${bannerActiveIndex == 0 && 'disabled'}`}>
                        <img onClick={() => {
                            swiper?.slidePrev();
                        }} src={ArrowIcon} alt="" />
                    </div>
                    {banners.map((banner, index) => {
                        return <div
                            key={index}
                            onClick={() => {
                                swiper?.slideTo(index);
                                setBannerActiveIndex(index);
                            }}
                            className={`dot cursor transition ${index == bannerActiveIndex && 'active'}`}></div>;
                    })}
                    <div className={`right-arrow cursor ${banners.length - 1 == bannerActiveIndex && 'disabled'}`}>
                        <img onClick={() => {
                            swiper?.slideNext();
                        }} src={ArrowIcon} alt="" />
                    </div>
                </div> */}
                {/* <img className="banner" src="https://nervape-storage.s3.ap-southeast-1.amazonaws.com/album-dev/production/0b35f875-fb40-47f7-88ca-82d51db8d65e.png" alt="" /> */}
                <video id="video"
                    playsInline
                    loop
                    preload="true"
                    autoPlay
                    muted className="banner" src="https://nervape-storage.s3.ap-southeast-1.amazonaws.com/album-main/production/752873cc-9e57-4bd8-a34c-5c6a6b500875.mp4"></video>

                <div className="community-news-bg">
                    <div className="community-news-content">
                        <div className="banner-title">Community News</div>
                        <div className="desc">Keep up to <span>ape</span> date with the latest Nervape community events, blogs, podcasts, and more.</div>

                        <div className="community-news flex-align">
                            {banners.filter((banner, index) => index < 3).map((banner, index) => {
                                return (
                                    <>
                                        <div className="community-news-item cursor" onClick={() => {
                                            openLink(banner.link);
                                        }} key={index}>
                                            <div className="type-date flex-align">
                                                <div className="type ellipsis-1">{banner.type}</div>
                                                <div className="date ellipsis-1">{banner.start_date}</div>
                                            </div>
                                            <div className="item-title ellipsis-2">{banner.title}</div>
                                        </div>
                                        {index < 2 && (
                                            <div className="line"></div>
                                        )}
                                    </>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {blogs.length > 0 && (
                <section className="blog-section section">
                    <div className="title">Blog</div>
                    <div className="blog-content flex-align">
                        {state.windowRealWidth > 600 ? (
                            <>
                                {blogs.filter((b, i) => {
                                    if (state.windowRealWidth >= 1000 && state.windowRealWidth <= 1440) {
                                        return i < 3;
                                    } else if (state.windowRealWidth >= 600 && state.windowRealWidth < 1000) {
                                        return i < 2;
                                    } else {
                                        return i < 4;
                                    }
                                }).map((blog, index) => {
                                    return (
                                        <div className="blog-item cursor" onClick={() => {
                                            openLink(blog.link);
                                        }} key={index}>
                                            <div className="cover-image">
                                                <img src={blog.cover_image} alt="" />
                                            </div>
                                            <div className="item-title">{blog.title}</div>
                                            <div className="item-date">{blog.start_date}</div>
                                            <div className="item-sub-title">{blog.sub_title}</div>
                                            <div className="tags flex-align">
                                                {blog.tags.split(',').map((tag, t_i) => {
                                                    return <div className="tag" key={t_i}>{tag}</div>;
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        ) : (
                            <>
                                <div className="blog-item cursor" onClick={() => {
                                    openLink(blogs[0].link);
                                }}>
                                    <div className="cover-image">
                                        <img src={blogs[0].cover_image} alt="" />
                                    </div>
                                    <div className="item-title">{blogs[0].title}</div>
                                    <div className="item-date">{blogs[0].start_date}</div>
                                    <div className="item-sub-title">{blogs[0].sub_title}</div>
                                    <div className="tags flex-align">
                                        {blogs[0].tags.split(',').map((tag, t_i) => {
                                            return <div className="tag" key={t_i}>{tag}</div>;
                                        })}
                                    </div>
                                </div>

                                {blogs.filter((p, i) => i > 0 && i < 3).map((p, i) => {
                                    return (
                                        <div className="podcast-item flex-align cursor" onClick={() => {
                                            openLink(p.link);
                                        }} key={i}>
                                            <div className="cover-image">
                                                <img src={p.cover_image} alt="" />
                                            </div>
                                            <div className="item-right">
                                                <div className="item-title">{p.title}</div>
                                                <div className="item-date">{p.start_date}</div>
                                                <div className="tags flex-align">
                                                    {p.tags.split(',').map((tag, t_i) => {
                                                        return <div className="tag" key={t_i}>{tag}</div>;
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </div>
                    <div className="discover-more cursor underline" onClick={() => {
                        window.open('https://medium.com/@Nervape', '_blank');
                    }}>discover more...</div>
                </section>
            )}

            {podcasts.length > 0 && (
                <section className="podcast-section section">
                    <div className="title">Podcast</div>
                    <div className="podcast-content flex-align">
                        <div className="podcast-left cursor" onClick={() => {
                            openLink(podcasts[0].link);
                        }}>
                            <div className="cover-image">
                                <img src={podcasts[0].cover_image} alt="" />
                            </div>
                            <div className="podcast-info">
                                <div className="item-title">{podcasts[0].title}</div>
                                <div className="item-date">{podcasts[0].start_date}</div>
                                <div className="item-sub-title">{podcasts[0].sub_title}</div>
                                <div className="tags flex-align">
                                    {podcasts[0].tags.split(',').map((tag, t_i) => {
                                        return <div className="tag" key={t_i}>{tag}</div>;
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="podcast-right">
                            {podcasts.filter((p, i) => {
                                if (state.windowRealWidth > 1000) {
                                    return i > 0;
                                } else {
                                    return i > 0 && i < 3;
                                }
                            }).map((p, i) => {
                                return (
                                    <div className="podcast-item flex-align cursor" onClick={() => {
                                        openLink(p.link);
                                    }} key={i}>
                                        <div className="cover-image">
                                            <img src={p.cover_image} alt="" />
                                        </div>
                                        <div className="item-right">
                                            <div className="item-title">{p.title}</div>
                                            <div className="item-date">{p.start_date}</div>
                                            <div className="tags flex-align">
                                                {p.tags.split(',').map((tag, t_i) => {
                                                    return <div className="tag" key={t_i}>{tag}</div>;
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="discover-more cursor underline" onClick={() => {
                                window.open('https://www.nervapepodcast.com/', '_blank');
                            }}>discover more...</div>
                        </div>
                    </div>
                </section>
            )}

            {communityEvents.length > 0 && (
                <section className="community-event-section section">
                    <div className="title">Community Events</div>
                    <div className="community-content">
                        <Swiper
                            slidesPerView='auto'
                            centeredSlides={true}
                            spaceBetween={64}
                            freeMode={true}
                            grabCursor={true}
                            pagination={{ clickable: true }}
                            className="swiper"
                            onSlideChange={(e) => {
                                setCommunityActiveIndex(e.activeIndex);
                            }}
                            onSwiper={(swiper) => {
                                setCommunitySwiper(swiper);
                            }}
                        >
                            {communityEvents?.map((community, index) => {
                                return (
                                    <SwiperSlide key={index}>
                                        <div className={`swiper-item cursor transition ${communityActiveIndex == index && 'focus'}`} onClick={() => {
                                            openLink(community.link)
                                        }}>
                                            <div className="cover-image">
                                                <img src={community.cover_image} alt="" />
                                            </div>
                                            <div className="community-info">
                                                <div className="date-status flex-align">
                                                    <div className="date">{`${community.start_date} - ${community.end_date}`}</div>
                                                    <div className={`status ${community.status}`}>{community.status}</div>
                                                </div>

                                                <div className="item-title">{community.title}</div>
                                                <div className="tags flex-align">
                                                    {community.tags.split(',').map((tag, t_i) => {
                                                        return <div className="tag" key={t_i}>{tag}</div>;
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>

                        <div className="swiper-dots flex-center">
                            <div className={`left-arrow cursor ${communityActiveIndex == 0 && 'disabled'}`}>
                                <img onClick={() => {
                                    communitySwiper?.slidePrev();
                                }} src={ArrowIcon} alt="" />
                            </div>
                            {communityEvents.map((community, index) => {
                                return <div
                                    key={index}
                                    onClick={() => {
                                        communitySwiper?.slideTo(index);
                                        setCommunityActiveIndex(index);
                                    }}
                                    className={`dot cursor transition ${index == communityActiveIndex && 'active'}`}></div>;
                            })}
                            <div className={`right-arrow cursor ${communityEvents.length - 1 == communityActiveIndex && 'disabled'}`}>
                                <img onClick={() => {
                                    communitySwiper?.slideNext();
                                }} src={ArrowIcon} alt="" />
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {artworks.length > 0 && (
                <section className="artwork-section section">
                    <div className="title">Artworks</div>

                    <div className="artwork-content">
                        {state.windowRealWidth > 600 && (
                            <div className="artwork-info flex-align">
                                <div className="cover-image cursor" onClick={() => {
                                    setShowArtworkDetail(true);
                                    updateBodyOverflow(false);
                                }}>
                                    <img src={currArtwork?.cover_image} alt="" />
                                </div>

                                <div className="artwork">
                                    <div className="item-title">{currArtwork?.title}</div>
                                    <div className="item-date">{currArtwork?.start_date}</div>
                                    <div className="item-sub-title">{currArtwork?.sub_title}</div>
                                    <div className="tags flex-align">
                                        {currArtwork?.tags.split(',').map((tag, t_i) => {
                                            return <div className="tag" key={t_i}>{tag}</div>;
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="artworks flex-align">
                            {artworks.map((artwork, index) => {
                                return (
                                    <div className="cover-image cursor" onClick={() => {
                                        setCurrArtwork(artwork);

                                        if (state.windowRealWidth < 750) {
                                            setShowArtworkDetail(true);
                                            updateBodyOverflow(false);
                                        }
                                    }} key={index}>
                                        <img src={artwork.cover_image} alt="" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            <Footer></Footer>

            <FullscreenPreview
                community={currArtwork}
                show={showArtworkDetail}
                close={
                    () => {
                        setShowArtworkDetail(false);
                        updateBodyOverflow(true);
                    }}></FullscreenPreview>
        </div>
    );
}
