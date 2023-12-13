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

                <div className="activity-time">2023/11/14-2023/11/26</div>

                <div className="result-image">
                    <img src="https://images.nftbox.me/production/1314f1f1-e513-44c3-a247-56726ae80698.png" alt="" />
                </div>

                <div className="description">
                    November 2023, we halved ape blast! Nervos’ CKB was halving and we celebrated the four year milestone with our own *Halve Ape Blast* event (links below)!
                    <br />
                    We Nervos’d up our apes with new design assets so that everyone could make their own *Halve Nervapes.* They then claimed a block on our collaborative ****************Halve Ape Blast Canvas**************** to place their ape. 🦍 Every participant that claimed a block was airdropped an **NFT of the full canvas** (above) to their Joy ID account (https://joy.id/). 🖼️
                    <br />
                    Below we have a timelapse video of the canvas from start to finish. Watch a week of creating compressed into less than 43 seconds. What shapes do you see forming on our canvas? 🤔
                    <br />
                    Thanks to all the creators!
                </div>

                <div className="video-title">Canvas Timelapse</div>
                <div className="video">
                    <iframe src="https://www.youtube.com/embed/VYPUmRpTxQA?si=-23rKGPV-l0gtIsQ" frameBorder="0"></iframe>
                </div>

                <div className="links">
                    <div className="link-title">Links</div>
                    <a href="https://explorer.token.city/nft/ac52ee13-eaba-4147-8f18-730327097396?page=1" target="_blank">Halve Ape Blast Canvas NFT</a>
                    <br />
                    <a href="https://tourmaline-elderberry-f93.notion.site/Halve-Ape-Blast-Event-Page-84777574746c45108bafb2fda51b0c18" target="_blank">Halve Ape Blast Details</a>
                    <br />
                    <a href="https://explorer.nervos.org/halving" target="_blank">Nervos CKB Halving Countdown</a>
                </div>
            </div>
        </div>
    );
}
