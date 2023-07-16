import React from "react";
import "./index.less";
import { NacpAsset } from "../../../../nervape/nacp";
import { NacpCategoryIcons } from "../../../../nervape/svg";
import EquipIcon from '../../../../assets/wallet/nacp/equip.svg';

export default function NacpAssetItem(props: { asset: NacpAsset; }) {
    const { asset } = props;

    return (
        <div className={`nacp-asset-item ${asset.is_equip && 'equip'}`}>
            <div className="cover-image" style={{ borderColor: asset.skin_color }}>
                <img className="cover" src={asset.thumb_url} alt="AssetCoverImage" />
                {asset.is_equip && (
                    <div className="tag-item flex-align" style={{background: asset.skin_color}}>
                        <img src={EquipIcon} className="equip-icon" alt="" />
                        <div className="ape-id">{'#' + asset.ape_id}</div>
                    </div>
                )}
            </div>
            <div className="asset-name">{asset.name}</div>
            <div className="category flex-align">
                {NacpCategoryIcons.get(asset.category_name || '')}
                <div className="category-name">{asset.category_name}</div>
            </div>
        </div>
    );
}
