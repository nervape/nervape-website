import React from "react";
import './success.less';

export default function SaveSuccessPopup(props: any) {
    const { show, confirm } = props;
    return (
        <div className={`save-success-container popup-container ${show && 'show'}`}>
            <div className="confirm-content">
                <div className="desc">
                    Assets successfully updated! Yay! Heading back to the wallet page.
                </div>
                <div className="btn-groups">
                    <button className="confirm btn" onClick={confirm}>
                        DONE
                    </button>
                </div>
            </div>
        </div>
    );
}
