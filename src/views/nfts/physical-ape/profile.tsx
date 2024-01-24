import React, { useEffect, useState } from "react";
import './profile.less';
import { useParams } from "react-router";
import { nervapeApi } from "../../../api/nervape-api";
import { PhysicalNFTGridImage } from "../../../nervape/physical-nft";

import PhysicalIcon from '../../../assets/gallery/physical/physical_icon.svg';
import Footer from "../../components/footer";
import { useFetchPhysicalNFTOwnOf } from "../../../hooks/useERC721";
import { NavTool } from "../../../route/navi-tool";

export default function PhysicalNftProfile() {
    const params = useParams();

    const [physicalImage, setPhysicalImage] = useState<PhysicalNFTGridImage>();
    const [currImage, setCurrImage] = useState('');
    const [detail, setDetail] = useState<{ name: string, value: string | undefined }[]>([]);
    const [address, setAddress] = useState('');

    if (!params.token_id) return <></>;

    const fetchPhysicalNFTOwnOf = useFetchPhysicalNFTOwnOf(parseInt(params.token_id), 5);

    useEffect(() => {
        if (!params.token_id) return;

        nervapeApi.fnGetProfileByTokenId(parseInt(params.token_id)).then(async res => {
            setPhysicalImage(res);

            const _address = await fetchPhysicalNFTOwnOf();
            setAddress(_address);

            if (res && res.images.length) {
                setCurrImage(res.images[0]);
            }
        })
    }, [params.token_id]);

    useEffect(() => {
        setDetail([
            {
                name: 'Category',
                value: physicalImage?.nft?.category
            },
            {
                name: 'Date Produced',
                value: physicalImage?.nft?.date_produced
            },
            {
                name: 'Nervape ID#',
                value: `#${parseInt(params.token_id || '0')}`
            },
            {
                name: 'Form',
                value: physicalImage?.nft?.form
            },
            {
                name: 'Material',
                value: physicalImage?.nft?.material
            },
            {
                name: 'Dimensions',
                value: physicalImage?.nft?.dimensions
            }
        ]);
    }, [physicalImage]);

    if (!physicalImage) return <></>;

    return (
        <div className="physical-nft-profile-container">
            <section className="section profile-section">
                <div className="profile-content">
                    <div className="bread-crumbs">
                        <div className="root-bread"><span className="cursor" onClick={() => {
                            NavTool.fnJumpToPage('/nervape-artifacts');
                        }}>Nervape Artifacts</span> / <span className="cursor" onClick={() => {
                            NavTool.fnJumpToPage(`/nervape-artifacts/${params.name}`);
                        }}>{params.name}</span> / <span className="curr-bread">{`${physicalImage?.nft?.name} #${params.token_id}`}</span></div>
                    </div>

                    <div className="profile-info flex-align">
                        <div className="image-content">
                            <div className="cover-image">
                                <img className="big" src={currImage} alt="" />
                            </div>

                            <div className="images flex-align">
                                {physicalImage?.images.map((image) => {
                                    return (
                                        <div className="image cursor" onClick={() => {
                                            setCurrImage(image);
                                        }}>
                                            <img src={image} alt="" />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="info-content">
                            <div className="nft-name">{`${physicalImage?.nft?.name} #${params.token_id}`}</div>

                            <div className="about">
                                <div className="title">About</div>
                                <div className="desc">{physicalImage?.nft?.description}</div>
                            </div>

                            <div className="detail">
                                <div className="title">Detail</div>

                                <div className="detail-c flex-align">
                                    {detail.map((d, index) => {
                                        return (
                                            <div className="detail-item" key={index}>
                                                <div className="name">{d.name}</div>
                                                <div className="value">{d.value}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="current-address">
                                <div className="title">Current Owner</div>

                                <div className="address">{address}</div>

                                <div className="nft-card flex-align">
                                    <img className="icon" src={PhysicalIcon} alt="" />
                                    NFT CARD
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section fellow-nervapes">
                <div className="title">Fellow Nervapes</div>

                <div className="recommends flex-align">
                    {physicalImage?.recommends?.map((recommend, index) => {
                        return (
                            <div className="recommend" onClick={() => {
                                NavTool.fnJumpToPage(`/nervape-artifacts/${recommend.path_name}`);
                            }} key={index}>
                                <img src={recommend.image} alt="" />
                            </div>
                        )
                    })}
                </div>
            </section>

            <Footer></Footer>
        </div>
    );
}
