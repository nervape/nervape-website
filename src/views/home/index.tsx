import React, { useState } from "react";
import "./index.less";

import AudioOpenIcon from '../../assets/icons/open.svg';
import AudioCloseIcon from '../../assets/icons/close.svg';

import { NavTool } from "../../route/navi-tool";

export default function HomePage() {
    const [audioMuted, setAudioMuted] = useState(true);
    
    return (
        <div className="home-container main-container">
            <div className="video-content">
                <video id="video" playsInline loop preload="true" autoPlay muted>
                    <source src="https://nervape-storage.s3.ap-southeast-1.amazonaws.com/album-main/production/e94e2283-b43d-4910-82e0-8e672ca4ed0e.mp4"/>
                </video>
                <div className="video-mask"></div>
                <div className="b-content">
                    <div className="about-here">
                        <div className="text">Enter The Third Continent</div>
                        <button 
                            className="here-btn cursor"
                            onClick={() => {
                                NavTool.fnJumpToPage('/about');
                                window.scrollTo(0, 0);
                            }}>HERE</button>
                    </div>
                    <div className="play-status cursor" onClick={() => {
                        const video = document.getElementById('video') as HTMLVideoElement;
                        if (video) {
                            video.muted = !audioMuted;
                            setAudioMuted(!audioMuted);
                        }
                    }}>
                        <img src={audioMuted ? AudioCloseIcon : AudioOpenIcon} />
                    </div>
                </div>
            </div>
        </div>
    )
}
