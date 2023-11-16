import React from "react";
import './epoch-header.less';
import HalveLogo from '../../../assets/halve/halve_logo.svg';
import IIcon from '../../../assets/nacp/hallween/i_icon.svg';
import dayjs from "dayjs";
import { MaxBlockCount, UsedCount } from ".";
import { isMobile } from "../../../utils/utils";

export default function EpochHeader(props: {
    epoch: number;
    setShowHalloweenInfo: Function;
    estimatedDate: Date;
    showNacpCreator: boolean;
    usedCount: UsedCount;
}) {
    const { epoch, setShowHalloweenInfo, showNacpCreator, estimatedDate, usedCount } = props;

    return (
        <div className="epoch-ape-container">
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

                <div className={`ckb-epoch transition cursor flex-align ${showNacpCreator && 'hide'}`} onClick={() => {
                    if (isMobile()) return;
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
            {(!showNacpCreator || !isMobile()) && (
                <div className="current-ape-info flex-align">
                    <div className="halve-ape-created">Halve Ape Created: <span>{usedCount.create}</span></div>
                    <div className={`halve-ape-claimed ${usedCount.block >= MaxBlockCount && 'green'} ${((MaxBlockCount - usedCount.block > 0) && (MaxBlockCount - usedCount.block <= 50)) && 'yellow'}`}>
                        Block Claimed: <span>{usedCount.block}/{MaxBlockCount}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
