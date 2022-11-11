import React from "react";
import "./index.less";

import { NavTool } from "../../route/navi-tool";

export default function HomePage() {
    return (
        <div className="home-container main-container">
            <div className="video-content">
                <video playsInline loop preload="true" autoPlay muted>
                    <source src="https://nervape-storage.s3.ap-southeast-1.amazonaws.com/album-main/production/e94e2283-b43d-4910-82e0-8e672ca4ed0e.mp4"/>
                </video>
                <div className="video-mask"></div>
                <div className="about-here">
                    <div className="text">Enter The Third Continent</div>
                    <button 
                        className="here-btn cursor"
                        onClick={() => {
                            NavTool.fnJumpToPage('/about');
                            window.scrollTo(0, 0);
                        }}>HERE</button>
                </div>
            </div>
        </div>
    )
}
