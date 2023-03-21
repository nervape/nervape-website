import React, { useState, useEffect } from "react";
import { SiweMessage } from "siwe";
import { mainnet, useAccount, useSignMessage, 
    usePrepareContractWrite, 
    useContractWrite,
    useWaitForTransaction
} from "wagmi";
import { CONFIG } from '../../../utils/config';
import { nervapeApi } from "../../../api/nervape-api";
import nacpAbi from '../../../contracts/NervapeComposite.json';

export default function Nacp() {
    const domain = window.location.host;
    const origin = window.location.origin;
    const [ nacps, setNacps ] = useState<any>([])
    const { address, isConnected } = useAccount();

    const [ ids, setIds ] = useState([])
    const [ signatures, setSignatures ] = useState([])

    const { config, error: prepareError, isSuccess: isPreparedSuccess } = usePrepareContractWrite({
        address: CONFIG.NACP_ADDRESS,
        abi: nacpAbi,
        functionName: "bonelistMint",
        args: [ ids, signatures ]
    })

    const { data: writeData, error: writeError, isError: isWriteError, write } = useContractWrite(config)


    const { data, isError, isLoading, isSuccess, signMessageAsync } = useSignMessage();

    const createSiweMessage = (_address: string, statement: string) => {
        const message = new SiweMessage({
            domain,
            address: _address,
            statement,
            uri: origin,
            version: '1',
            chainId: mainnet.id
        });

        return message.prepareMessage();
    }

    const signInWithEthereum = async () => {
        if (!address) return false;

        const message = createSiweMessage(address, 'Sign in with Ethereum to the app.');

        const signature = await signMessageAsync({ message });

        const res = await nervapeApi.fnSendForVerify(message, signature);
        
        console.log('signInWithEthereum', res);
    }

    const createNacp = async () => {
        if (!address) return false;
        const res = await nervapeApi.fnCreateNacp(address, { skin: "Red" });
        
        console.log('createNacp', res);
    }

    const fetchNacps = async () => {
        if (!address) {
            return
        }
        const res = await nervapeApi.fnGetNacps(address);
        setNacps(res)
    }
    useEffect(() => {
        fetchNacps()
    }, [ address ])

    const handleMint = async () => {
        const ids = nacps.map(nacp => nacp._id)
        const signatures = await nervapeApi.fnGetSignature(ids);
        setIds(ids.map(id => `0x${id}`))
        setSignatures(signatures)
        if(isPreparedSuccess){
            write?.()
        }
    }

    const { data: txData, isLoading: isTxLoading, isSuccess: isTxSuccess } = useWaitForTransaction({
        hash: writeData?.hash,
    })

    console.log("wait = ", writeData, txData, isTxLoading, isTxSuccess)
    console.log("isPreparedSuccess = ", isPreparedSuccess)
    return (
        <div className="nacp-container main-container">
            <button className="sign-btn" onClick={async () => {
                await signInWithEthereum();
            }}>SignIn With Ethereum</button>

            <button className="sign-btn" onClick={createNacp}>Create NACP</button>

            {
                nacps && nacps.map(nacp =>
                    <div style={{color: "#fff"}}>
                        {nacp._id} {nacp.skin}
                    </div>
                )
            }
            <button className="sign-btn" onClick={handleMint}>Mint</button>
            <div style={{color: "#fff"}}>
                writeError: {isWriteError} { writeError?.message }
            </div>
            <div style={{color: "#fff"}}>
                prepareError: { prepareError?.reason }
            </div>
        </div>
    );
}
