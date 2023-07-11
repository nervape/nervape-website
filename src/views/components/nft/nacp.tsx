import React from "react";
import { useContext } from "react";
import { DataContext } from "../../../utils/utils";
import DetailCloseIcon from '../../../assets/images/nft/close_detail.svg';
import { NacpMetadata } from "../../../nervape/nacp";
import './nacp.less';
import { NacpCategoryIcons } from "../../../nervape/svg";

export default function NacpApeDetail(props: {
    show: boolean;
    close: any;
    nacp: NacpMetadata;
    editNacp: any;
}) {
    const { state, dispatch } = useContext(DataContext);
    const { show, close, nacp, editNacp } = props;

    if (!nacp) return <></>;

    return (
        <div className={`nacp-ape-detail-container popup-container ${show && 'show'}`} onClick={close}>
            <div className="popup-content nft-card-detail" onClick={e => e.stopPropagation()}>
                <div className="preview-model">
                    <img src={nacp.image} className="cover-image" alt="" />
                    {state.windowWidth !== 1200 && (
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

                        <div className="nacp-categories flex-align">
                            {
                                nacp?.categories && nacp.categories.map((category, index) => {
                                    return (
                                        <div className={`nacp-category flex-align ${category.status == 1 && 'active'}`} key={index}>
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
                        <div className="btn-groups">
                            <button
                                className="btn cursor profile"
                                onClick={() => {
                                    // 设置头像
                                }}>
                                SET PROFILE IMAGE
                            </button>
                            <button
                                className="btn cursor edit"
                                onClick={() => {
                                    // edit
                                    close();
                                    editNacp();
                                }}
                            >
                                EDIT
                            </button>
                            <button
                                className="btn cursor opensea"
                                onClick={() => {
                                    console.log('opensea');
                                }}
                            >
                                VIEW ON OPENSEA
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
