import React, { useContext, useEffect, useRef, useState } from "react";

import AboutBg from '../../assets/about/effect/about_bg.png';
import AboutPlanetLarge from '../../assets/about/effect/about_planet_large.png';
import AboutPlanetDark from '../../assets/about/effect/about_planet_dark.png';
import AboutLittlePlanet from '../../assets/about/effect/about_little_planets.png';
import AboutLight from '../../assets/about/effect/about_light.png';
import AboutLightSmall from '../../assets/about/effect/light_small.png';
import Bonelist from '../../assets/about/bonelist.svg';
import AboutStory01 from '../../assets/about/about_story-01.png';
import AboutStory02 from '../../assets/about/about_story-02.png';
import ArrowIcon from '../../assets/about/icon_arrow.png';
import SceneDragon from '../../assets/about/scene_dragon.png';
import SceneDragonSmall from '../../assets/about/scene_dragon_small.png';
import './index.less';
import { Question, Staff } from "../../nervape/about";
import { nervapeApi } from "../../api/nervape-api";
import TwitterIcon from '../../assets/about/twitter.svg';
import UpArrowIcon from '../../assets/about/up_arrow.svg';
import AboutBottom from '../../assets/about/about_bottom.png';
import { NavTool } from "../../route/navi-tool";
import { DataContext, isMobile, scrollToTop } from "../../utils/utils";

import { Parallax } from 'rc-scroll-anim';
import Footer from "../components/footer";

export default function AboutPage() {
    const [humans, setHumans] = useState<Staff[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currIndex, setCurrIndex] = useState(-1);
    const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
    const [innerHeight, setInnerHeight] = useState(0);

    const { windowWidth } = useContext(DataContext);

    const bannerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setInnerHeight(window.innerHeight / 2);
        nervapeApi.fnGetStaffs().then(res => {
            setHumans(res);
        })
        nervapeApi.fnGetQuestions().then(res => {
            setQuestions(res);
        })
    }, []);
    if (innerHeight <= 0) return <></>;

    return (
        <div className="about-container main-container">
            <div className="banner" ref={bannerRef}>
                <img loading="lazy" src={AboutBg} alt="bannerUrl" />
            </div>

            <section className="intro-section">
                {windowWidth !== 375 && (
                    <div className="intro-top" id="intro-top">
                        <Parallax
                            animation={{ opacity: 0, top: `${innerHeight + 300}px`, playScale: [1, 1.3] }}
                            style={{ opacity: 1, top: `${innerHeight}px` }}
                            location="intro-top"
                            className="intro-top-text"
                        >
                            Nervape is a Metaverse with an Ongoing Story and 3D NFTs Shaped by the Community.
                        </Parallax>
                    </div>
                )}

                <div className="planet-large" id="planet-large">
                    {windowWidth !== 375 ? (
                        <Parallax
                            animation={{ top: '400px', opacity: 0, playScale: [1, 1.3] }}
                            style={{ top: '0', opacity: 1 }}
                            location="planet-large"
                            className="light-c"
                        >
                            <img className="light" src={AboutLight} alt="AboutLight" />
                        </Parallax>
                    ) : (
                        <>
                            <Parallax
                                animation={{ top: '400px', opacity: 0, playScale: [1, 1.3] }}
                                style={{ top: '0', opacity: 1 }}
                                location="planet-large"
                                className="light-c small"
                            >
                                <img className="light" src={AboutLightSmall} alt="AboutLightSmall" />
                                <div className="intro-top-text">Nervape is a Metaverse with an Ongoing Story and 3D NFTs Shaped by the Community.</div>
                            </Parallax>
                        </>
                    )}
                    <Parallax
                        animation={{ scale: 1.1, playScale: [0.8, 1.5] }}
                        style={{ scale: 1 }}
                        className="little-planet-c"
                    >
                        <img className="little-planet" src={AboutLittlePlanet} alt="AboutLittlePlanet" />
                    </Parallax>

                    <img className="dark-img" src={AboutPlanetDark} alt="AboutPlanetDark" />
                    <Parallax
                        animation={{ opacity: 1, playScale: [0.95, 1.2] }}
                        style={{ opacity: 0 }}
                    >
                        <img className="light-img" src={AboutPlanetLarge} alt="AboutPlanetLarge" />
                    </Parallax>
                </div>

                <div className="intro-bottom" id="intro-bottom">
                    <Parallax
                        animation={[
                            { opacity: 1, bottom: '-230px', playScale: [1, 1.4] }
                        ]}
                        location="intro-bottom"
                        style={{ opacity: 0, bottom: '-454px' }}
                        className="intro-content"
                    >
                        <div className="p">It begins with a dream,</div>
                        <div className="p p1">a dream seen by seekers and believers</div>
                        <div className="p p1">that inhabit the waking world.</div>
                        <div className="p p1">Trudging through life, day by day,</div>
                        <div className="p">they yearn for change, for freedom,</div>
                        <div className="p p1">freedom that was found only in dreams.</div>
                        <div className="p p1">Or so we once believed.</div>
                        <div className="p">Do you dare to seek the unknown?</div>
                        <div className="p p1">To embrace adventure?</div>
                        <div className="p p1">To explore the limits of your strength and courage?</div>
                        <div className="p p1">The Third Continent awaits for those who accept the journey.</div>
                        <img loading="lazy" src={Bonelist} alt="" />
                    </Parallax>

                </div>
            </section>
            <Parallax
                animation={{
                    playScale: [0, 0],
                    onStart: () => {
                        const current = bannerRef.current as unknown as HTMLDivElement;
                        // current.className = "banner banner1";
                    },
                    onStartBack: () => {
                        const current = bannerRef.current as unknown as HTMLDivElement;
                        // current.className = "banner";
                    }
                }}
            >
                <section className="story-section">
                    <div className="storytelling-intro">
                        <h3 className="title">STORYTELLING</h3>
                        <p className="desc">
                            Nervape’s story consists of three main chapters as well as side stories with open endings.
                            Our story is about courage, friendship, discovery, decentralization, and community collaboration.
                            We seek to answer: “What is a decentralized world and how can we get there?”
                        </p>
                        <p className="desc">
                            Nervape’s story is vast and diverse; here, there is room for magic and science to coexist.
                            Like a human neuron, story transmits information and connects us to life.
                            Nervape’s narrative is the source of everything and is a seed waiting to grow.
                        </p>
                        <div
                            className="onging-saga cursor"
                            onClick={() => {
                                window.open('/story');
                                scrollToTop();
                            }}
                        >
                            <div className="a">ONGOING SAGA</div>
                            <img src={ArrowIcon} alt="ArrowIcon" />
                        </div>
                    </div>

                    <div className="story story-01">
                        <img loading="lazy" src={AboutStory01} alt="AboutStory01" />
                    </div>
                    <div className="story story-02">
                        <img loading="lazy" src={AboutStory02} alt="AboutStory01" />
                    </div>
                </section>
            </Parallax>

            <section className="customizable-section">
                <div className="title">”YOU ARE THE ONLY ONE WHO CAN DEFINE YOURSELF.”</div>
                <div className="custom-cover">
                    <img loading="lazy" src={windowWidth !== 375 ? SceneDragon : SceneDragonSmall} alt="SceneDragon" />
                </div>
                <div className="customizable-collection">
                    <div className="custom-content">
                        <div className="title">CUSTOMIZABLE NFT COLLECTION</div>
                        <div className="desc">
                            <p>Express yourself. Create your own avatar. Nervape is for everyone.</p>
                            <p>
                                Character NFTs that have been released by Nervape can be disassembled and reassembled into different combinations.
                                You get to choose what role your Nervape avatar plays as well all the apparel assets you want your avatar to wear.
                                We didn’t give Nervapes any facial features on purpose so that THEY CAN BE ANYBODY AND ANYBODY CAN BE THEM.
                                We are excited to see what Nervape will evolve into as it is shaped by the community’s creativity.
                            </p>
                        </div>
                        <div
                            className="more-detail cursor"
                            onClick={() => {
                                // window.open('/nft');
                                // scrollToTop();
                            }}
                        >
                            <div className="a">DETAIL</div>
                            <img loading="lazy" src={ArrowIcon} alt="ArrowIcon" />
                        </div>
                    </div>
                </div>
            </section>
            <section className="humans-section">
                <div className="humans-content">
                    <h3 className="title">The Humans and Other Creatures Behind Nervape</h3>
                    <p className="desc">A group of humans, Nervapes, and a bear…united by their wild minds.</p>
                    <div className="humans">
                        {humans.length ? (
                            humans.map((human, index) => {
                                return (
                                    <div
                                        className={`human ${windowWidth !== 375 ? 'pc' : 'mobile'} ${currIndex === index && 'open'}`}
                                        style={{ zIndex: humans.length - index }}
                                        key={index}
                                        onClick={() => {
                                            if (!isMobile()) return;
                                            if (currIndex === index) {
                                                setCurrIndex(-1);
                                            } else {
                                                setCurrIndex(index);
                                            }
                                        }}
                                    >
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
                                                            <img loading="lazy" src={TwitterIcon} alt="TwitterIcon" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="c-bottom">
                                                    {human.introduction}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="avatar">
                                            <img loading="lazy" src={human.avatar} alt="avatar" />
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
                                        key={index}
                                        className={`question cursor ${question.open && 'open'}`}
                                        style={{ background: question.background }}
                                        onMouseDown={(e) => {
                                            console.log('down', e)
                                            setClickPosition({ x: e.clientX, y: e.clientY })
                                        }}
                                        onMouseUp={(e) => {
                                            console.log('up', e)
                                            if (e.clientX == clickPosition.x && e.clientY == clickPosition.y) {
                                                let _questions = JSON.parse(JSON.stringify(questions));
                                                _questions.map((q: any, i: number) => {
                                                    if (i !== index) {
                                                        q.open = false;
                                                    }
                                                    return q;
                                                })
                                                _questions[index].open = !_questions[index].open;
                                                setQuestions(_questions);
                                            }
                                            setClickPosition({ x: 0, y: 0 })
                                        }}
                                    >
                                        <div className="hover-cover"></div>
                                        <div
                                            className="arrow"
                                        >
                                            <img loading="lazy" src={UpArrowIcon} alt="UpArrowIcon" />
                                        </div>
                                        <div className="q">
                                            <div className="q-l">Q:</div>
                                            <div className="q-r">{question.question}</div>
                                        </div>
                                        {question.open ? (
                                            <div className="a">
                                                <div className="a-l">A:</div>
                                                <div className="a-r" dangerouslySetInnerHTML={{ __html: question.answer }}></div>
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
                <img loading="lazy" src={AboutBottom} alt="AboutBottom" />
            </section>
            <section className="page-footer">
                <Footer></Footer>
            </section>
        </div>
    );
}