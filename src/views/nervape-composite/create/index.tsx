import React, { useState, useEffect, useContext } from "react";
import { SiweMessage } from "siwe";
import {
    mainnet, useAccount, useSignMessage,
    usePrepareContractWrite,
    useContractWrite,
    useContractRead,
    useWaitForTransaction,
    useNetwork,
    useDisconnect,
    useContract,
    useContractReads,
    useSigner,
    goerli
} from "wagmi";


import { CONFIG } from '../../../utils/config';
import { nervapeApi } from "../../../api/nervape-api";
import nacpAbi from '../../../contracts/NervapeComposite.json';
import { DataContext } from "../../../utils/utils";
import { LoginWalletType } from "../../../utils/Wallet";
import { godWoken, godWokenTestnet } from "../../../utils/Chain";
import NacpLogin from "../../components/nacp-login";
import { SwitchChainSpan } from "../../components/switchChain";

export default function Nacp() {
    const domain = window.location.host;
    const origin = window.location.origin;
    const { state, dispatch } = useContext(DataContext);
    const [showWalletError, setShowWalletError] = useState(false);

    const { address, isConnected } = useAccount();
    const { chain } = useNetwork();
    const { disconnect } = useDisconnect();
    const { data: signer } = useSigner();

    const { data: tokenIds } = useContractRead({
        address: CONFIG.NACP_ADDRESS,
        abi: nacpAbi,
        functionName: 'tokensOfOwner',
        cacheOnBlock: true,
        args: [ address ]
        // watch: true
    })

    const { data: minted } = useContractRead({
        address: CONFIG.NACP_ADDRESS,
        abi: nacpAbi,
        functionName: 'minted',
        cacheOnBlock: true,
        args: [ address ]
        // watch: true
    })

    const hasMinted = (minted as any)?.toNumber() > 0

    const contract = useContract({
        address: CONFIG.NACP_ADDRESS,
        abi: nacpAbi,
        signerOrProvider: signer
    })


    const disconnectReload = () => {
        localStorage.clear();
        disconnect();
        window.location.reload();
    };

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

        // const res = await nervapeApi.fnSendForVerify(message, signature);
        // return res;
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

    }, [address, state.loginWalletType, state.currentAddress, chain]);

    
    const handleBonelistMint = async () => {
        const signature = await nervapeApi.fnGetSignature(address as string);
        try {
            const tx = await contract?.bonelistMint(signature);
            const receipt = await tx.wait()
            if(receipt.status) {
                // tx success
            } else {
                // tx failed
            }
        } catch(err: any) {
            console.log("err=", err.reason)
        }
    }
    const handleMint = async () => {
        try {
            const tx = await contract?.mint();
            const receipt = await tx.wait()
            if(receipt.status) {
                // success
            }
        } catch(err: any) {
            console.log("err=", err.reason)
        }
    }

    return (
        <div className="nacp-container main-container">
            {
                chain?.id !== goerli.id && 
                <button style={{background: "#fff"}}>
                    <SwitchChainSpan title="Switch Chain" chainId={5} />
                </button>
            }
            {
                hasMinted && "minted"
            }
            &nbsp;
            <button onClick={handleBonelistMint}>Bonelist Mint</button>
            &nbsp;
            <button onClick={handleMint}>Mint</button>
            &nbsp;

            <br />
            <div style={{ color: "#fff"}}>
            {
                tokenIds && tokenIds.map(id => id.toNumber()).join(",")
            }
            </div>
            {/*<NacpLogin show={showWalletError} logout={disconnectReload}></NacpLogin>*/}
        </div>
    );
}
