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

export default function CommunityPage() {
    const { state } = useContext(DataContext);

    const [banners, setBanners] = useState<Community[]>([]);
    const [blogs, setBlogs] = useState<Community[]>([]);
    const [podcasts, setPodcasts] = useState<Community[]>([]);
    const [communityEvents, setCommunityEvents] = useState<Community[]>([]);
    const [artworks, setArtworks] = useState<Community[]>([]);
    const [bannerActiveIndex, setBannerActiveIndex] = useState(0);
    const [swiper, setSwiper] = useState<SwiperCore>();

    async function fnGetCommunityData() {
        const { banners, blogs, podcasts, communityEvents, artworks } = await nervapeApi.fnGetCommunityConfig();

        setBanners(banners);
        setBanners(blogs);
        setBanners(podcasts);
        setBanners(communityEvents);
        setBanners(artworks);
    }

    SwiperCore.use([Autoplay]);

    useEffect(() => {
        fnGetCommunityData();
    }, []);

    return (
        <div className="community-container">
            <section className="banner-section">
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
                                    <div className="item item-left flex-align" style={{ background: banner.background }}>
                                        <div className="banner-info">
                                            <div className="type-date flex-align">
                                                <div className="type">{banner.type}</div>
                                                <div className="date">{banner.start_date}</div>
                                            </div>
                                            <div className="title">{banner.title}</div>

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
                                            <div className="sub-title">{banner.sub_title}</div>

                                            <div className="tags flex-center">
                                                {banner.tags.split(',').map((tag, t_i) => {
                                                    return <div className="tag" key={t_i}>{tag}</div>;
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="item item-right">
                                        <img className="banner" src={banner.cover_image} alt="" />
                                    </div>
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

            <section className="blog-section"></section>
        </div>
    );
}
