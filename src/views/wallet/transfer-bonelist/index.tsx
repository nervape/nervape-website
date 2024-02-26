import React, { useContext, useEffect, useState } from "react";
import './index.less';
import { useSignMessage } from "wagmi";
import { nervapeApi } from "../../../api/nervape-api";
import { SiweMessage } from "siwe";
import { godWoken } from "../../../utils/Chain";
import { DataContext } from "../../../utils/utils";

export default function TransferBonelist(props: any) {
    const { show, close, setLoading, fnSearchBonelistStatus } = props;
    const [btcAddress, setBtcAddress] = useState('');
    const [addressActive, setAddressActive] = useState(false);
    const [message, setMessage] = useState('');

    const { state, dispatch } = useContext(DataContext);

    const domain = window.location.host;
    const origin = window.location.origin;

    const { signMessageAsync, error } = useSignMessage();

    const createSiweMessage = async (_address: string, statement: string) => {
        const res = await nervapeApi.fnTransferBonelistNonce();

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
        }
    }, [error]);

    const signInWithEthereum = async () => {
        setLoading(true);

        const message = await createSiweMessage(state.currentAddress, 'Sign in to claim your Bonelist.');

        const signature = await signMessageAsync({ message });

        const res = await nervapeApi.fnTransferBonelistVerify(btcAddress, message, signature);

        console.log(res);
        if (res.code !== 0) {
            setMessage(res.message);
        } else {
            fnSearchBonelistStatus();
        }

        setLoading(false);
    }

    return (
        <div className={`transfer-bonelist-container popup-container ${show && 'show'}`}>
            <div className="popup-content transation transfer-content">
                <div className="title">Bonelist Transfer</div>
                <div className="desc">You are transferring your Bonelist to the entered Bitcoin address. The Bonelist can only be transferred once so please review your Bitcoin address carefully.</div>

                <div className="address-input">
                    <input type="text" placeholder="Recipient Bitcoin Address" value={btcAddress} onChange={e => {
                        setBtcAddress(e.target.value);

                        if (e.target.value) setAddressActive(true);
                    }} />
                    {message && (
                        <div className="message">{`*${message}`}</div>
                    )}
                </div>

                <div className="btn-groups flex-align">
                    <div className={`confirm-btn btn cursor ${addressActive && 'active'}`}
                        onClick={() => {
                            if (!addressActive) return;

                            signInWithEthereum();
                        }}>TRANSFER</div>
                    <div className="skip-btn btn cursor" onClick={close}>CANCEL</div>
                </div>
            </div>
        </div>
    );
}
