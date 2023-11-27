import React, { useContext, useEffect, useState } from "react";
import './user-info.less';
import { LoginWalletType, WALLET_CONNECT, clearJoyIDStorage } from "../../../utils/Wallet";
import { nervapeApi } from "../../../api/nervape-api";
import JOYID from '../../../assets/logo/joyid.svg';
import ShareIcon from '../../../assets/nacp/hallween/share_icon.svg';
import DownLoadIcon from '../../../assets/nacp/hallween/download_icon.svg';
import { EndAtDate, MaxBlockCount, MaxEpochValue, PointMapItem, UsedCount } from ".";
import { CONFIG } from "../../../utils/config";
import { DataContext, isMobile } from "../../../utils/utils";
import FolderIcon from '../../../assets/halve/folder.svg';
import useIntervalAsync from "../../../hooks/useIntervalAsync";
import dayjs from "dayjs";

export default function UserInfo(props: {
    onConnect: Function;
    formatAddress: Function;
    loginInfo: WALLET_CONNECT;
    createApe: Function;
    claimBlock: Function;
    disconnect: Function;
    updateApe: Function;
    setPointToCenter: Function;
    shareContent: Function;
    apeInfo: PointMapItem;
    usedCount: UsedCount;
    epoch: number;
}) {
    const { state, dispatch } = useContext(DataContext);

    const { onConnect, epoch, formatAddress, loginInfo, createApe, claimBlock, apeInfo, disconnect, setPointToCenter, updateApe, shareContent, usedCount } = props;

    const download = (filename: string, url: string) => {
        const link = document.createElement('a');
        link.download = `${filename}.jpeg`;
        link.href = url;
        link.click();
    }

    const [folder, setFolder] = useState(false);
    const [endTimeStr, setEndTimeStr] = useState('');

    useIntervalAsync(updateNacpStatus, 1000);

    async function updateNacpStatus() {
        const now = new Date().getTime();

        if (now > EndAtDate) {
            setEndTimeStr('');
        } else {
            const days = dayjs(EndAtDate).diff(dayjs(now), 'days');
            const hours = dayjs(EndAtDate).diff(dayjs(now), 'hours');
            const minutes = dayjs(EndAtDate).diff(dayjs(now), 'minutes');

            if (isMobile()) {
                if (days > 0) setEndTimeStr(`Ends in ${days} days`);
                else setEndTimeStr(`Ends in ${hours - 24 * days}hrs,${minutes - 60 * hours}mins`);
            } else {
                setEndTimeStr(`Ends in ${days} days,${hours - 24 * days}hrs,${minutes - 60 * hours}mins`);
            }
        }
    }

    useEffect(() => {
        if (epoch >= MaxEpochValue && !apeInfo) {
            setFolder(true);
        }
    }, [apeInfo, epoch]);

    return (
        <div className="user-info-container">
            {loginInfo?.type != LoginWalletType.JOYID ? (
                <div className="not-logged-in flex-align">
                    <div className="text">Connect to Joy ID</div>
                    <div className="login-btn transition cursor" onClick={() => { onConnect(); }}>Connect</div>
                </div>
            ) : (
                <>
                    {(state.windowWidth > 1200 && epoch >= MaxEpochValue && apeInfo) && (
                        <div className="end-in-time">{endTimeStr}</div>
                    )}
                    <div className="has-logged">
                        {state.windowWidth > 1200 ? (
                            <>
                                <div className="wallet-info-content flex-align">
                                    <div className="joyid-logo">
                                        <img src={JOYID} alt="JOYID" />
                                    </div>
                                    <div className="joyid-address">{formatAddress(loginInfo.address)}</div>
                                    <div className="disconnect-btn transition cursor" onClick={() => { disconnect(); }}>Disconnect</div>
                                </div>
                                <div className="ape-info-content" style={{paddingTop: !apeInfo && epoch >= MaxEpochValue ? '0' : '16px'}}>
                                    {!(!apeInfo && epoch >= MaxEpochValue) && (
                                        <>
                                            <div className="my-ape flex-align">
                                                <div className="title">My Ape</div>
                                                <div className={`point transition ${(apeInfo?.point_x || apeInfo?.point_x == 0) && 'active cursor'}`} style={{
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
                                        </>
                                    )}
                                    <div className="btn-groups">
                                        {!apeInfo ? (
                                            epoch >= MaxEpochValue ? (
                                                <div className="tip error">
                                                    {`It seems you missed the event :(`}
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="create-btn btn cursor" onClick={
                                                        () => {
                                                            createApe();
                                                        }
                                                    }>Create My Ape</div>
                                                    <div className="tip">
                                                        You have not created your ape yet.
                                                    </div>

                                                    {usedCount.block >= MaxBlockCount && (
                                                        <div className="tip warning">
                                                            After creating the ape, you won’t be able to claim a block as all blocks have been claimed.
                                                        </div>
                                                    )}
                                                </>
                                            )

                                        ) : (
                                            (apeInfo.point_x || apeInfo.point_x == 0) ? (
                                                <>
                                                    <div className="download-btn btn cursor" onClick={() => {
                                                        apeInfo?.url && download(`Halve Nervape #${apeInfo?.nacp_id}`, apeInfo?.url);
                                                    }}>
                                                        <img src={DownLoadIcon} alt="DownLoadIcon" />
                                                        Download IMG
                                                    </div>
                                                    <div className="share-btn btn cursor" onClick={() => {
                                                        shareContent();
                                                    }}>
                                                        <img src={ShareIcon} alt="DownLoadIcon" />
                                                        Share On X
                                                    </div>

                                                    {/* <div className="update-btn btn cursor" onClick={() => {
                                                        updateApe();
                                                    }}>Update My Ape</div> */}
                                                </>
                                            ) : (
                                                <>
                                                    <div className="download-btn btn cursor" onClick={() => {
                                                        apeInfo?.url && download(`Halve Nervape #${apeInfo?.nacp_id}`, apeInfo?.url);
                                                    }}>
                                                        <img src={DownLoadIcon} alt="DownLoadIcon" />
                                                        Download IMG
                                                    </div>

                                                    {usedCount.block >= MaxBlockCount ? (
                                                        <div className="share-btn btn cursor" onClick={() => {
                                                            shareContent();
                                                        }}>
                                                            <img src={ShareIcon} alt="DownLoadIcon" />
                                                            Share On X
                                                        </div>
                                                    ) : (
                                                        <div className="claim-btn btn cursor" onClick={() => {
                                                            claimBlock();
                                                        }}>Claim My Block</div>
                                                    )}

                                                    {/* <div className="update-btn btn cursor" onClick={() => {
                                                        updateApe();
                                                    }}>Update My Ape</div> */}

                                                    {usedCount.block < MaxBlockCount && (
                                                        <div className="tip">
                                                            Claim your block and then share your Halve Ape on X!
                                                        </div>
                                                    )}
                                                </>
                                            )
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {!(!apeInfo && epoch >= MaxEpochValue) && (
                                    <div className={`folder flex-center ${folder && 'open'}`} onClick={() => {
                                        setFolder(!folder);
                                    }}>
                                        <img className="transition" src={FolderIcon} alt="FolderIcon" />

                                        {(epoch >= MaxEpochValue && apeInfo) && (
                                            <div className="end-time">{endTimeStr}</div>
                                        )}
                                    </div>
                                )}

                                {!(!apeInfo && epoch >= MaxEpochValue) && (
                                    <div className="my-ape flex-align">
                                        <div className="title">My Ape</div>
                                        <div className={`point transition ${(apeInfo?.point_x || apeInfo?.point_x == 0) && 'active cursor'}`} style={{
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
                                )}

                                <div className={`ape-info-content transition ${folder && 'open'}`} style={{ paddingTop: epoch >= MaxEpochValue && !apeInfo ? '16px' : '' }}>
                                    {(epoch >= MaxEpochValue && !apeInfo) ? (
                                        <div className="tip-missed tip error">
                                            {`It seems you missed the event :(`}
                                        </div>
                                    ) : (
                                        <>
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
                                                                {/* <div className="download-btn btn cursor" onClick={() => {
                                                        apeInfo?.url && download(`Spooky Nervape #${apeInfo?.nacp_id}`, apeInfo?.url);
                                                    }}>
                                                        <img src={DownLoadIcon} alt="DownLoadIcon" />
                                                        Download IMG
                                                    </div> */}
                                                                <div className="share-btn btn cursor" onClick={() => {
                                                                    shareContent();
                                                                }}>
                                                                    <img src={ShareIcon} alt="DownLoadIcon" />
                                                                    Share On X
                                                                </div>

                                                                {/* <div className="update-btn btn cursor" onClick={() => {
                                                                    updateApe();
                                                                }}>Update My Ape</div> */}

                                                                <div className="download-tip">
                                                                    Press down on your Halve Nervape to save the ape to your device.
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                {/* <div className="download-btn btn cursor" onClick={() => {
                                                        apeInfo?.url && download(`Spooky Nervape #${apeInfo?.nacp_id}`, apeInfo?.url);
                                                    }}>
                                                        <img src={DownLoadIcon} alt="DownLoadIcon" />
                                                        Download IMG
                                                    </div> */}
                                                                {usedCount.block >= MaxBlockCount ? (
                                                                    <div className="share-btn btn cursor" onClick={() => {
                                                                        shareContent();
                                                                    }}>
                                                                        <img src={ShareIcon} alt="DownLoadIcon" />
                                                                        Share On X
                                                                    </div>
                                                                ) : (
                                                                    <div className="claim-btn btn cursor" onClick={() => {
                                                                        claimBlock();
                                                                    }}>Claim My Block</div>
                                                                )}
                                                                {/* <div className="update-btn btn cursor" onClick={() => {
                                                                    updateApe();
                                                                }}>Update My Ape</div> */}
                                                                <div className="download-tip">
                                                                    Press down on your Halve Nervape to save the ape to your device.
                                                                </div>
                                                            </>
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            {!apeInfo ? (
                                                <>
                                                    <div className="tip">
                                                        You have not created your ape yet.
                                                    </div>

                                                    {usedCount.block >= MaxBlockCount && (
                                                        <div className="tip warning">
                                                            After creating the ape, you won’t be able to claim a block as all blocks have been claimed.
                                                        </div>
                                                    )}
                                                </>
                                            ) : ((apeInfo.point_x || apeInfo.point_x == 0) ? '' : (
                                                usedCount.block < MaxBlockCount && (
                                                    <div className="tip">
                                                        Claim your block and then share your Halve Ape on X!
                                                    </div>
                                                )
                                            ))}
                                        </>
                                    )}

                                    <div className="wallet-info-content flex-align">
                                        <div className="joyid-logo">
                                            <img src={JOYID} alt="JOYID" />
                                        </div>
                                        <div className="joyid-address">{formatAddress(loginInfo.address)}</div>
                                        <div className="disconnect-btn transition cursor" onClick={() => { disconnect(); }}>Disconnect</div>
                                    </div>
                                </div>
                            </>
                        )
                        }
                    </div >
                </>
            )}
        </div >
    );
}
