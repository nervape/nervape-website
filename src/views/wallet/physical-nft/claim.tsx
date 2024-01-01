import React, { useContext, useState } from "react";
import './claim.less';
import { DataContext } from "../../../utils/utils";
import { nervapeApi } from "../../../api/nervape-api";
import { Tooltip } from "antd";
import { Physical_Code } from "../../../nervape/physical-nft";

export default function PhysicalNftClaim(props: any) {
    const { show, setPhysicalClaim, setLoading } = props;

    const { state, dispatch } = useContext(DataContext);

    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const [physicalClaimCode, setPhysicalClaimCode] = useState<Physical_Code>();

    const closeClaim = () => {
        setPhysicalClaim(false);
        setMessage('');
        setCode('');
        setCurrentStep(1);
    }

    return (
        <div className={`physical-nft-claim-container popup-container ${show && 'show'}`} onClick={() => {
            closeClaim();
        }}>
            <div className="popup-content transation physical-nft-claim-content" onClick={e => e.stopPropagation()}>
                <div className={`claim-step-content step-${currentStep}`}>
                    {currentStep == 1 ? (
                        <>
                            <div className="flex-align title-what-this">
                                <div className="title">Enter Claim Code</div>
                                <div className="what-this cursor">
                                    <Tooltip
                                        overlayClassName="tooltip what-this-tooltip"
                                        color="#4A4D62"
                                        style={{ width: '300px' }}
                                        title="A code which comes along with a physical Nervape product.">
                                        <div>what is this?</div>
                                    </Tooltip>
                                </div>
                            </div>
                            <div className="code-input">
                                <input
                                    type="text"
                                    placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                    value={code}
                                    onChange={e => {
                                        setCode(e.target.value);
                                    }}
                                />

                                {message && (
                                    <div className="message">{message}</div>
                                )}
                            </div>

                            <div className={`btn-groups ${state.windowWidth > 750 && 'flex-align'}`}>
                                <button className={`submit-btn cursor btn ${!code && 'disabled'}`}
                                    onClick={async () => {
                                        if (!code) return;

                                        setLoading(true);
                                        const res = await nervapeApi.fnVerifyPhysicalCode(code);

                                        if (res.code !== 0)
                                            setMessage(res.message);
                                        else {
                                            setCurrentStep(2);
                                            setPhysicalClaimCode(res.data);
                                        }

                                        setLoading(false);
                                    }}>
                                    NEXT
                                </button>

                                <button className="cancel-btn cursor btn"
                                    onClick={async () => {
                                        closeClaim();
                                    }}>
                                    CANCEL
                                </button>
                            </div>
                        </>
                    ) : currentStep == 2 ? (
                        <>
                            <div className="flex-align title-what-this">
                                <div className="title">Confirm Claim</div>
                            </div>

                            <div className="physical-nft-info">
                                <img className="cover-image" src={physicalClaimCode?.nft?.image} alt="" />
                                <div className="name">{`${physicalClaimCode?.nft?.name} #${physicalClaimCode?.token_id}`}</div>
                            </div>

                            <div className="physical-code">{physicalClaimCode?.code}</div>

                            <div className={`btn-groups ${state.windowWidth > 750 && 'flex-align'}`}>
                                <button className={`submit-btn cursor btn`}
                                    onClick={async () => {
                                        setCurrentStep(3);
                                    }}>
                                    CONFIRM AND CLAIM
                                </button>

                                <button className="cancel-btn cursor btn"
                                    onClick={async () => {
                                        setCurrentStep(1);
                                    }}>
                                    BACK
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex-align title-what-this">
                                <div className="title">Physical Nervape Claimed</div>
                            </div>

                            <div className="desc">
                                You have finished claiming <span>{`${physicalClaimCode?.nft?.name} #${physicalClaimCode?.token_id}`}</span>. It could take a few minutes for the NFT to be transferred to your wallet.
                            </div>

                            <div className="btn-groups flex-align">
                                <button className={`submit-btn cursor btn`}
                                    onClick={async () => {
                                        closeClaim();
                                    }}>
                                    DONE
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
