import React from "react";
import './claim-operate.less';

export default function ClaimOperate(props: any) {
    const {
        close,
        confirm,
        disabled } = props;
    return (
        <div className={`claim-operate-container`}>
            <div className="confirm-content">
                <div className="title">Claiming Your Block</div>
                <div className="desc">
                    This is the preview of your ape on the map. You won’t be able to change your block after claiming.
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
