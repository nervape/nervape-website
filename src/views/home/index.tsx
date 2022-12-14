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
                <video 
                    id="video" 
                    playsInline
                    loop
                    preload="true"
                    autoPlay
                    muted
                    poster="https://nervape-storage.s3.ap-southeast-1.amazonaws.com/album-main/production/b6fb72fc-80d3-48de-bbaa-6ce45330b48a.png">
                    <source src="https://nervape-storage.s3.ap-southeast-1.amazonaws.com/album-main/production/2d713e68-9317-4d69-9c8e-b0046cd11816.mp4"/>
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
