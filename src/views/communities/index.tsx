import React, { useContext, useEffect, useState } from "react";
import './index.less';

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination } from "swiper";
import "swiper/css";
import 'swiper/css/pagination';
import { DataContext } from "../../utils/utils";
import { NavTool } from "../../route/navi-tool";
import { Community, Community_Type } from "../../nervape/community";
import { nervapeApi } from "../../api/nervape-api";

import ArrowIcon from '../../assets/community/arrow.svg';
import Footer from "../components/footer";

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

    async function fnGetCommunityData() {
        const { banners, blogs, podcasts, communityEvents, artworks } = await nervapeApi.fnGetCommunityConfig();

        setBanners(banners);
        setBlogs(blogs);
        setPodcasts(podcasts);
        setCommunityEvents(communityEvents);
        setArtworks(artworks);
        setCurrArtwork(artworks.length ? artworks[0] : null);
    }

    SwiperCore.use([Autoplay]);

    useEffect(() => {
        fnGetCommunityData();
    }, []);

    useEffect(() => {
        console.log(state.windowRealWidth);
    }, [state.windowRealWidth]);

    return (
        <div className="community-container">
            <section className="banner-section section">
                <Swiper
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
                </Swiper>

                <div className="swiper-dots flex-center">
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
                </div>
            </section>

            {blogs.length && (
                <section className="blog-section section">
                    <div className="title">Blog</div>
                    <div className="blog-content flex-align">
                        {state.windowRealWidth > 750 ? (
                            <>
                                {blogs.filter((b, i) => {
                                    if (state.windowRealWidth >= 1000 && state.windowRealWidth <= 1440) {
                                        return i < 3;
                                    } else if (state.windowRealWidth >= 750 && state.windowRealWidth < 1000) {
                                        return i < 2;
                                    } else {
                                        return i < 4;
                                    }
                                }).map((blog, index) => {
                                    return (
                                        <div className="blog-item" key={index}>
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
                                <div className="blog-item">
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
                                        <div className="podcast-item flex-align" key={i}>
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
                    <div className="discover-more cursor underline">discover more...</div>
                </section>
            )}

            {podcasts.length && (
                <section className="podcast-section section">
                    <div className="title">Podcast</div>
                    <div className="podcast-content flex-align">
                        <div className="podcast-left">
                            <div className="cover-image">
                                <img src={podcasts[0].cover_image} alt="" />
                            </div>
                            <div className="item-title">{podcasts[0].title}</div>
                            <div className="item-date">{podcasts[0].start_date}</div>
                            <div className="item-sub-title">{podcasts[0].sub_title}</div>
                            <div className="tags flex-align">
                                {podcasts[0].tags.split(',').map((tag, t_i) => {
                                    return <div className="tag" key={t_i}>{tag}</div>;
                                })}
                            </div>
                        </div>
                        <div className="podcast-right">
                            {podcasts.filter((p, i) => i > 0).map((p, i) => {
                                return (
                                    <div className="podcast-item flex-align" key={i}>
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

                            <div className="discover-more cursor underline">discover more...</div>
                        </div>
                    </div>
                </section>
            )}

            {communityEvents.length && (
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
                                        <div className="swiper-item" onClick={() => {
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

            {artworks.length && (
                <section className="artwork-section section">
                    <div className="title">Artworks</div>

                    <div className="artwork-content">
                        {state.windowRealWidth > 750 && (
                            <div className="artwork-info flex-align">
                                <div className="cover-image">
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
        </div>
    );
}
