import React from "react";
import './chain.less';
import { SwitchChainSpan } from "../../../components/switchChain";
import { goerli } from "wagmi";

export default function SwitchChainPopup(props: any) {
    const { show, close } = props;
    return (
        <div className={`switch-chain-popup-container popup-container ${show && 'show'}`}>
            <div className="confirm-content">
                <div className="desc">
                    Pleaes switch to Ethereum mainnet in order to see and interact with your NACP.
                </div>
                <div className="btn-groups">
                    <button className="cancel btn" onClick={close}>
                        CANCEL
                    </button>
                    <button className="confirm btn">
                        <SwitchChainSpan
                            setOpenClose={() => {
                                console.log('setOpenClose');
                            }}
                            title={'SWITCH NETWORK'}
                            chainId={goerli.id}></SwitchChainSpan>
                    </button>
                </div>
            </div>
        </div>
    );
}
