import React, { useContext, useEffect, useState } from "react";
import './index.less';

import NacpLogo from '../../../assets/wallet/NACP_logo.svg';
import DefaultNacpApe from '../../../assets/wallet/nacp/default_nacp_ape.png';
import BonelistRequired from '../../../assets/wallet/nacp/Bonelist_Required.png';
import { Popover } from "antd";
import { nervapeApi } from "../../../api/nervape-api";
import { DataContext, updateBodyOverflow } from "../../../utils/utils";
import { NACP_APE, NACP_SPECIAL_ASSET, NacpMetadata } from "../../../nervape/nacp";
import AssetItem from "./asset-item";
import { goerli, useAccount, useContract, useContractRead, useNetwork, useSigner } from "wagmi";
import { CONFIG } from "../../../utils/config";
import nacpAbi from '../../../contracts/NervapeComposite.json';
import NacpApeDetail from "../../components/nft/nacp";
import NacpEdit from "./edit";
import SaveSuccessPopup from "./save/success";

export default function WalletNacp(props: { isFold: boolean; isBonelist: boolean; setLoading: Function; }) {
    const { isFold, isBonelist, setLoading } = props;

    const { state, dispatch } = useContext(DataContext);

    const [showMint, setShowMint] = useState(false);
    const [currNacpTab, setCurrNacpTab] = useState('ape');
    const [nacpApes, setNacpApes] = useState<NACP_APE[]>([]);
    const [chainApes, setChainApes] = useState<NacpMetadata[]>([]);
    const [nacpAssets, setNacpAssets] = useState<NACP_SPECIAL_ASSET[]>([]);
    const [showNacpDetail, setShowNacpDetail] = useState(false);
    const [selectedNacp, setSelectedNacp] = useState<NacpMetadata>();

    const [showNacpEdit, setShowNacpEdit] = useState(false);
    const [showSaveSuccess, setShowSaveSuccess] = useState(false);

    const { address, isConnected } = useAccount();
    const { data: signer } = useSigner();
    const { chain } = useNetwork();

    const { data: tokenIds, isSuccess: isTokenSuccess } = useContractRead({
        address: CONFIG.NACP_ADDRESS,
        abi: nacpAbi,
        functionName: 'tokensOfOwner',
        cacheOnBlock: true,
        args: [address]
        // watch: true
    })

    const { data: minted, isSuccess: isMintedSuccess } = useContractRead({
        address: CONFIG.NACP_ADDRESS,
        abi: nacpAbi,
        functionName: 'minted',
        cacheOnBlock: true,
        args: [address]
        // watch: true
    });

    const hasMinted = (minted as any)?.toNumber() > 0;

    const contract = useContract({
        address: CONFIG.NACP_ADDRESS,
        abi: nacpAbi,
        signerOrProvider: signer
    });

    async function fnGetNacpByTokenIds() {
        setLoading(true);
        let _chainApes: NacpMetadata[] = [];

        await Promise.all(
            (tokenIds as any).map(async (t: any) => {
                const { data } = await nervapeApi.fnGetMetadataByTokenId(t.toNumber());
                console.log('fnGetNacpByTokenIds', data);
                _chainApes.push(data);
            })
        );

        setChainApes(_chainApes);
        setLoading(false);
    }

    const handleBonelistMint = async () => {
        const signature = await nervapeApi.fnGetSignature(address as string);
        try {
            const tx = await contract?.bonelistMint(signature);
            const receipt = await tx.wait()
            if (receipt.status) {
                // tx success
            } else {
                // tx failed
            }
        } catch (err: any) {
            console.log("err=", err.reason)
        }
    }

    const handleMint = async () => {
        try {
            const tx = await contract?.mint();
            const receipt = await tx.wait()
            if (receipt.status) {
                // success
            }
        } catch (err: any) {
            console.log("err=", err.reason)
        }
    }

    useEffect(() => {
        if (!isMintedSuccess) return;
        if (!state.currentAddress) return;
        if (!chain || chain?.id !== goerli.id) {
            setShowMint(false);
            return;
        }

        if (!hasMinted) {
            nervapeApi.fnMintAllow(state.currentAddress).then(res => {
                if (res && !hasMinted) setShowMint(true);
            })
        } else {
            setShowMint(false);
        }
    }, [state.currentAddress, chain, hasMinted, isMintedSuccess]);

    useEffect(() => {
        if (!isTokenSuccess) return;

        fnGetNacpByTokenIds();
    }, [isTokenSuccess]);

    useEffect(() => {
        let _apes: NACP_APE[] = [];

        for (let i = 0; i < 3; i++) {
            let isRight = false;

            if (i == 0) isRight = true;
            else {
                isRight = isBonelist;
            }
            _apes.push({
                coverImage: DefaultNacpApe,
                name: `NACP Spot #${i + 1}`,
                isRight: isRight
            })
        }
        setNacpApes(_apes);
    }, [isBonelist]);

    useEffect(() => {
        if (currNacpTab == 'asset') {
            fnGetStorySpecialAsset(state.currentAddress);
        }
    }, [currNacpTab]);

    async function fnGetStorySpecialAsset(address: string) {
        setLoading(true);
        const assets = await nervapeApi.fnGetStorySpecialAsset(address);
        setNacpAssets(assets);
        setLoading(false);
    }

    const ApeItem = (props: { ape: NACP_APE }) => {
        const { ape } = props;

        const _html = () => {
            return (
                <div className="nacp-ape-item">
                    <div className="cover-image">
                        <img className="cover" src={ape.coverImage} alt="DefaultNacpApe" />
                        {!ape.isRight && (
                            <div className="cover-no-right transition flex-center">
                                <img src={BonelistRequired} className="no-right-image" alt="" />
                                <div className="bonelist-required">Bonelist Required</div>
                                <div className="tip">
                                    You need to get Bonelisted (Aka Whitelisted) to unlock this spot.
                                </div>
                                <a
                                    target="_block"
                                    href="https://tourmaline-elderberry-f93.notion.site/NACP-Bonelist-Aka-Whitelist-f021cb54342549ae95f752d393ab3211"
                                    className="how-get transition">How to get bonelisted?</a>
                            </div>
                        )}
                    </div>
                    <div className="name">{ape.name}</div>
                </div>
            );
        };

        if (ape.isRight) {
            return (
                <Popover
                    color="#506077"
                    placement="bottom"
                    overlayClassName="nacp-ape-popover"
                    content={() => {
                        return (
                            <div className="nacp-ape-hover-popover">
                                <p>Each open spot allows you to mint one NACP NFT when it’s launched.</p>
                                <a target="_block" href="/nacp">Learn More</a>
                            </div>
                        );
                    }}>
                    {_html()}
                </Popover>
            );
        }
        return _html();
    }

    return (
        <div className={`wallet-nacp-container ${isFold && 'fold'}`}>
            <div className="wallet-nacp-header transition position-sticky flex-align">
                <div className="nacp-logo">
                    <img src={NacpLogo} alt="NacpLogo" />
                </div>

                <div className="nacp-tabs flex-align">
                    <div className={`nacp-tab cursor transition nacp-ape-tab ${currNacpTab == 'ape' && 'active'}`} onClick={() => { setCurrNacpTab('ape') }}>APE</div>
                    <div className={`nacp-tab cursor transition nacp-asset-tab ${currNacpTab == 'asset' && 'active'}`} onClick={() => { setCurrNacpTab('asset') }}>ASSET</div>
                </div>
            </div>

            <div className="wallet-nacp-content">
                {currNacpTab == 'ape' ? (
                    <div className="spot-apes">
                        {showMint && (
                            <div className="spot-items">
                                <div className="item-title flex-align">
                                    <div className="text">SPOT</div>
                                    <button className="mint-btn cursor" onClick={() => {
                                        if (isBonelist) {
                                            handleBonelistMint();
                                        } else {
                                            handleMint();
                                        }
                                    }}>MINT</button>
                                </div>

                                <div className="nacp-content-apes flex-align">
                                    {nacpApes.map((ape, index) => {
                                        return <ApeItem ape={ape} key={index}></ApeItem>
                                    })}
                                </div>
                            </div>
                        )}
                        {
                            chainApes.length && (
                                <div className="spot-items">
                                    <div className="item-title flex-align">
                                        <div className="text">APE</div>
                                    </div>

                                    <div className="nacp-content-apes flex-align">
                                        {chainApes.map((ape, index) => {
                                            return (
                                                <div className="nacp-ape-item cursor" key={index} onClick={async () => {
                                                    const res = await nervapeApi.fnGetCategoriesByAttributes(ape.attributes);
                                                    updateBodyOverflow(false);
                                                    const _ape = JSON.parse(JSON.stringify(ape));
                                                    _ape.categories = res;
                                                    setSelectedNacp(_ape);
                                                    setShowNacpDetail(true);
                                                }}>
                                                    <div className="cover-image">
                                                        <img className="cover" src={ape.image} alt="DefaultNacpApe" />
                                                    </div>
                                                    <div className="name">{ape.name}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )
                        }
                    </div>
                ) : (
                    <div className="nacp-content-assets flex-align">
                        {nacpAssets.map((asset, index) => {
                            return <AssetItem asset={asset} key={index} ></AssetItem>
                        })}
                    </div>
                )}
            </div>

            <NacpApeDetail
                show={showNacpDetail}
                close={() => {
                    setShowNacpDetail(false);
                    updateBodyOverflow(true);
                }}
                editNacp={() => {
                    setShowNacpDetail(false);
                    setShowNacpEdit(true);
                }}
                nacp={selectedNacp as NacpMetadata}></NacpApeDetail>
            <NacpEdit show={showNacpEdit} nacp={selectedNacp as NacpMetadata} setShowNacpEdit={setShowNacpEdit} setShowSaveSuccess={() => {
                setShowNacpEdit(false);
                setShowSaveSuccess(true);
            }}></NacpEdit>
            <SaveSuccessPopup show={showSaveSuccess} comfirm={async () => {
                setShowSaveSuccess(false);
                await fnGetNacpByTokenIds();
            }}></SaveSuccessPopup>
        </div>
    );
}
