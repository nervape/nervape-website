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
                        flex: !(!isMobile() && !nacp?.point_x && nacp?.point_x != 0) ? 1 : '',
                    }}>
                        <div className="nacp-id">Halve Nervape #{nacp?.nacp_id}</div>
                        <div className="epoch">Epoch: {nacp?.epoch}</div>
                        <div className="desc">This Halve Nervape is ape blast!</div>

                        <div className="btn-groups">
                            <div className="flex-center">
                                {!isMobile() && (
                                    <>
                                        <div className="download-btn cursor"
                                            style={{ marginLeft: !(!isMobile() && !nacp?.point_x && nacp?.point_x != 0) ? 'unset' : '8px' }}
                                            onClick={() => {
                                                download && download(`Halve Nervape #${nacp?.nacp_id}`);
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
                        <div className="what-next" style={{
                            borderLeft: !(!isMobile() && !nacp?.point_x && nacp?.point_x != 0) ? 'unset' : '1px solid rgba(255, 255, 255, 0.10)',
                            paddingLeft: !(!isMobile() && !nacp?.point_x && nacp?.point_x != 0) ? 'unset' : '20px',
                            marginLeft: !(!isMobile() && !nacp?.point_x && nacp?.point_x != 0) ? 'unset' : '20px',
                        }}>
                            <div className="title">What’s Next?</div>
                            <div className="desc">Claim a block for your ape to live on our collaborative Halve Ape Blast canvas.</div>
                            <div className="claim-btn cursor" onClick={() => {
                                setShowClaimPointMap(nacp);
                            }}>Claim Your Block!</div>
                            <div className="skip-tip cursor" onClick={skipStep}>Want to claim your block later? Skip for now.</div>
                        </div>
                    )}
                </div>

                {(isMobile() ? (!nacp?.point_x && nacp?.point_x != 0) ? (
                    <div className="what-next">
                        <div className="title">What's Next?</div>
                        <div className="desc">Claim a block for your ape to live on our collaborative Halve Ape Blast canvas.</div>
                        <div className="claim-btn cursor" onClick={() => {
                            setShowClaimPointMap(nacp);
                        }}>Claim Your Block!</div>
                        <div className="skip-tip cursor" onClick={skipStep}>Want to claim your block later? Skip for now.</div>
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
