import React, { useContext, useEffect, useState } from "react";
import './index.less';

import NacpLogo from '../../../assets/wallet/NACP_logo.svg';
import DefaultNacpApe from '../../../assets/wallet/nacp/default_nacp_ape.png';
import BonelistRequired from '../../../assets/wallet/nacp/Bonelist_Required.png';
import { Popover } from "antd";
import { nervapeApi } from "../../../api/nervape-api";
import { DataContext, updateBodyOverflow } from "../../../utils/utils";
import { NACP_APE, NACP_SPECIAL_ASSET, NacpAsset, NacpMetadata, NacpMetadataAttribute } from "../../../nervape/nacp";
// import AssetItem from "./special-asset-item";
import { goerli, mainnet, useAccount, useContract, useContractRead, useNetwork, useSignMessage, useSigner, useTransaction } from "wagmi";
import { CONFIG } from "../../../utils/config";
import nacpAbi from '../../../contracts/NervapeComposite.json';
import NacpApeDetail from "../../components/nft/nacp";
import NacpEdit from "./edit";
import SaveSuccessPopup from "./save/success";
import SwitchChainPopup from "./chain/chain";
import MintTipPopup from "./mint/mint";
import { Types } from "../../../utils/reducers";
import NacpAssetItem from "./asset-item";
import OperatePopup from "../../components/operate-popup";
import { SiweMessage } from "siwe";

export default function WalletNacp(props: { isFold: boolean; isBonelist: boolean; setLoading: Function; fnGetUserProfile: Function; userProfile: any; }) {
    const { isFold, isBonelist, setLoading, fnGetUserProfile, userProfile } = props;

    const { state, dispatch } = useContext(DataContext);

    const [showMint, setShowMint] = useState(false);
    const [showMintTip, setShowMintTip] = useState(false);
    const [currNacpTab, setCurrNacpTab] = useState('ape');
    const [nacpApes, setNacpApes] = useState<NACP_APE[]>([]);
    const [chainApes, setChainApes] = useState<NacpMetadata[]>([]);
    // const [nacpAssets, setNacpAssets] = useState<NACP_SPECIAL_ASSET[]>([]);
    const [nacpAssets, setNacpAssets] = useState<NacpAsset[]>([]);
    const [holdAssets, setHoldAssets] = useState<NacpAsset[]>([]);
    const [showNacpDetail, setShowNacpDetail] = useState(false);
    const [selectedNacp, setSelectedNacp] = useState<NacpMetadata>();

    const [showNacpEdit, setShowNacpEdit] = useState(false);
    const [showSaveSuccess, setShowSaveSuccess] = useState(false);
    const [showSwitchChain, setShowSwitchChain] = useState(false);
    const [showProfileImage, setShowProfileImage] = useState(false);
    const [showProfileSuccess, setShowProfileSuccess] = useState(false);
    const [currentNacpId, setCurrentNacpId] = useState(0);

    const { address, isConnected } = useAccount();
    const { data: signer } = useSigner();
    const { chain } = useNetwork();

    const setHideHeader = (value: boolean) => {
        dispatch({
            type: Types.IsVisibleHeader,
            value: value
        })
    }

    const { data: tokenIds, isSuccess: isTokenSuccess } = useContractRead({
        address: CONFIG.NACP_ADDRESS,
        abi: nacpAbi,
        functionName: 'tokensOfOwner',
        cacheOnBlock: true,
        args: [address],
        watch: true
    })

    const { data: minted, isSuccess: isMintedSuccess } = useContractRead({
        address: CONFIG.NACP_ADDRESS,
        abi: nacpAbi,
        functionName: 'minted',
        cacheOnBlock: true,
        args: [address],
        watch: true
    });

    useTransaction({
        hash: localStorage.getItem("minting-tx") ? localStorage.getItem("minting-tx") as `0x${string}` : undefined,
        onSettled(data, error) {
            console.log('Settled', { data, error })
            // 查询 txhash 交易状态
            if (data && data.confirmations > 0) {
                localStorage.removeItem('minting-tx');
            }
        },
    })

    const hasMinted = (minted as any)?.toNumber() > 0;

    const contract = useContract({
        address: CONFIG.NACP_ADDRESS,
        abi: nacpAbi,
        signerOrProvider: signer
    });

    async function fnGetNacpByTokenIds(flag = false) {
        if (!flag && chainApes.length) return;
        setLoading(true);
        let _chainApes: NacpMetadata[] = [];
        let _nacpAssets: NacpAsset[] = [];

        await Promise.all(
            (tokenIds as any).map(async (t: any) => {
                const res = await nervapeApi.fnGetMetadataByTokenId(t.toNumber());
                const data: NacpMetadata = res.data;

                data.attributes.map((a: NacpMetadataAttribute) => {
                    _nacpAssets.push({
                        _id: a.asset_id,
                        name: a.value,
                        thumb_url: a.asset_thumb_url,
                        url: a.asset_url,
                        category_name: a.trait_type,
                        ape_id: data.id,
                        is_equip: true,
                        skin_color: a.skin_color
                    });
                });

                _chainApes.push(data);
            })
        );
        _chainApes.sort(function(a, b) {
            return a.id - b.id;
        })
        console.log(_nacpAssets);
        setNacpAssets(_nacpAssets);
        setChainApes(_chainApes);
        setLoading(false);
    }

    const handleBonelistMint = async () => {
        const signature = await nervapeApi.fnGetSignature(address as string);
        try {
            const tx = await contract?.bonelistMint(signature);
            console.log('handleBonelistMint', tx);
            // save txhash to localStorage 0xb8d8193b34e56a1e59c87e9c00b2a4f1e3bcf539e5b7fe38df2f12aeffeb3c92
            localStorage.setItem("minting-tx", tx.hash);

            setShowMintTip(false);
            setShowMint(false);

            const receipt = await tx.wait();
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
            // save txhash to localStorage
            localStorage.setItem("minting-tx", tx.hash)

            setShowMintTip(false);
            setShowMint(false);

            const receipt = await tx.wait();
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
                if (res && !hasMinted && !localStorage.getItem("minting-tx")) setShowMint(true);
            })
        } else {
            localStorage.removeItem('minting-tx');
            setShowMint(false);
        }
    }, [state.currentAddress, chain, hasMinted, isMintedSuccess]);

    useEffect(() => {
        if (!chain) return;

        if (chain.id !== goerli.id) {
            setShowSwitchChain(true);
            updateBodyOverflow(false);
        } else {
            setShowSwitchChain(false);
            updateBodyOverflow(true);
        }
    }, [chain]);

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
            // Story quiz special asset
            // fnGetStorySpecialAsset(state.currentAddress);
            // 当前持有 Assets
            nervapeApi.fnGetUserAssets(state.currentAddress).then(res => {
                console.log(res);
                let _holdAssets: NacpAsset[] = [];

                res.map((r: any) => {
                    _holdAssets.push({
                        _id: r.asset._id,
                        name: r.asset.name,
                        thumb_url: r.asset.thumb_url,
                        url: r.asset.url,
                        category_name: r.asset.category.name,
                    })
                });

                setHoldAssets(_holdAssets);
            });

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

    const domain = window.location.host;
    const origin = window.location.origin;

    const { signMessageAsync, error } = useSignMessage();

    const createSiweMessage = async (_address: string, statement: string) => {
        const res = await nervapeApi.fnGetProfileNonce();

        const message = new SiweMessage({
            domain,
            address: _address,
            statement,
            uri: origin,
            version: '1',
            chainId: mainnet.id,
            nonce: res.nonce
        });

        return {
            message: message.prepareMessage(),
        };
    }

    const signInWithEthereum = async () => {
        setLoading(true);

        try {
            const { message } = await createSiweMessage(state.currentAddress, 'sign in to update your current profile image.');

            const signature = await signMessageAsync({ message });
            const res = await nervapeApi.fnUserProfileVerify(message, signature, currentNacpId);

            setLoading(false);

            setShowProfileImage(false);
            setShowProfileSuccess(true);
        } catch {
            updateBodyOverflow(false);
            setLoading(false);
        }
    }

    useEffect(() => {
        setLoading(true);
    }, []);

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
                        {isMintedSuccess && !hasMinted && (
                            <div className="spot-items">
                                <div className="item-title flex-align">
                                    <div className="text">SPOT</div>
                                    {showMint && (
                                        <button className="mint-btn cursor" onClick={() => {
                                            setShowMintTip(true);
                                            updateBodyOverflow(false);
                                        }}>MINT</button>
                                    )}
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
                                                    if (state.windowWidth <= 750) setHideHeader(false);
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
                            return <NacpAssetItem asset={asset} key={index}></NacpAssetItem>
                            // return <AssetItem asset={asset} key={index} ></AssetItem>
                        })}
                        {holdAssets.map((asset, index) => {
                            return <NacpAssetItem asset={asset} key={index}></NacpAssetItem>
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
                    updateBodyOverflow(false);
                    setShowNacpEdit(true);
                }}
                setShowProfileImage={(id: number) => {
                    setShowProfileImage(true);
                    setCurrentNacpId(id);
                }}
                nacp={selectedNacp as NacpMetadata}></NacpApeDetail>
            <NacpEdit
                show={showNacpEdit}
                nacp={selectedNacp as NacpMetadata}
                userProfile={userProfile}
                setShowNacpEdit={setShowNacpEdit}
                setShowSaveSuccess={() => {
                    setShowNacpEdit(false);
                    setShowSaveSuccess(true);
                }}></NacpEdit>
            <SaveSuccessPopup
                show={showSaveSuccess}
                confirm={async () => {
                    setShowSaveSuccess(false);
                    await fnGetNacpByTokenIds(true);
                    await fnGetUserProfile();
                }}></SaveSuccessPopup>
            <SwitchChainPopup
                show={showSwitchChain}
                close={() => {
                    setShowSwitchChain(false);
                    updateBodyOverflow(true);
                }}></SwitchChainPopup>
            <MintTipPopup
                show={showMintTip}
                close={() => {
                    setShowMintTip(false);
                    updateBodyOverflow(true);
                }}
                confirm={() => {
                    if (isBonelist) {
                        handleBonelistMint();
                    } else {
                        handleMint();
                    }
                    updateBodyOverflow(true);
                }}></MintTipPopup>
            <OperatePopup
                show={showProfileImage}
                closeText="CANCEL"
                confirmText="PROCEED"
                content="This will replace your current profile image with this NACP NFT."
                close={() => {
                    setShowProfileImage(false);
                }}
                confirm={() => {
                    signInWithEthereum();
                }}></OperatePopup>
            <OperatePopup
                show={showProfileSuccess}
                hideClose={true}
                confirmText="DONE"
                content="Your profile image has been updated."
                confirm={async () => {
                    setShowProfileSuccess(false);
                    await fnGetUserProfile();
                    setShowNacpDetail(false);
                }}></OperatePopup>
        </div>
    );
}
