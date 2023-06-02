import React, { useContext, useEffect, useState } from "react";
import './index.less';
import { nervapeApi } from "../../../api/nervape-api";
import { SiweMessage } from "siwe";
import { godWoken } from "../../../utils/Chain";
import { DataContext } from "../../../utils/utils";
import { useSignMessage } from "wagmi";

export default function InvitationClaim(props: any) {
    const { show, isBonelist, setInviteClaim, setLoading, searchBonelist } = props;

    const { state, dispatch } = useContext(DataContext);

    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [currentStep, setCurrentStep] = useState(1);

    const domain = window.location.host;
    const origin = window.location.origin;

    const { signMessageAsync, error } = useSignMessage();

    const createSiweMessage = async (_address: string, statement: string) => {
        const res = await nervapeApi.fnClaimBonelistNonce();

        const message = new SiweMessage({
            domain,
            address: _address,
            statement,
            uri: origin,
            version: '1',
            chainId: godWoken.id,
            nonce: res
        });

        return message.prepareMessage();
    }

    useEffect(() => {
        if (error && error.name == 'UserRejectedRequestError') {
            setLoading(false);
            setMessage('Signature denied. Please try again.');
            setCurrentStep(1);
        }
    }, [error]);

    const signInWithEthereum = async () => {
        setLoading(true);

        const message = await createSiweMessage(state.currentAddress.toLowerCase(), 'Sign in to claim your Bonelist.');

        const signature = await signMessageAsync({ message });

        const res = await nervapeApi.fnSubmitVerify(code, message, signature, state.currentAddress.toLowerCase());

        console.log(res);
        if (res.code !== 0) {
            setMessage(res.message);
            setCurrentStep(1);
        } else {
            searchBonelist();
            setCurrentStep(3);
        }

        setLoading(false);
    }

    return (
        <div className={`wallet-invitation-claim popup-container ${show && 'show'}`} onClick={() => {
            setInviteClaim(false);
            setMessage('');
            setCode('');
            setCurrentStep(1);
        }}>
            <div className="popup-content transation invitation-claim-content" onClick={e => e.stopPropagation()}>
                <div className="title">Bonelist Claim</div>
                {isBonelist ? (
                    <div className="tip">You are already NACP Bonelisted.</div>
                ) : (
                    <div className="claim-step-content">
                        {currentStep == 1 ? (
                            <>
                                <div className="input-tip">Enter Code to claim your Bonelist</div>
                                <input
                                    type="text"
                                    placeholder="Code"
                                    value={code}
                                    onChange={e => {
                                        setCode(e.target.value);
                                    }}
                                />

                                {message && (
                                    <div className="message">{message}</div>
                                )}
                                <div className="btn-groups flex-align">
                                    <button className="submit-btn cursor btn"
                                        onClick={async () => {
                                            setLoading(true);
                                            if (!code) setMessage('Invalid code. Please try again.');
                                            const res = await nervapeApi.fnVerifyCode(code);

                                            if (res.code !== 0)
                                                setMessage(res.message);
                                            else
                                                setCurrentStep(2);
                                            
                                            setLoading(false);
                                        }}>
                                        CLAIM
                                    </button>
                                </div>
                            </>
                        ) : (
                            currentStep == 2 ? (
                                <>
                                    <div className="address-tip">You are about to claim a bonelist with current address:</div>
                                    <div className="address">{state.currentAddress}</div>
                                    <div className="tip">This will render the entered code invalid.</div>
                                    <div className="btn-groups flex-align">
                                        <button className="submit-btn cursor btn"
                                            onClick={async () => {
                                                await signInWithEthereum();
                                                // setCurrentStep(3);
                                            }}>
                                            PROCEED
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="tip">You’ve successfully claimed your NACP Bonelist.</div>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
