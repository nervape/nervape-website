import React, { useEffect, useState } from "react";
import './ape.less';
import { useParams } from "react-router";
import { nervapeApi } from "../../../api/nervape-api";
import { Physical_NFT } from "../../../nervape/physical-nft";
import Footer from "../../components/footer";
import { NavTool } from "../../../route/navi-tool";

export default function PhysicalApeDetail() {
    const params = useParams();
    const [physicalNft, setPhysicalNft] = useState<Physical_NFT>();
    const [nfts, setNfts] = useState<Physical_NFT[]>([]);
    const [detail, setDetail] = useState<{ name: string, value: string | undefined }[]>([]);

    useEffect(() => {
        if (!params.name) return;
        nervapeApi.fnGetPhysicalApeDetail(params.name).then(res => {
            setPhysicalNft(res);
        })
    }, [params.name]);

    useEffect(() => {
        if (!physicalNft || !physicalNft.total) return;

        let _nfts: Physical_NFT[] = [];

        for (let i = 0; i < physicalNft.total; i++) {
            _nfts.push({
                ...physicalNft,
                token_index: parseInt(`800${(physicalNft?.class_id || 1) * 10000 + (i + 1)}`)
            })
        }

        setNfts(_nfts);
        setDetail([
            {
                name: 'Nervape ID#',
                value: `#${parseInt(`800${(physicalNft?.class_id || 1) * 10000 + 1}`)} - #${parseInt(`800${(physicalNft?.class_id || 1) * 10000 + physicalNft.total}`)} (${physicalNft.total} ct)`
            },
            {
                name: 'Category',
                value: physicalNft?.category
            },
            {
                name: 'Date Produced',
                value: physicalNft.date_produced
            },
            {
                name: 'Form',
                value: physicalNft.form
            },
            {
                name: 'Material',
                value: physicalNft.material
            },
            {
                name: 'Dimensions',
                value: physicalNft.dimensions
            }
        ]);
    }, [physicalNft]);

    if (!physicalNft) return <></>;

    return (
        <div className="physical-ape-detail-container">
            <div className="section banner-section user-select-none">
                <img className="banner" src={physicalNft.banner} alt="" />
                <div className="banner-content">
                    <div className="bread-crumbs">
                        <div className="root-bread"><span className="cursor" onClick={() => {
                            NavTool.fnJumpToPage('/nervape-artifacts');
                        }}>Nervape Artifacts</span> / <span className="curr-bread">{physicalNft?.name}</span></div>
                    </div>
                </div>
            </div>

            <div className="section nft-section">
                {/* <div className="title">Apes</div> */}

                <div className="apes flex-align">
                    {nfts.map((nft, index) => {
                        return (
                            <div
                                onClick={() => {
                                    NavTool.fnJumpToPage(`/nervape-artifacts/${params.name}/${nft.token_index}`)
                                }}
                                className={`ape-item image-hover cursor ${index == nfts.length - 1 && 'last'}`}
                                key={index}>
                                <img src={nft.image} className="image" alt="" />
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="section detail-section">
                <div className="detail-content">
                    <div className="title">Details</div>
                    <div className="desc">{physicalNft?.description}</div>

                    <div className="details flex-align">
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
            </div>

            <Footer></Footer>
        </div>
    );
}
