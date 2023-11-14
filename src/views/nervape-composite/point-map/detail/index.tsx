import React, { useContext, useEffect } from "react";
import './index.less';
import { PointMapItem } from "..";
import { DataContext } from "../../../../utils/utils";
import CloseIcon from '../../../../assets/nft/close_detail.svg';
import { WALLET_CONNECT } from "../../../../utils/Wallet";

export default function PointMapDetail(props: {
    show: Boolean;
    point: PointMapItem;
    close: Function;
    loginInfo: WALLET_CONNECT;
    updateApe: Function;
}) {
    const { state, dispatch } = useContext(DataContext);
    const { show, point, close, loginInfo, updateApe } = props;

    return (
        <div className={`point-map-detail-container popup-container ${show && 'show'}`}>
            <div className="point-map-detail-content popup-content">
                <div className="close-btn cursor" onClick={() => { close() }}>
                    <img src={CloseIcon} alt="" />
                </div>
                <div className="image-cover">
                    <img src={point.url} alt="" />
                </div>

                <div className="detail-info">
                    <div className="flex-align">
                        <div className="position">{`(${point.point_x}, ${point.point_y})`}</div>
                        <div className="status" style={{
                            background: loginInfo?.address == point.address ? '#12A7E3' : '#F2B312'
                        }}>
                            {loginInfo?.address == point.address ? 'owned by me' : 'occupied'}
                        </div>
                    </div>
                    <div className="epoch">Epoch: {point.epoch}</div>
                    <div className="owner">Block Owner: {point.address}</div>

                    {loginInfo?.address == point.address && (
                        <div className="btn-groups flex-align">
                            <button className="update-btn cursor" onClick={() => {
                                updateApe();
                            }}>UPDATE MY APE</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
