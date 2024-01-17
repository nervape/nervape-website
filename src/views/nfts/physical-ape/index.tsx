import React, { useContext, useEffect, useState } from "react";
import './index.less';

import PhysicalIcon from '../../../assets/gallery/physical/physical_icon.svg';
import MarkerIcon from '../../../assets/gallery/physical/marker.svg';
import PhotoIcon from '../../../assets/gallery/physical/photo_icon.svg';
import { nervapeApi } from "../../../api/nervape-api";
import { AboutQuestion, PhysicalNFTGridImage, Physical_NFT } from "../../../nervape/physical-nft";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination } from "swiper";
import "swiper/css";
import 'swiper/css/pagination';
import { DataContext, updateBodyOverflow } from "../../../utils/utils";
import { GoogleMap, Libraries, Marker, useLoadScript } from "@react-google-maps/api";
import { CONFIG } from "../../../utils/config";
import Footer from "../../components/footer";
import { NavTool } from "../../../route/navi-tool";

const libraries: Libraries = ['places'];
const mapContainerStyle = {
    with: '100vw',
    height: '100%',
}

const center = {
    lat: 11.239519,
    lng: -159.061831,
}

const styles = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
    },
    {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
    },
    {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
    },
];

// 全屏预览
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FullscreenPreview(props: { nft?: PhysicalNFTGridImage; close: any; show: boolean; }) {
    const { nft, close, show } = props;

    return (
        <div className={`grid-fullscreen-container transition mask-cover ${show && 'show'}`} onClick={close}>
            <div className="fullscreen-image-cover-c" onClick={(e) => {
                e.stopPropagation();
            }}>
                <div className="info-c">
                    <div className="fullscreen-image-cover">
                        <img className="fullscreen-image" src={nft?.cover_image} alt="fullscreen-image" />
                    </div>

                    <div className="token-id">{`#${nft?.token_id}`}</div>
                    <div className="user-name flex-align">
                        <img className="photo-icon" src={PhotoIcon} alt="" />
                        {nft?.uploader}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PhysicalApe() {
    const { state } = useContext(DataContext);

    const [nfts, setNfts] = useState<Physical_NFT[]>([]);
    const [aboutQuestions, setAboutQuestions] = useState<AboutQuestion[]>([]);
    const [viewTab, setViewTab] = useState(0);
    const [gridImages, setGridImages] = useState<PhysicalNFTGridImage[]>([]);
    const [currGridImage, setCurrGridImage] = useState<PhysicalNFTGridImage>();
    const [showGridImage, setShowGridImage] = useState(false);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: CONFIG.GOOGLE_MAP_API_KEY,
        libraries,
    });

    async function fnGetnfts() {
        const res = await nervapeApi.fnGetAllPhysicalNfts();
        let _res: Physical_NFT[] = [];
        res.map((r: Physical_NFT) => {
            _res.push(r);
        })

        setNfts(_res);
    }

    async function initAboutQuestions() {
        setAboutQuestions([
            {
                q: 'What is a Physical Nervape?',
                a: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
            },
            {
                q: 'What is a Physical Nervape?',
                a: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
            },
            {
                q: 'What is a Physical Nervape?',
                a: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
            }
        ]);
    }

    async function fnGetImages() {
        const res = await nervapeApi.fnGetPhysicalNftImages();

        setGridImages(res);
    }

    SwiperCore.use([Autoplay, Pagination]);

    useEffect(() => {
        fnGetnfts();

        initAboutQuestions();

        fnGetImages();
    }, []);

    return (
        <>
            <div className="physical-ape-container">
                <div className="section banner-section">
                    <img className="banner user-select-none" src="https://nervape-storage.s3.ap-southeast-1.amazonaws.com/album-dev/production/593fcf23-4d17-47a4-9e3c-14cafec5f1ca.png" alt="" />
                    <div className="banner-content">
                        <div className="bread-crumbs">
                            <div className="root-bread">NFT Gallery / <span className="curr-bread">Physical Ape</span></div>
                        </div>
                        <div className="nft-info">
                            <img className="icon user-select-none" src={PhysicalIcon} alt="" />
                            <div className="name">Physical Ape</div>
                            <div className="desc">Slogan slogan here</div>
                        </div>
                    </div>
                </div>

                <div className="section ape-swiper-section">
                    <div className="title">Series</div>

                    <div className="swiper-content">
                        <Swiper
                            slidesPerView='auto'
                            centeredSlides={true}
                            spaceBetween={64}
                            freeMode={true}
                            grabCursor={true}
                            pagination={{ clickable: true }}
                            className="swiper"
                        >
                            {nfts?.map((nft, index) => {
                                return (
                                    <SwiperSlide key={index}>
                                        <div className="swiper-item" onClick={() => {
                                            NavTool.fnJumpToPage(`/physical-ape/${nft.path_name}`)
                                        }}>
                                            <img className="cover-image" src={nft.cover_image} alt="" />
                                            <div className="nft-info">
                                                <div className="name">{nft.name}</div>
                                                <div className="qty">Qty:{nft.total}</div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
                </div>

                <div className="section about-section">
                    <div className="about-content">
                        <div className="title">About Physical Nervape</div>
                        <div className="desc">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</div>
                        <div className="cover-image">
                            <img src="" alt="" />
                        </div>
                        <div className="questions flex-align">
                            {aboutQuestions.map((q, index) => {
                                return (
                                    <div className="about-question" key={index}>
                                        <div className="question">{q.q}</div>
                                        <div className="answer">{q.a}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="section ape-in-the-wild-section">
                    <div className="title">Apes In The Wild</div>

                    <div className="view-tabs flex-align">
                        <div className={`view cursor transition map-view ${viewTab == 0 && 'selected'}`} onClick={() => { setViewTab(0); }}>Map View</div>
                        <div className="line"></div>
                        <div className={`view cursor transition grid-view ${viewTab == 1 && 'selected'}`} onClick={() => { setViewTab(1); }}>Grid View</div>
                    </div>

                    <div className={`map-container transition ${viewTab == 0 && 'show'}`}>
                        {loadError && (
                            <div className="load-error">Error loading Maps</div>
                        )}

                        {!isLoaded ? (
                            <div className="map-load">Loading Maps</div>
                        ) : (
                            <div className="map-content">
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    zoom={5}
                                    options={{
                                        backgroundColor: '#000000',
                                        fullscreenControl: false,
                                        disableDefaultUI: true,
                                        styles: styles
                                    }}
                                    center={center}>
                                    {gridImages.map((grid, index) => {
                                        return (
                                            <Marker key={index}
                                                onClick={() => {
                                                    console.log(123);
                                                }}
                                                
                                                position={{ lat: grid.lat, lng: grid.lng }}
                                                title={grid?.nft?.name}
                                                icon={{
                                                    url: MarkerIcon,
                                                    scaledSize: new google.maps.Size(42, 55),
                                                }}
                                            ></Marker>
                                        );
                                    })}
                                </GoogleMap>
                            </div>
                        )}
                    </div>

                    <div className={`grid-container transition flex-align ${viewTab == 1 && 'show'}`}>
                        {gridImages.map((grid, index) => {
                            return (
                                <div className="grid-image flex-align" onClick={() => {
                                    setCurrGridImage(grid);
                                    setShowGridImage(true);
                                    updateBodyOverflow(false);
                                }} key={index}>
                                    <img className="cover-image" src={grid.cover_image} alt="" />
                                    <div className="hover-info transition">
                                        <div className="token-id">{`#${grid.token_id}`}</div>
                                        <div className="user-name flex-align">
                                            <img className="photo-icon" src={PhotoIcon} alt="" />
                                            {grid.uploader}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <Footer></Footer>

                <FullscreenPreview
                    nft={currGridImage}
                    show={showGridImage}
                    close={
                        () => {
                            setShowGridImage(false);
                            updateBodyOverflow(true);
                        }}></FullscreenPreview>
            </div >
        </>
    );
}
