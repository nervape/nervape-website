import React from "react";
import './epoch-header.less';

export default function EpochHeader(props: any) {
    const { epoch } = props;
    
    return (
        <div className="epoch-header-container flex-align">
            <div className="epoch-item item">
                <div className="title">Epoch</div>
                <div className="value">{`${epoch}/8760`}</div>
            </div>
            <div className="time-item item">
                <div className="title">Est.Time</div>
                <div className="value">hh:rr,dd/mm/yy</div>
            </div>
        </div>
    );
}
