import React from "react";
import { SiweMessage } from "siwe";
import { mainnet, useAccount, useSignMessage } from "wagmi";
import { nervapeApi } from "../../../api/nervape-api";

export default function Nacp() {
    const domain = window.location.host;
    const origin = window.location.origin;

    const { address, isConnected } = useAccount();

    const { data, isError, isLoading, isSuccess, signMessageAsync } = useSignMessage();

    const createSiweMessage = async (_address: string, statement: string) => {
        const res = await nervapeApi.fnGetNonce();

        const message = new SiweMessage({
            domain,
            address: _address,
            statement,
            uri: origin,
            version: '1',
            chainId: mainnet.id,
            nonce: res
        });

        return message.prepareMessage();
    }

    const signInWithEthereum = async () => {
        if (!address) return false;

        const message = await createSiweMessage(address, 'Sign in with Ethereum to the app.');

        const signature = await signMessageAsync({ message });

        const res = await nervapeApi.fnSendForVerify(message, signature);
        
        console.log('signInWithEthereum', res);
    }

    const getInformation = async () => {
        await nervapeApi.fnGetInformation()
    }

    return (
        <div className="nacp-container main-container">
            <button className="sign-btn" onClick={async () => {
                await signInWithEthereum();
            }}>SignIn With Ethereum</button>
            <button className="sign-btn" onClick={async () => {
                await getInformation();
            }}>Get Information</button>
        </div>
    );
}
