import React, { useContext, useEffect } from "react";
import './index.less';
import { PointMapItem } from "..";
import { DataContext } from "../../../../utils/utils";
import CloseIcon from '../../../../assets/nft/close_detail.svg';

export default function PointMapDetail(props: { show: Boolean; point: PointMapItem; close: Function; }) {
    const { state, dispatch } = useContext(DataContext);
    const { show, point, close } = props;

    return (
        <div className={`point-map-detail-container popup-container ${show && 'show'}`}>
            <div className="point-map-detail-content popup-content">
                <div className="close-btn" onClick={() => { close() }}>
                    <img src={CloseIcon} alt="" />
                </div>
                <div className="image-cover">
                    <img src={point.url} alt="" />
                </div>

                <div className="detail-info">
                    <div className="flex-align">
                        <div className="position">{`(${point.point_x}, ${point.point_y})`}</div>
                        <div className="status" style={{
                            background: state.currentAddress.toLocaleLowerCase() == point.address ? '#6FBA80' : '#C6A83D'
                        }}>
                            {state.currentAddress.toLocaleLowerCase() == point.address ? 'owned by me' : 'occupied'}
                        </div>
                    </div>
                    <div className="epoch">Epoch:{point.epoch}</div>
                    <div className="owner">Block Owner:{point.address}</div>
                </div>
            </div>
        </div>
    );
}
