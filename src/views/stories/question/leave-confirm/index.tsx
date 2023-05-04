import React from "react";
import './index.less';

export default function LeaveConfirm(props: any) {
    const { close, show, confirm } = props;
    return (
        <div className={`leave-confirm-container ${show && 'show'}`}>
            <div className="confirm-content">
                <div className="desc">
                    Are you sure that you want to leave the challenge?
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
