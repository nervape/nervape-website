import React from "react";
import './prompt.less';

export default function TransferBonelistPrompt(props: any) {
    const { show, close, confirm } = props;

    return (
        <div className={`transfer-bonelist-prompt-container popup-container ${show && 'show'}`}>
            <div className="popup-content transation prompt-content">
                <div className="title">Transfer Your Bonelist to Bitcoin Address</div>
                <div className="desc">As we are moving NACP into the Bitcoin ecosystem, your NACP Bonelist needs to be transferred to a Bitcoin address for it to work.</div>
                <div className="btn-groups flex-align">
                    <div className="confirm-btn btn cursor" onClick={confirm}>TRANSFER NOW</div>
                    <div className="skip-btn btn cursor" onClick={close}>SKIP FOR NOW</div>
                </div>
            </div>
        </div>
    );
}
