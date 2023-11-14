import React from "react";
import './claim-operate.less';

export default function ClaimOperate(props: any) {
    const {
        close,
        confirm,
        point,
        disabled } = props;
    return (
        <div className={`claim-operate-container`}>
            <div className="confirm-content flex-align">
                <div className="left-point">
                    <div className="selected-block">Selected Block:</div>
                    <div className="value">{`(${point?.x || '-'}, ${point?.y || '-'})`}</div>
                </div>
                <div className="btn-groups">
                    <div className="cursor cancel btn" onClick={close}>
                        Cancel
                    </div>
                    <button className="cursor confirm btn" style={{ opacity: disabled ? 0.5 : 1 }} disabled={disabled} onClick={confirm}>
                        Claim
                    </button>
                </div>
            </div>
        </div>
    );
}
