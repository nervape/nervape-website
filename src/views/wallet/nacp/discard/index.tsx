import React from "react";
import './index.less';

export default function DiscardPopup(props: any) {
    const { close, show, confirm } = props;
    return (
        <div className={`discard-container popup-container ${show && 'show'}`}>
            <div className="confirm-content">
                <div className="desc">
                    Careful! Are you sure you want to leave the edit mode without saving?
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
