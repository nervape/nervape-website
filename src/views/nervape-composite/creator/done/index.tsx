import React from "react";
import './index.less';
import SpookyTitle from '../../../../assets/nacp/hallween/hallween_title.svg';
import DownLoadIcon from '../../../../assets/nacp/hallween/download_icon.svg';

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
                <div className="nacp-id">#{nacp?.nacp_id}</div>
                <div className="desc">Congrats! You’ve created your unique Spooky Nervape! You can share your ape by sharing the following link: </div>
                <div className="link-url">
                    {nacp?.share_link}
                </div>

                <div className="download-btn cursor" onClick={() => {
                    download && download();
                }}>
                    <img src={DownLoadIcon} alt="DownLoadIcon" />
                    Download IMG
                </div>
            </div>
        </div>
    );
}
