import React from "react";
import { useContext } from "react";
import { DataContext } from "../../../utils/utils";
import DetailCloseIcon from '../../../assets/images/nft/close_detail.svg';
import { NacpMetadata } from "../../../nervape/nacp";
import './nacp.less';
import { NacpCategoryIcons } from "../../../nervape/svg";
import { CONFIG } from "../../../utils/config";
import ProfileIcon from '../../../assets/wallet/nacp/profile.svg';
import EditIcon from '../../../assets/wallet/nacp/edit.svg';
import OpenseaIcon from '../../../assets/wallet/nacp/opensea.svg';

export default function NacpApeDetail(props: {
    show: boolean;
    close: any;
    nacp: NacpMetadata;
    editNacp?: any;
    setShowProfileImage?: Function;
}) {
    const { state, dispatch } = useContext(DataContext);
    const { show, close, nacp, editNacp, setShowProfileImage } = props;

    if (!nacp) return <></>;

    return (
        <div className={`nacp-ape-detail-container popup-container ${show && 'show'}`} onClick={close}>
            <div className="popup-content nft-card-detail" onClick={e => e.stopPropagation()}>
                <div className="preview-model">
                    <img src={nacp.image} className="cover-image" alt="" />
                    {state.windowWidth <= 1200 && (
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
                </div>
                <div className="detail-info m">
                    <div className="info-content">
                        <div className="name">{nacp.name}</div>
                        <div className="chain">
                            <span>ETHEREUM</span>
                        </div>

                        <div className="nacp-categories-c">
                            <div className="nacp-categories flex-align">
                                {
                                    nacp?.categories && nacp.categories.map((category, index) => {
                                        return (
                                            <div className={`nacp-category flex-align ${category.status == 1 && 'active'}`} key={index} title={category.asset && category.asset.name}>
                                                <div className="left-icon">
                                                    {NacpCategoryIcons.get(category.name)}
                                                </div>
                                                <div className="right-info">
                                                    <div className="category-name">{category.name}</div>
                                                    <div className="asset-name">{category.asset ? category.asset.name : '-'}</div>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                        <div className="btn-groups">
                            {editNacp && (
                                <div
                                    className="btn cursor edit"
                                    onClick={() => {
                                        // edit
                                        editNacp();
                                    }}
                                >
                                    <img src={EditIcon} alt="EditIcon" />
                                    EDIT
                                </div>
                            )}

                            {setShowProfileImage && (
                                <div
                                    className="btn cursor profile"
                                    onClick={() => {
                                        // 设置头像
                                        setShowProfileImage(nacp.id);
                                    }}>
                                    <img src={ProfileIcon} alt="ProfileIcon" />
                                    SET AS PFP
                                </div>
                            )}

                            <div
                                className="btn cursor opensea"
                                onClick={() => {
                                    console.log('opensea');
                                    window.open(CONFIG.NACP_OPENSEA_URL + CONFIG.NACP_ADDRESS + '/' + nacp.id);
                                }}
                            >
                                <img src={OpenseaIcon} alt="OpenseaIcon" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
