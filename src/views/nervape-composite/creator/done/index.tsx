import React, { useContext } from "react";
import './index.less';
import HalveLogo from '../../../../assets/halve/halve_logo.svg';
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
                    <img src={HalveLogo} alt="" />
                </div>
                <div className="nacp-url">
                    <img src={nacp?.url} alt="" />
                </div>
                <div className="flex-align" style={{ marginTop: '20px' }}>
                    <div className="left-info" style={{
                        borderRight: !(!isMobile() && !nacp?.point_x && nacp?.point_x != 0) ? 'unset' : '1px solid rgba(255, 255, 255, 0.10)',
                        paddingRight: !(!isMobile() && !nacp?.point_x && nacp?.point_x != 0) ? 'unset' : '20px',
                        marginRight: !(!isMobile() && !nacp?.point_x && nacp?.point_x != 0) ? 'unset' : '20px',
                        flex: !(!isMobile() && !nacp?.point_x && nacp?.point_x != 0) ? 1 : '',

                    }}>
                        <div className="nacp-id">Halve Nervape #{nacp?.nacp_id}</div>
                        <div className="epoch">Epoch: {nacp?.epoch}</div>
                        <div className="desc">Congrats trick-or-treater 🎃! You’ve created your own Spooky Nervape! Share the spookiness by following this link or clicking the SHARE button below.</div>

                        <div className="btn-groups">
                            <div className="flex-center">
                                {!isMobile() && (
                                    <>
                                        <div className="download-btn cursor"
                                            style={{ marginLeft: !(!isMobile() && !nacp?.point_x && nacp?.point_x != 0) ? 'unset' : '8px' }}
                                            onClick={() => {
                                                download && download(`Spooky Nervape #${nacp?.nacp_id}`);
                                            }}>
                                            <img src={DownLoadIcon} alt="DownLoadIcon" />
                                            Download IMG
                                        </div>
                                    </>
                                )}
                            </div>

                            {!isMobile() && (nacp?.point_x || nacp?.point_x == 0) && (
                                <div className="skip-btn cursor" onClick={() => {
                                    skipStep();
                                }}>
                                    Back To Interactive Map
                                </div>
                            )}
                        </div>
                    </div>
                    {(!isMobile() && !nacp?.point_x && nacp?.point_x != 0) && (
                        <div className="what-next">
                            <div className="title">What's Next?</div>
                            <div className="claim-btn cursor" onClick={() => {
                                setShowClaimPointMap(nacp);
                            }}>Claim Your Block!</div>
                            <div className="skip-tip cursor" onClick={skipStep}>Skip for now. I will claim my block later.</div>
                        </div>
                    )}
                </div>

                {(isMobile() ? (!nacp?.point_x && nacp?.point_x != 0) ? (
                    <div className="what-next">
                        <div className="title">What's Next?</div>
                        <div className="claim-btn cursor" onClick={() => {
                            setShowClaimPointMap(nacp);
                        }}>Claim Your Block!</div>
                        <div className="skip-tip cursor" onClick={skipStep}>Skip for now. I will claim my block later.</div>
                    </div>
                ) : (
                    <div className="skip-btn cursor" onClick={() => {
                        skipStep();
                    }}>
                        Back To Interactive Map
                    </div>
                ) : '')}
            </div>
        </div>
    );
}
