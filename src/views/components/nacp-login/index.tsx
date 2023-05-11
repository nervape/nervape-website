import React from "react";
import { useNetwork } from "wagmi";
import { godWokenTestnet } from "../../../utils/Chain";
import { SwitchChainSpan } from "../switchChain";
import './index.less';

export default function NacpLogin(props: any) {
    const { show, logout } = props;

    const { chain } = useNetwork();

    return (
        <div className={`confirm-container popup-container ${show && 'show'}`}>
            <div className="confirm-content">
                <div className="desc">
                    Your remaining balance after the transaction will be smaller than 63 CKB, which
                    is insufficient for making another trasfer.
                </div>
                <div className="btn-groups">
                    {chain?.id != godWokenTestnet.id ? (
                        <button className="confirm btn">
                            <SwitchChainSpan title="Switch Chain" chainId={godWokenTestnet.id}></SwitchChainSpan>
                        </button>
                    ) : (
                        <button className="confirm btn" onClick={logout}>
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </div >
    );
}
