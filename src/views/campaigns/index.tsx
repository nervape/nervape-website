import React, { useContext, useEffect, useState } from "react";
import { nervapeApi } from "../../api/nervape-api";
import { Campaign, CampaignBanner, PoapBadge } from "../../nervape/campaign";
import "./index.less";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination } from "swiper";
import "swiper/css";
import 'swiper/css/pagination';
import { DataContext } from "../../utils/utils";

import BoneListImage from "../../assets/campaign/bonelist.png";

const boneList = [
    {
        name: 'WHAT IS BONELIST?',
        desc: 'The Nervape project is an ongoing saga and a story of friendship, courage, and trust among the first Nervapes that arrive at the Third Continent. As the Nervapes continue to explore the Third Continent, new characters, unique features of the land, and fantasy elements will be added as 3D NFTs to the Nervos blockchain.'
    },
    {
        name: 'HOW TO GET BONELIST?',
        desc: 'The Nervape project is an ongoing saga and a story of friendship, courage, and trust among the first Nervapes that arrive at the Third Continent. As the Nervapes continue to explore the Third Continent, new characters, unique features of the land, and fantasy elements will be added as 3D NFTs to the Nervos blockchain.'
    }
];

function BoneListItem(props: any) {
    const { item } = props;

    return (
        <div className="bl-item">
            <img src={BoneListImage} alt="BoneListImage" />
            <div className="info">
                <div className="name">{item.name}</div>
                <div className="desc">{item.desc}</div>
            </div>
        </div>
    );
}

function CampaignItem(props: { campaign: Campaign }) {
    const { campaign } = props;

    const startDate = new Date(campaign.startTime).toLocaleDateString("en-US");
    const endDate = new Date(campaign.endTime).toLocaleDateString("en-US");
    return (
        <div className="campaign-item">
            <img src={campaign.reward?.cover_image_url || campaign.reward?.image} alt="AwardCoverImage" />
            <div className="c-title">{campaign.title}</div>
            <div className="c-start-end-date">{`${startDate} - ${endDate}`}</div>
            <div className={`c-status ${campaign.timeline}`}>
                <div className="span">{campaign.timeline}</div>
            </div>
        </div>
    );
}

function PoapBadgeItem(props: { poap: PoapBadge }) {
    const { poap } = props;

    const startDate = new Date(poap.start_date).toLocaleDateString("en-US");
    const endDate = new Date(poap.end_date).toLocaleDateString("en-US");

    return (
        <div className="poap-item">
            <div className="p-info">
                <div className="p-name">{poap.name}</div>
                <div className="p-start-end-date">
                    <div className="date">{`${startDate} - ${endDate}`}</div>
                    <div className={`p-status ${poap.timeline}`}>{poap.timeline}</div>
                </div>
            </div>
            <div className="cover-image">
                <img src={poap.cover_image_url} alt="coverImage" />
            </div>
        </div>
    );
}

export default function CampaignPage() {
    const [banners, setBanners] = useState<CampaignBanner[]>([]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [poapBadges, setPoapBadges] = useState<PoapBadge[]>([]);

    const { windowWidth } = useContext(DataContext);
    console.log(windowWidth);
    SwiperCore.use([Autoplay, Pagination]);

    useEffect(() => {
        nervapeApi.fnGetCampaignBanners().then(res => {
            setBanners(res);
        });

        nervapeApi.fnGetCampaigns().then(res => {
            setCampaigns(res);
        });

        nervapeApi.fnGetPoapBadges().then(res => {
            setPoapBadges(res);
        });
    }, []);

    return (
        <div className="campaigns-container main-container">
            <Swiper
                onSlideChange={() => console.log('slide change')}
            >
                {banners?.map((banner, index) => {
                    return (
                        <SwiperSlide key={index}>
                            <div className="banner-image">
                                <img src={windowWidth !== 375 ? banner.imageUrl4k : banner.imageUrlsmail} alt="imageUrl4k" />
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
            <div className="bone-list">
                <div className="bl-content">
                    <div className="title">BONELIST 🦴</div>
                    <div className="bl-what-how">
                        <BoneListItem item={boneList[0]}></BoneListItem>
                        <BoneListItem item={boneList[1]}></BoneListItem>
                    </div>
                </div>
            </div>
            <div className="campaigns">
                <div className="campaigns-content">
                    <div className="title">
                        NFT <span>AWARD</span>
                    </div>
                    <div className="campaign-list">
                        {campaigns.map((campaign, index) => {
                            return <CampaignItem key={index} campaign={campaign}></CampaignItem>
                        })}
                    </div>
                </div>
            </div>
            <div className="poap-badges">
                <div className="poap-content">
                    <div className="title">
                        POAP <span>BADGE</span>
                    </div>
                    <div className="poap-list">
                        {poapBadges.map((poap, index) => {
                            return <PoapBadgeItem key={index} poap={poap}></PoapBadgeItem>
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
