import React from "react";
import './index.less';

export default function LeaveConfirm(props: any) {
    const { close, show, confirm, verifyResult } = props;
    return (
        <div className={`leave-confirm-container popup-container ${show && 'show'}`}>
            <div className="confirm-content">
                <div className="desc">
                    {verifyResult?.challenge 
                        ? 'You haven’t claim the Story Oat. Are you sure that you want to leave? You can claim the oat later.' 
                        : 'Are you sure that you want to leave the challenge'}
                </div>
                <div className="btn-groups">
                    <button className="cancel btn" onClick={close}>
                        NO
                    </button>
                    <button className="confirm btn" onClick={confirm}>
                        YES
                    </button>
                </div>
            </div>
        </div>
    );
}
