import React from "react";
import "./index.less";

import { NavTool } from "../../route/navi-tool";

export default function HomePage() {
    return (
        <div className="home-container main-container">
            <div className="video-content">
                <video controls playsInline src="https://nervape-storage.s3.ap-southeast-1.amazonaws.com/album-dev/production/cf840997-c84e-4546-a6aa-e746e35b40ae.mp4" loop preload="true" autoPlay muted></video>
                <div className="about-here">
                    Enter The Third Continent
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
