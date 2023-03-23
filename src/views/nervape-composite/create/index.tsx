import React, { useState, useEffect, useContext } from "react";
import { SiweMessage } from "siwe";
import {
    mainnet, useAccount, useSignMessage,
    usePrepareContractWrite,
    useContractWrite,
    useWaitForTransaction,
    useNetwork,
    useDisconnect
} from "wagmi";
import { CONFIG } from '../../../utils/config';
import { nervapeApi } from "../../../api/nervape-api";
import nacpAbi from '../../../contracts/NervapeComposite.json';
import { DataContext } from "../../../utils/utils";
import { LoginWalletType } from "../../../utils/Wallet";
import { godWoken, godWokenTestnet } from "../../../utils/Chain";
import NacpLogin from "../../components/nacp-login";

export default function Nacp() {
    const domain = window.location.host;
    const origin = window.location.origin;

    const { state, dispatch } = useContext(DataContext);
    const [nacps, setNacps] = useState<any>([]);
    const [showWalletError, setShowWalletError] = useState(false);

    const { address, isConnected } = useAccount();
    const { chain } = useNetwork();
    const { disconnect } = useDisconnect();

    const [ids, setIds] = useState([]);
    const [signatures, setSignatures] = useState([]);

    const disconnectReload = () => {
        localStorage.clear();
        disconnect();
        window.location.reload();
    };

    const { config, error: prepareError, isSuccess: isPreparedSuccess } = usePrepareContractWrite({
        address: CONFIG.NACP_ADDRESS,
        abi: nacpAbi,
        functionName: "bonelistMint",
        args: [ids, signatures]
    });

    const { data: writeData, error: writeError, isError: isWriteError, write } = useContractWrite(config);


    const { data, isError, isLoading, isSuccess, signMessageAsync } = useSignMessage();

    const createSiweMessage = async (_address: string, statement: string) => {
        const res = await nervapeApi.fnGetNonce();

        const message = new SiweMessage({
            domain,
            address: _address,
            statement,
            uri: origin,
            version: '1',
            chainId: godWokenTestnet.id,
            nonce: res
        });

        return message.prepareMessage();
    }

    const signInWithEthereum = async () => {
        if (!address) return false;

        const message = await createSiweMessage(address, 'Sign in with Ethereum to the app.');

        const signature = await signMessageAsync({ message });

        const res = await nervapeApi.fnSendForVerify(message, signature);

        return res;
    }

    const createNacp = async () => {
        if (!address) return false;
        const res = await nervapeApi.fnCreateNacp(address, { skin: "Red" });

        console.log('createNacp', res);
    }

    const fetchNacps = async () => {
        if (!address) return;
        const res = await nervapeApi.fnGetNacps(address);
        setNacps(res)
    }

    useEffect(() => {
        console.log(state);
        if (!state.currentAddress) return;

        if (state.loginWalletType !== LoginWalletType.WALLET_CONNECT || chain?.id !== godWokenTestnet.id) {
            setShowWalletError(true);
            return;
        } else {
            setShowWalletError(false);
        }

        if (!address) return;
        // 验证是否登录
        fnVerifyLogin();
    }, [address, state.loginWalletType, state.currentAddress, chain]);

    const handleMint = async () => {
        const ids = nacps.map(nacp => nacp._id)
        const signatures = await nervapeApi.fnGetSignature(ids);
        setIds(ids.map(id => `0x${id}`));
        setSignatures(signatures)
        if (isPreparedSuccess) {
            write?.();
        }
    }

    const { data: txData, isLoading: isTxLoading, isSuccess: isTxSuccess } = useWaitForTransaction({
        hash: writeData?.hash,
    });

    // console.log("wait = ", writeData, txData, isTxLoading, isTxSuccess);
    // console.log("isPreparedSuccess = ", isPreparedSuccess);

    const fnVerifyLogin = async () => {
        const res = await nervapeApi.fnVerifyLogin();
        if (res.code == 0) {
            await fetchNacps();
        } else if (res.code == 401) {
            // 未登录
            await signInWithEthereum();
        }
    }

    return (
        <div className="nacp-container main-container">
            <button className="sign-btn" onClick={createNacp}>Create NACP</button>

            {
                nacps && nacps.map(nacp =>
                    <div key={nacp._id} style={{ color: "#fff" }}>
                        {nacp._id} {nacp.skin}
                    </div>
                )
            }
            <button className="sign-btn" onClick={handleMint}>Mint</button>
            <div style={{ color: "#fff" }}>
                writeError: {isWriteError} {writeError?.message}
            </div>
            <div style={{ color: "#fff" }}>
                prepareError: {prepareError?.message}
            </div>
            <button className="sign-btn" onClick={async () => {
                await fnVerifyLogin();
            }}>Get Information</button>

            <NacpLogin show={showWalletError} logout={disconnectReload}></NacpLogin>
        </div>
    );
}
