import React from "react";
import './index.less';
import CkbHalfTitle from '../../../../assets/halve/halve_logo.svg'

export default function PointMapEnd() {
    return (
        <div className="point-map-end-container">
            <div className="point-map-end-content">
                <div className="title">
                    <img src={CkbHalfTitle} alt="CkbHalfTitle" />
                </div>

                <div className="activity-time">2022/10/31 - 2022/11/09</div>

                <div className="result-image">
                    <img src="https://images.nftbox.me/production/1314f1f1-e513-44c3-a247-56726ae80698.png" alt="" />
                </div>

                <div className="description">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </div>

                <div className="video-title">Canvas Timelapse</div>
                <div className="video">
                    <iframe src="https://youtu.be/VYPUmRpTxQA?si=1qfg8Mc5a9FzXgqJ" frameBorder="0"></iframe>
                </div>

                <div className="links">
                    <div className="link-title">Links</div>
                    <a href="" target="_blank">HALVE APE BLAST Notion page</a>
                    <br />
                    <a href="" target="_blank">Nervos CKB Halving Countdown</a>
                </div>
            </div>
        </div>
    );
}
