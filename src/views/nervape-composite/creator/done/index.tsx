import React from "react";
import './index.less';
import SpookyTitle from '../../../../assets/nacp/hallween/hallween_title.svg';
import ShareIcon from '../../../../assets/nacp/hallween/share_icon.svg';
import DownLoadIcon from '../../../../assets/nacp/hallween/download_icon.svg';
import CopyIcon from '../../../../assets/nacp/hallween/copy.svg';
import CopyToClipboard from "react-copy-to-clipboard";
import { message } from "antd";

export default function NacpDone(props: any) {
    const { show, nacp, download } = props;

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
                <div className="desc">Congrats trick-or-treater ! You’ve created your own Spooky Nervape! Share the spookiness by following this link or clicking the SHARE button below.</div>

                <CopyToClipboard
                    text={nacp?.share_link}
                    onCopy={() => {
                        message.success(`Copy Success!`);
                    }}
                >
                    <div className="link-url cursor flex-align">
                        <div className="text">{nacp?.share_link}</div>
                        <img src={CopyIcon} alt="CopyIcon" />
                    </div>
                </CopyToClipboard>

                <div className="btn-groups">
                    <div className="flex-center">
                        <div className="download-btn cursor" onClick={() => {
                            // share
                            window.open(nacp?.share_link);
                        }}>
                            <img src={ShareIcon} alt="DownLoadIcon" />
                            Share on X(Twiiter)
                        </div>
                        <div className="download-btn cursor" onClick={() => {
                            download && download(`Spooky Nervape #${nacp?.nacp_id}`);
                        }}>
                            <img src={DownLoadIcon} alt="DownLoadIcon" />
                            Download IMG
                        </div>
                    </div>

                    <div className="create-btn cursor" onClick={() => {
                        // Create Another Spooky Nervape
                        window.location.reload();
                    }}>
                        Create Another Spooky Nervape
                    </div>
                </div>
            </div>
        </div>
    );
}
