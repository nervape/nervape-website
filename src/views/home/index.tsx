import React from "react";
import "./index.less";

import NervapeVideo from '../../assets/Nervape_Video.mp4';
import Footer from "../components/footer";
import { NavTool } from "../../route/navi-tool";

export default function HomePage() {
    return (
        <div className="home-container main-container">
            <div className="video-content">
                <video src={NervapeVideo} loop preload="true" autoPlay muted></video>
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
