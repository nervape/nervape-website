import React from "react";
import './mint.less';
import { SwitchChainSpan } from "../../../components/switchChain";
import { goerli } from "wagmi";

export default function MintTipPopup(props: any) {
    const { show, close, confirm } = props;
    return (
        <div className={`mint-tip-popup-container popup-container ${show && 'show'}`}>
            <div className="confirm-content">
                <div className="desc">
                    This action will mint all 3 NACP apes according to your available spots.
                </div>
                <div className="btn-groups">
                    <button className="cancel btn" onClick={close}>
                        CANCEL
                    </button>
                    <button className="confirm btn" onClick={confirm}>
                        PROCEED TO MINT
                    </button>
                </div>
            </div>
        </div>
    );
}
