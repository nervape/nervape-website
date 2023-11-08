import React, { useContext } from "react";
import './index.less';
import SpookyTitle from '../../../../assets/nacp/hallween/hallween_title.svg';
import ShareIcon from '../../../../assets/nacp/hallween/share_icon.svg';
import DownLoadIcon from '../../../../assets/nacp/hallween/download_icon.svg';
import { DataContext, isMobile } from "../../../../utils/utils";

export default function NacpDone(props: any) {
    const { show, nacp, download, skipStep, setShowClaimPointMap } = props;
    const { state, dispatch } = useContext(DataContext);

    return (
        <div className={`nacp-done-container ${show && 'show'}`}>
            <div className="nacp-done-content">
                <div className="spooky-title">
                    <img src={SpookyTitle} alt="" />
                </div>
                <div className="nacp-url">
                    <img src={nacp?.url} alt="" />
                </div>
                <div className="nacp-id">Spooky Nervape #{nacp?.nacp_id}</div>
                <div className="epoch">Epoch: {nacp?.epoch}</div>
                <div className="desc">Congrats trick-or-treater 🎃! You’ve created your own Spooky Nervape! Share the spookiness by following this link or clicking the SHARE button below.</div>

                <div className="btn-groups">
                    <div className="flex-center">
                        {!isMobile() && (
                            <div className="download-btn cursor" onClick={() => {
                                download && download(`Spooky Nervape #${nacp?.nacp_id}`);
                            }}>
                                <img src={DownLoadIcon} alt="DownLoadIcon" />
                                Download IMG
                            </div>
                        )}
                    </div>
                </div>

                {(!nacp?.point_x && nacp?.point_x != 0) && (
                    <div className="what-next">
                        <div className="title">What's Next?</div>
                        <div className="claim-btn cursor" onClick={() => {
                            setShowClaimPointMap(nacp);
                        }}>Claim Your Block!</div>
                        <div className="skip-tip cursor" onClick={skipStep}>Skip for now. I will claim my block later.</div>
                    </div>
                )}
            </div>
        </div>
    );
}
