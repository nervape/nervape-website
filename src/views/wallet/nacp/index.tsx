import React, { useContext, useEffect, useState } from "react";
import './index.less';

import NacpLogo from '../../../assets/wallet/NACP_logo.svg';
import DefaultNacpApe from '../../../assets/wallet/nacp/default_nacp_ape.png';
import BonelistRequired from '../../../assets/wallet/nacp/Bonelist_Required.png';
import { Popover } from "antd";
import { nervapeApi } from "../../../api/nervape-api";
import { DataContext } from "../../../utils/utils";
import { NACP_APE, NACP_SPECIAL_ASSET } from "../../../nervape/nacp";
import AssetItem from "./asset-item";

export default function WalletNacp(props: { isFold: boolean; isBonelist: boolean; setLoading: Function; }) {
    const { isFold, isBonelist, setLoading } = props;

    const { state, dispatch } = useContext(DataContext);

    const [currNacpTab, setCurrNacpTab] = useState('ape');
    const [nacpApes, setNacpApes] = useState<NACP_APE[]>([]);
    const [nacpAssets, setNacpAssets] = useState<NACP_SPECIAL_ASSET[]>([]);
    const [activityAssets, setActivityAssets] = useState<any[]>([]);

    useEffect(() => {
        let _apes: NACP_APE[] = [];

        for (let i = 0; i < 3; i++) {
            let isRight = false;

            if (i == 0) isRight = true;
            else {
                isRight = isBonelist;
            }
            _apes.push({
                coverImage: DefaultNacpApe,
                name: `NACP Spot #${i + 1}`,
                isRight: isRight
            })
        }
        setNacpApes(_apes);
    }, [isBonelist]);

    useEffect(() => {
        if (currNacpTab == 'asset') {
            fnGetStorySpecialAsset(state.currentAddress);
            fnGetUserAsseta(state.currentAddress);
        }
    }, [currNacpTab]);

    async function fnGetStorySpecialAsset(address: string) {
        setLoading(true);
        const assets = await nervapeApi.fnGetStorySpecialAsset(address);
        setNacpAssets(assets);
        setLoading(false);
    }

    async function fnGetUserAsseta(address: string) {
        setLoading(true);
        const assets = await nervapeApi.fnGetUserAsseta(address);
        const _assets: NACP_SPECIAL_ASSET[] = assets.map((asset: any) => {
            asset.asset.isObtain = true;
            return asset.asset;
        })
        setActivityAssets(_assets);
        setLoading(false);
    }

    const ApeItem = (props: { ape: NACP_APE }) => {
        const { ape } = props;

        const _html = () => {
            return (
                <div className="nacp-ape-item">
                    <div className="cover-image">
                        <img className="cover" src={ape.coverImage} alt="DefaultNacpApe" />
                        {!ape.isRight && (
                            <div className="cover-no-right transition flex-center">
                                <img src={BonelistRequired} className="no-right-image" alt="" />
                                <div className="bonelist-required">Bonelist Required</div>
                                <div className="tip">
                                    You need to get Bonelisted (Aka Whitelisted) to unlock this spot.
                                </div>
                                <a
                                    target="_block"
                                    href="https://tourmaline-elderberry-f93.notion.site/NACP-Bonelist-Aka-Whitelist-f021cb54342549ae95f752d393ab3211"
                                    className="how-get transition">How to get bonelisted?</a>
                            </div>
                        )}
                    </div>
                    <div className="name">{ape.name}</div>
                </div>
            );
        };

        if (ape.isRight) {
            return (
                <Popover
                    color="#506077"
                    placement="bottom"
                    overlayClassName="nacp-ape-popover"
                    content={() => {
                        return (
                            <div className="nacp-ape-hover-popover">
                                <p>Each open spot allows you to mint one NACP NFT when it’s launched.</p>
                                <a target="_block" href="/nacp">Learn More</a>
                            </div>
                        );
                    }}>
                    {_html()}
                </Popover>
            );
        }
        return _html();
    }

    return (
        <div className={`wallet-nacp-container ${isFold && 'fold'}`}>
            <div className="wallet-nacp-header transition position-sticky flex-align">
                <div className="nacp-logo">
                    <img src={NacpLogo} alt="NacpLogo" />
                </div>

                <div className="nacp-tabs flex-align">
                    <div className={`nacp-tab cursor transition nacp-ape-tab ${currNacpTab == 'ape' && 'active'}`} onClick={() => { setCurrNacpTab('ape') }}>APE</div>
                    <div className={`nacp-tab cursor transition nacp-asset-tab ${currNacpTab == 'asset' && 'active'}`} onClick={() => { setCurrNacpTab('asset') }}>ASSET</div>
                </div>
            </div>

            <div className="wallet-nacp-content">
                {currNacpTab == 'ape' ? (
                    <div className="nacp-content-apes flex-align">
                        {/* {nacpApes.map((ape, index) => {
                            return <ApeItem ape={ape} key={index}></ApeItem>
                        })} */}
                    </div>
                ) : (
                    <div className="nacp-content-assets flex-align">
                        {activityAssets.map((asset, index) => {
                            return <AssetItem asset={asset} key={index} ></AssetItem>
                        })}
                        {nacpAssets.map((asset, index) => {
                            return <AssetItem asset={asset} key={index} ></AssetItem>
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
