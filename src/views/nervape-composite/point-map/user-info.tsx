import React, { useContext, useEffect, useState } from "react";
import './user-info.less';
import { LoginWalletType, WALLET_CONNECT, clearJoyIDStorage } from "../../../utils/Wallet";
import { nervapeApi } from "../../../api/nervape-api";
import JOYID from '../../../assets/logo/joyid.svg';
import ShareIcon from '../../../assets/nacp/hallween/share_icon.svg';
import DownLoadIcon from '../../../assets/nacp/hallween/download_icon.svg';
import { PointMapItem } from ".";
import { CONFIG } from "../../../utils/config";
import { DataContext } from "../../../utils/utils";
import FolderIcon from '../../../assets/halve/folder.svg';

export default function UserInfo(props: {
    onConnect: Function;
    formatAddress: Function;
    loginInfo: WALLET_CONNECT;
    createApe: Function;
    claimBlock: Function;
    disconnect: Function;
    updateApe: Function;
    setPointToCenter: Function;
    apeInfo: PointMapItem;
}) {
    const { state, dispatch } = useContext(DataContext);

    const { onConnect, formatAddress, loginInfo, createApe, claimBlock, apeInfo, disconnect, setPointToCenter, updateApe } = props;

    const download = (filename: string, url: string) => {
        const link = document.createElement('a');
        link.download = `${filename}.jpeg`;
        link.href = url;
        link.click();
    }

    const [folder, setFolder] = useState(false);

    return (
        <div className="user-info-container">
            {loginInfo?.type != LoginWalletType.JOYID ? (
                <div className="not-logged-in flex-align">
                    <div className="text">Connect JoyID to start</div>
                    <div className="login-btn cursor" onClick={() => { onConnect(); }}>Connect</div>
                </div>
            ) : (
                <div className="has-logged">
                    {state.windowWidth > 1200 ? (
                        <>
                            <div className="wallet-info-content flex-align">
                                <div className="joyid-logo">
                                    <img src={JOYID} alt="JOYID" />
                                </div>
                                <div className="joyid-address">{formatAddress(loginInfo.address)}</div>
                                <div className="disconnect-btn cursor" onClick={() => { disconnect(); }}>Disconnect</div>
                            </div>
                            <div className="ape-info-content">
                                <div className="my-ape flex-align">
                                    <div className="title">My Ape</div>
                                    <div className="point cursor" style={{
                                        opacity: apeInfo && (apeInfo.point_x || apeInfo.point_x == 0)
                                            ? 1 : 0.5
                                    }} onClick={() => {
                                        if (apeInfo.point_x || apeInfo.point_x == 0) {
                                            setPointToCenter(apeInfo.point_x, apeInfo.point_y);
                                        }
                                    }}>
                                        {apeInfo && (apeInfo.point_x || apeInfo.point_x == 0) ?
                                            `(${apeInfo.point_x}, ${apeInfo.point_y})`
                                            : '(-, -)'}
                                    </div>
                                </div>
                                <div className="ape-image">
                                    {apeInfo && (
                                        <img src={apeInfo.url} alt="" />
                                    )}
                                </div>
                                <div className="btn-groups">
                                    {!apeInfo ? (
                                        <>
                                            <div className="create-btn btn cursor" onClick={() => {
                                                createApe();
                                            }}>Create My Ape</div>
                                            <div className="tip">
                                                You have not created your ape
                                            </div>
                                        </>
                                    ) : (
                                        (apeInfo.point_x || apeInfo.point_x == 0) ? (
                                            <>
                                                <div className="download-btn btn cursor" onClick={() => {
                                                    apeInfo?.url && download(`Spooky Nervape #${apeInfo?.nacp_id}`, apeInfo?.url);
                                                }}>
                                                    <img src={DownLoadIcon} alt="DownLoadIcon" />
                                                    Download IMG
                                                </div>
                                                <div className="share-btn btn cursor" onClick={() => {
                                                    const share_link = `https://twitter.com/share?text=Happy Halloween🎃! Check out my Spooky Nervape made with @Nervapes Spooky Nervapes creator. Make your own and share to win scary prizes (10/31 to 11/8) 👻→ &url=${CONFIG.SPOOKY_SHARE_PATH}${apeInfo.nacp_id}&hashtags=Halloween,SpookyNervapes`;
                                                    window.open(share_link);
                                                }}>
                                                    <img src={ShareIcon} alt="DownLoadIcon" />
                                                    Share On X
                                                </div>

                                                <div className="update-btn btn cursor" onClick={() => {
                                                    updateApe();
                                                }}>Update My Ape</div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="download-btn btn cursor" onClick={() => {
                                                    apeInfo?.url && download(`Spooky Nervape #${apeInfo?.nacp_id}`, apeInfo?.url);
                                                }}>
                                                    <img src={DownLoadIcon} alt="DownLoadIcon" />
                                                    Download IMG
                                                </div>
                                                <div className="update-btn btn cursor" onClick={() => {
                                                    updateApe();
                                                }}>Update My Ape</div>
                                                <div className="claim-btn btn cursor" onClick={() => {
                                                    claimBlock();
                                                }}>Claim My Block</div>

                                                <div className="tip">
                                                    Claim a block for your ape to participate in the event
                                                </div>
                                            </>
                                        )
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={`folder flex-center ${folder && 'open'}`} onClick={() => {
                                setFolder(!folder);
                            }}>
                                <img className="transition" src={FolderIcon} alt="FolderIcon" />
                            </div>
                            <div className="my-ape flex-align">
                                <div className="title">My Ape</div>
                                <div className="point cursor" style={{
                                    opacity: apeInfo && (apeInfo.point_x || apeInfo.point_x == 0)
                                        ? 1 : 0.5
                                }} onClick={() => {
                                    if (apeInfo.point_x || apeInfo.point_x == 0) {
                                        setPointToCenter(apeInfo.point_x, apeInfo.point_y);
                                    }
                                }}>
                                    {apeInfo && (apeInfo.point_x || apeInfo.point_x == 0) ?
                                        `(${apeInfo.point_x}, ${apeInfo.point_y})`
                                        : '(-, -)'}
                                </div>
                            </div>
                            <div className={`ape-info-content transition ${folder && 'open'}`}>
                                <div className={`flex-align ape-info`} >
                                    <div className="ape-image">
                                        {apeInfo && (
                                            <img src={apeInfo.url} alt="" />
                                        )}
                                    </div>
                                    <div className="btn-groups">
                                        {!apeInfo ? (
                                            <>
                                                <div className="create-btn btn cursor" onClick={() => {
                                                    createApe();
                                                }}>Create My Ape</div>
                                            </>
                                        ) : (
                                            (apeInfo.point_x || apeInfo.point_x == 0) ? (
                                                <>
                                                    <div className="download-btn btn cursor" onClick={() => {
                                                        apeInfo?.url && download(`Spooky Nervape #${apeInfo?.nacp_id}`, apeInfo?.url);
                                                    }}>
                                                        <img src={DownLoadIcon} alt="DownLoadIcon" />
                                                        Download IMG
                                                    </div>
                                                    <div className="share-btn btn cursor" onClick={() => {
                                                        const share_link = `https://twitter.com/share?text=Happy Halloween🎃! Check out my Spooky Nervape made with @Nervapes Spooky Nervapes creator. Make your own and share to win scary prizes (10/31 to 11/8) 👻→ &url=${CONFIG.SPOOKY_SHARE_PATH}${apeInfo.nacp_id}&hashtags=Halloween,SpookyNervapes`;
                                                        window.open(share_link);
                                                    }}>
                                                        <img src={ShareIcon} alt="DownLoadIcon" />
                                                        Share On X
                                                    </div>

                                                    <div className="update-btn btn cursor" onClick={() => {
                                                        updateApe();
                                                    }}>Update My Ape</div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="download-btn btn cursor" onClick={() => {
                                                        apeInfo?.url && download(`Spooky Nervape #${apeInfo?.nacp_id}`, apeInfo?.url);
                                                    }}>
                                                        <img src={DownLoadIcon} alt="DownLoadIcon" />
                                                        Download IMG
                                                    </div>
                                                    <div className="update-btn btn cursor" onClick={() => {
                                                        updateApe();
                                                    }}>Update My Ape</div>
                                                    <div className="claim-btn btn cursor" onClick={() => {
                                                        claimBlock();
                                                    }}>Claim My Block</div>
                                                </>
                                            )
                                        )}
                                    </div>
                                </div>

                                {apeInfo ? ((apeInfo.point_x || apeInfo.point_x == 0) ? (
                                    <div className="tip">
                                        You have not created your ape
                                    </div>
                                ) : (
                                    <div className="tip">
                                        Claim a block for your ape to participate in the event
                                    </div>
                                )) : ''}

                                <div className="wallet-info-content flex-align">
                                    <div className="joyid-logo">
                                        <img src={JOYID} alt="JOYID" />
                                    </div>
                                    <div className="joyid-address">{formatAddress(loginInfo.address)}</div>
                                    <div className="disconnect-btn cursor" onClick={() => { disconnect(); }}>Disconnect</div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
