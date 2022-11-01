import React from "react";

import WallpaperLight from '../../assets/about/wallpaper_light.png';
import Bonelist from '../../assets/about/bonelist.svg';
import AboutStory01 from '../../assets/about/about_story-01.png';
import AboutStory02 from '../../assets/about/about_story-02.png';
import ArrowIcon from '../../assets/about/icon_arrow.png';
import SceneDragon from '../../assets/about/scene_dragon.png';
import './index.less';

export default function AboutPage() {
    return (
        <div className="about-container main-container">
            <div className="banner">
                <div className="text">Nervape is a Storytelling and Customizable 3D Metawerse Brand.</div>
                <img loading="lazy" src={WallpaperLight} alt="bannerUrl" />
            </div>
            <section className="intro-section">
                <div className="intro-content">
                    <p>It begins with a dream,</p>
                    <p>Seen by seekers and believers of the waking world.</p>
                    <p>Living day by day, yet yearning for change, </p>
                    <p>For freedom could only be found within dreams,</p>
                    <p>Or so we believe. </p>
                    <p>Will you dare to seek the unknown? </p>
                    <p>To embrace adventure?</p>
                    <p>To explore the limits of your strength and courage? </p>
                    <p>The Third Continent awaits for those who take the leap of faith.</p>
                    <img src={Bonelist} alt="" />
                </div>
            </section>
            <section className="story-section">
                <div className="storytelling-intro">
                    <h3 className="title">STORYTELLING</h3>
                    <p className="desc">
                        The Nervape project is an ongoing saga and a story of
                        friendship, courage, and trust among the first
                        Nervapes that arrive at the Third Continent. As the
                        Nervapes continue to explore the Third Continent, new
                        characters, unique features of the land, and fantasy
                        elements will be added as 3D NFTs to the Nervos
                        blockchain.
                    </p>
                    <div className="onging-saga">
                        <a href="javascript;;">ONGING SAGA</a>
                        <img src={ArrowIcon} alt="ArrowIcon" />
                    </div>
                </div>

                <div className="story story-01">
                    <img src={AboutStory01} alt="AboutStory01" />
                </div>
                <div className="story story-02">
                    <img src={AboutStory02} alt="AboutStory01" />
                </div>
            </section>

            <section className="customizable-section">
                <div className="title">“YOU ARE THE ONLY ONE WHO CAN DEFINE YOURSELF”</div>
                <div className="custom-cover">
                    <img src={SceneDragon} alt="SceneDragon" />
                </div>
                <div className="customizable-collection">
                    <div className="custom-content">
                        <div className="title">CUSTOMIZABLE NFT COLLECTION</div>
                        <div className="desc">
                            <p>Creat your own character, Nervape is for everyone.</p>
                            <br />
                            <p>The Nervape project is an ongoing saga and a story of friendship, courage, and trust among the first Nervapes that arrive at the Third Continent. As the Nervapes continue to explore the Third Continent, new characters, unique features of the land, and fantasy elements will be added as 3D NFTs to the Nervos blockchain.</p>
                            <br />
                            <p>The Nervape project is an ongoing saga and a story of friendship, courage, and trust among the first Nervapes that arrive at the Third Continent. As the Nervapes continue to explore the Third Continent, new characters, unique features of the land, and fantasy elements will be added as 3D NFTs to the Nervos blockchain.</p>
                        </div>
                        <div className="more-detail">
                            <a href="javascript;;">More Detail</a>
                            <img src={ArrowIcon} alt="ArrowIcon" />
                        </div>
                    </div>
                </div>
            </section>
            <section className="humans-section">
                <h3 className="title">The Humans and Other Creature Behind the Nervape</h3>
                <p className="desc">A group of simple creatures with a wild mind.</p>
                <div className="humans">
                    
                </div>
            </section>
        </div>
    );
}
