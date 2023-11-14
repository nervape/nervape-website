import React from "react";
import './epoch-header.less';
import HalveLogo from '../../../assets/halve/halve_logo.svg';
import IIcon from '../../../assets/nacp/hallween/i_icon.svg';
import dayjs from "dayjs";

export default function EpochHeader(props: {
    epoch: number;
    setShowHalloweenInfo: Function;
    estimatedDate: Date;
    showNacpCreator: boolean;
}) {
    const { epoch, setShowHalloweenInfo, showNacpCreator, estimatedDate } = props;

    return (
        <div className="epoch-header-container">
            {!showNacpCreator && (
                <div className="epoch-logo flex-align">
                    <img className="logo" src={HalveLogo} alt="HalveLogo" />
                    <div className="info-icon flex-center" onClick={() => {
                        setShowHalloweenInfo(true);
                    }}>
                        <img className="icon cursor" src={IIcon} alt="IIcon" />
                    </div>
                </div>
            )}

            <div className="ckb-epoch cursor flex-align" onClick={() => {
                window.open('https://explorer.nervos.org/halving', '_blank');
            }}>
                <div className="epoch-item item">
                    <div className="title">Current CKB Epoch</div>
                    <div className="value">{`${epoch}/8760`}</div>
                </div>
                <div className="time-item item">
                    <div className="title">Est. Half Time</div>
                    <div className="value">{dayjs(estimatedDate).format('HH:mm:ss, DD/MM/YYYY')}</div>
                </div>
            </div>
        </div>
    );
}
