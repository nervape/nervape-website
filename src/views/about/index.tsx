import React, { useEffect, useState } from "react";

import WallpaperLight from '../../assets/about/wallpaper_light.png';
import Bonelist from '../../assets/about/bonelist.svg';
import AboutStory01 from '../../assets/about/about_story-01.png';
import AboutStory02 from '../../assets/about/about_story-02.png';
import ArrowIcon from '../../assets/about/icon_arrow.png';
import SceneDragon from '../../assets/about/scene_dragon.png';
import './index.less';
import { Question, Staff } from "../../nervape/about";
import { nervapeApi } from "../../api/nervape-api";
import TwitterIcon from '../../assets/about/twitter.svg';
import UpArrowIcon from '../../assets/about/up_arrow.svg';
import AboutBottom from '../../assets/about/about_bottom.png';
import { NavTool } from "../../route/navi-tool";

export default function AboutPage() {
    const [humans, setHumans] = useState<Staff[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        nervapeApi.fnGetStaffs().then(res => {
            setHumans(res);
        })

        setQuestions([
            {
                question: 'Nullam vitae sapien sit amet massa semper congue sit amet non tortor. Nulla mollis, ipsum sit amet mollis congue, turpis velit porttitor?',
                answer: 'Nullam vitae sapien sit amet massa semper congue sit amet non tortor. Nulla mollis, ipsum sit amet mollis congue, turpis velit porttitor?',
                open: false,
                sort: 0,
                backgroundColor: '#141D26'
            },
            {
                question: 'Nullam vitae sapien sit amet massa semper congue sit amet non tortor. Nulla mollis, ipsum sit amet mollis congue, turpis velit porttitor?',
                answer: 'Nullam vitae sapien sit amet massa semper congue sit amet non tortor. Nulla mollis, ipsum sit amet mollis congue, turpis velit porttitor?',
                open: false,
                sort: 0,
                backgroundColor: '#282F41'
            },
            {
                question: 'Nullam vitae sapien sit amet massa semper congue sit amet non tortor. Nulla mollis, ipsum sit amet mollis congue, turpis velit porttitor?',
                answer: 'Curabitur euismod, ex quis tincidunt tincidunt, nulla libero hendrerit nisi, ac mollis neque diam luctus dui. Duis eu ipsum posuere, auctor sem sed, laoreet massa. Sed volutpat odio quis leo varius tincidunt. ',
                open: true,
                sort: 0,
                backgroundColor: '#506077'
            },
            {
                question: 'Nullam vitae sapien sit amet massa semper congue sit amet non tortor. Nulla mollis, ipsum sit amet mollis congue, turpis velit porttitor?',
                answer: 'Curabitur euismod, ex quis tincidunt tincidunt, nulla libero hendrerit nisi, ac mollis neque diam luctus dui. Duis eu ipsum posuere, auctor sem sed, laoreet massa. Sed volutpat odio quis leo varius tincidunt. ',
                open: true,
                sort: 0,
                backgroundColor: '#9196A5'
            }
        ]);
    }, []);

    return (
        <div className="about-container main-container">
            <div className="banner">
                <div className="text">Nervape is a Storytelling and Customizable 3D Metaverse Brand.</div>
                <img loading="lazy" src={WallpaperLight} alt="bannerUrl" />
            </div>
            <section className="intro-section">
                <div className="intro-content">
                    <div className="p">It begins with a dream,</div>
                    <div className="p p1">Seen by seekers and believers of the waking world.</div>
                    <div className="p p1">Living day by day, yet yearning for change, </div>
                    <div className="p p1">For freedom could only be found within dreams,</div>
                    <div className="p">Or so we believe. </div>
                    <div className="p p1">Will you dare to seek the unknown? </div>
                    <div className="p">To embrace adventure?</div>
                    <div className="p p1">To explore the limits of your strength and courage? </div>
                    <div className="p p1">The Third Continent awaits for those who take the leap of faith.</div>
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
                    <div 
                        className="onging-saga cursor"
                        onClick={() => {
                            NavTool.fnJumpToPage('/story');
                        }}
                    >
                        <a href="javascript;;">ONGOING SAGA</a>
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
                        <div 
                            className="more-detail cursor" 
                            onClick={() => {
                                NavTool.fnJumpToPage('/nft');
                            }}
                        >
                            <a href="javascript;;">More Detail</a>
                            <img src={ArrowIcon} alt="ArrowIcon" />
                        </div>
                    </div>
                </div>
            </section>
            <section className="humans-section">
                <div className="humans-content">
                    <h3 className="title">The Humans and Other Creature Behind the Nervape</h3>
                    <p className="desc">A group of simple creatures with a wild mind.</p>
                    <div className="humans">
                        {humans.length ? (
                            humans.map((human, index) => {
                                return (
                                    <div className="human" style={{zIndex: humans.length - index}} key={index}>
                                        <div className="introduction">
                                            <div className="intro-c">
                                                <div className="c-top">
                                                    <div className="c-left">
                                                        <div className="name">{human.name}</div>
                                                        <div className="job">{human.job}</div>
                                                    </div>
                                                    {human.twitter && (
                                                        <div 
                                                            className="c-right cursor"
                                                            onClick={() => {
                                                                window.open(human.twitter);
                                                            }}
                                                        >
                                                            <img src={TwitterIcon} alt="TwitterIcon" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="c-bottom">
                                                    {human.introduction}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="avatar">
                                            <img src={human.avatar} alt="avatar" />
                                        </div>
                                    </div>
                                )
                            })
                        ) : ''}
                    </div>
                </div>
            </section>

            <section className="qa-section">
                <div className="qa-content">
                    <h3 className="title">Q&A</h3>
                    <div className="questions">
                        {questions.length ? (
                            questions.map((question, index) => {
                                return (
                                    <div 
                                        onClick={() => {
                                            let _questions = JSON.parse(JSON.stringify(questions));
                                            _questions[index].open = !_questions[index].open;
                                            setQuestions(_questions);
                                        }} 
                                        key={index}
                                        className={`question cursor ${question.open && 'open'}`} 
                                        style={{background: question.backgroundColor}}
                                    >
                                        <div className="arrow">
                                            <img src={UpArrowIcon} alt="UpArrowIcon" />
                                        </div>
                                        <div className="q">
                                            <div className="q-l">Q:</div>
                                            <div className="q-r">{question.question}</div>
                                        </div>
                                        {question.open ? (
                                            <div className="a">
                                                <div className="a-l">A:</div>
                                                <div className="a-r">{question.answer}</div>
                                            </div>
                                        ) : ''}
                                    </div>
                                );
                            })
                        ) : ''}
                    </div>
                </div>
            </section>

            <section className="bottom-section">
                <img src={AboutBottom} alt="AboutBottom" />
            </section>
        </div>
    );
}
