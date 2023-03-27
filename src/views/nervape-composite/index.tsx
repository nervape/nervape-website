import React, { useContext, useEffect, useState } from "react";
import './index.less';

import LandingBanner from '../../assets/landing-page/banner.png';
import DownArrow from '../../assets/landing-page/arrow_down.svg';
import QAImage from '../../assets/nacp/Q&A.png';
import LeftArrow from '../../assets/landing-page/left_arrow.svg';
import RightArrow from '../../assets/landing-page/right_arrow.svg';
import DownArrowIcon from '../../assets/nacp/down_arrow.svg';
import NacpTitle from '../../assets/nacp/nacp.svg';
import NacpMTitle from '../../assets/nacp/nacp_m.svg';
import TwitterIcon from '../../assets/nacp/twitter.svg';
import DiscodeIcon from '../../assets/nacp/discode.svg';
import { Intro, Parthership, Phase, Question } from "../../nervape/composite";
import { PfpMocks } from "../../mock/composite-mock";
import Footer from "../components/footer";
import { nervapeApi } from "../../api/nervape-api";
import { DataContext } from "../../utils/utils";
import { Tooltip } from "antd";
import { Parallax, OverPack } from 'rc-scroll-anim';
import TweenOne from 'rc-tween-one';
import QueueAnim from 'rc-queue-anim';
import { Swiper, SwiperSlide, useSwiper, useSwiperSlide } from 'swiper/react';
import { EffectFade } from 'swiper';
import "swiper/css";

export function SwiperPrevButton(props: { index: number }) {
    const { index } = props;
    const swiper = useSwiper();

    return (
        <img
            className={`arrow left-arrow cursor ${index !== 0 && 'show'}`}
            src={LeftArrow}
            onClick={() => {
                swiper.slidePrev()
            }}
            alt="LeftArrow" />
    );
}

export function SwiperNextButton(props: { index: number }) {
    const { index } = props;
    const swiper = useSwiper();

    return (
        <img
            className={`arrow right-arrow cursor ${index !== 3 && 'show'}`}
            src={RightArrow}
            onClick={() => {
                console.log(swiper)
                swiper.slideNext()
            }}
            alt="RightArrow" />
    );
}

export function SwiperContent(props: { phase: Phase; index: number }) {
    const { phase, index } = props;
    const swiperSlide = useSwiperSlide();

    return (
        <div className={`phase-step-swiper transition ${swiperSlide.isActive ? 'active' : ''}`} style={{ background: phase.background }}>
            <div className="title-c flex-center">
                <SwiperPrevButton index={index}></SwiperPrevButton>
                <div className="title-date">
                    <div className="phase-title">{phase.title}</div>
                    <div className="phase-date">{phase.startDate + '~' + phase.endDate}</div>
                </div>
                <SwiperNextButton index={index}></SwiperNextButton>
            </div>
            <div className="phase-assets flex-center">
                {phase.assets.map((asset, _index) => {
                    return (
                        <div className="phase-asset" key={_index}>
                            <img src={asset.cover} className="phase-asset-img" alt="phase-asset-img" />
                            <div className="phase-asset-name">{asset.name}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function Composite() {
    const { state } = useContext(DataContext);
    const [showLandingPage, setShowLandingPage] = useState(false);
    const [godwokenAddress, setGodwokenAddress] = useState('');
    const [isBonelist, setIsBonelist] = useState(false);
    const [open, setOpen] = useState(false);

    const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
    const [introItems, setIntroItems] = useState<Intro[]>([]);
    const [parthershipItems, setParthershipItems] = useState<Parthership[]>([]);

    const [questions, setQuestions] = useState<Question[]>([]);
    const [phases, setPhases] = useState<Phase[]>([]);
    const [phaseCover, setPhaseCover] = useState('');


    const IntroItem = (props: { item: any; }) => {
        const { item } = props;
        return (
            <div className="intro-item">
                <div className="intro-img-cover">
                    <img className="intro-img img-filter" src={item.cover} alt="" />
                </div>
                <div className="intro-title">{item.title}</div>
                <div className="intro-desc">{item.desc}</div>
            </div>
        );
    }

    const ParthershipItem = (props: { item: any; index: number; }) => {
        const { item, index } = props;
        return (
            <div className="parthership-item">
                <div className="parthership-tag">
                    <div className="tag">{item.tag}</div>
                    <div className="date">{item.date}</div>
                </div>
                <div className="parthership-title">{item.title}</div>
                <div className="parthership-desc">{item.desc}</div>
            </div>
        );
    }

    useEffect(() => {
        setShowLandingPage(true);
        const {
            questionsData,
            introData,
            parthershipData,
            phaseData } = PfpMocks.fnGetNacpData();
        setIntroItems(introData);
        setParthershipItems(parthershipData);
        setPhases(phaseData);
        setQuestions(questionsData);
    }, []);

    return (
        <div className="home-page font-color">
            {showLandingPage && (
                <div className="landing-page">
                    <section className="banner-section">
                        <video
                            className="banner"
                            id="video"
                            playsInline
                            loop
                            preload="true"
                            autoPlay
                            muted
                            src={state.windowWidth !== 375
                                ? "https://nervape-storage.s3.ap-southeast-1.amazonaws.com/album-main/production/PfpAssets/18f3c218-9386-4880-9d82-3acfd35a2595.mp4"
                                : "https://nervape-storage.s3.ap-southeast-1.amazonaws.com/album-main/production/PfpAssets/6571452b-9e7e-459e-866c-acbd7c3e260c.mp4"}>
                        </video>
                        {/* <img src={DownArrow} className="cursor down-arrow"
                            onClick={() => {
                                window.scrollTo({
                                    top: window.innerHeight,
                                    behavior: 'smooth'
                                })
                            }} alt="" /> */}
                    </section>

                    <section className="composite-section">
                        <OverPack playScale={0.5} style={{ overflow: 'hidden' }}>
                            <TweenOne className="nervape-composite"
                                key="0" animation={{ opacity: 1, translateY: 0 }} style={{ opacity: 0, transform: 'translateY(30px)' }}>
                                <div className="composite">
                                    <div className="title transition">
                                        <img src={state.windowWidth === 375 ? NacpMTitle : NacpTitle} />
                                    </div>
                                    <div className="description">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                                        nisi ut aliquip ex ea commodo consequat.
                                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                                        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                                        sunt in culpa qui officia deserunt mollit anim id est laborum.
                                    </div>
                                </div>
                            </TweenOne>
                            <div className="composite-content">
                                <QueueAnim key="queue"
                                    className="intro-items"
                                    style={{ float: 'left', position: 'relative', left: '0' }}>
                                    {introItems.map((item, index) => {
                                        return (
                                            <div className="intro-content" key={index}>
                                                <IntroItem item={item}></IntroItem>
                                                {index == 0 && (
                                                    <div className="bone-list">
                                                        <div className="title">Bonelist Lookup</div>
                                                        <div className="address-input">
                                                            <Tooltip
                                                                title={() => {
                                                                    return (
                                                                        <p>{isBonelist ? 'In Bonelist' : 'Not In Bonelist'}</p>
                                                                    );
                                                                }}
                                                                placement="bottom"
                                                                overlayClassName="bonelist-tooltip"
                                                                color="#506077"
                                                                open={open}>
                                                                <input type="text" value={godwokenAddress} onInput={(e: any) => {
                                                                    setGodwokenAddress(e.target.value)
                                                                    setOpen(false);
                                                                }} placeholder="Ethereum address" />
                                                            </Tooltip>
                                                            <button
                                                                className="check-btn cursor"
                                                                onClick={async () => {
                                                                    if (!godwokenAddress) return;
                                                                    const res = await nervapeApi.fnSearchBonelist(godwokenAddress);
                                                                    console.log(res);
                                                                    setOpen(true);
                                                                    setIsBonelist(res > 0);
                                                                }}>CHECK</button>
                                                        </div>
                                                        <div className="tip">
                                                            To be notified as soon as we go live... Join Our <a className="cursor font-color" href="https://discord.com/invite/7br6nvuNHP" target="_blank" rel="noopener noreferrer">Discord</a>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </QueueAnim>
                            </div>
                        </OverPack>
                    </section>

                    <section className="minting-phases-section">
                        <div className="minting-content">
                            <OverPack>
                                <TweenOne key="1" animation={{ opacity: 1, translateY: 0 }} style={{ opacity: 0, transform: 'translateY(30px)' }}>
                                    <div className="section-title">MINTING PHASES</div>
                                    <div className="desc">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        Ut enim ad minim veniam, quis nostrud exercitation ullamco
                                        laboris nisi ut aliquip ex ea commodo consequat.
                                    </div>
                                    <div className="learn-more">
                                        <a href="##" className="font-color" target="_blank">Learn more</a>
                                    </div>
                                </TweenOne>

                                <div className="phase-content flex-center">
                                    <TweenOne key="2" animation={{ opacity: 1, translateX: 0 }}
                                        style={{ opacity: 0, transform: 'translateX(-50px)' }}>
                                        <div className="phase-img-cover">
                                            <img style={{ background: phaseCover }} className="phase-img img-filter" alt="" />
                                        </div>
                                    </TweenOne>

                                    {state.windowWidth > 750 ? (
                                        <QueueAnim className="phase-step"
                                            type="right"
                                            animConfig={[
                                                { opacity: [1, 0], translateX: [0, -50] },
                                                { opacity: [1, 0], translateX: [0, 50] }
                                            ]}
                                        >
                                            {phases.map((phase, index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className="phase-item transition-1 img-filter"
                                                        style={{ background: phase.background }}
                                                        onMouseOver={() => {
                                                            setPhaseCover(phase.background);
                                                        }}
                                                        onMouseOut={() => {
                                                            setPhaseCover('');
                                                        }}
                                                    >
                                                        <div className="origin-item transition-1">
                                                            <div className="phase-title">{phase.title}</div>
                                                            <div className="phase-date">{phase.startDate + '~' + phase.endDate}</div>
                                                        </div>
                                                        <div className="hover-item transition-1 flex-center">
                                                            <div className="editable">Editable Assets</div>
                                                            {phase.assets.map((asset, _index) => {
                                                                return (
                                                                    <div className="phase-asset" key={_index}>
                                                                        <img src={asset.cover} className="phase-asset-img" alt="phase-asset-img" />
                                                                        <div className="phase-asset-name">{asset.name}</div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                );
                                            })}
                                        </QueueAnim>
                                    ) : (
                                        <>
                                            <Swiper
                                                className="img-filter"
                                                autoHeight={true}
                                                effect={"fade"}
                                                fadeEffect={
                                                    {
                                                        crossFade: true,
                                                        transformEl: '.phase-step-swiper'
                                                    }
                                                }
                                                modules={[EffectFade]}
                                                onSlideChange={(e) => {
                                                    setPhaseCover(phases[e.activeIndex].background);
                                                }}
                                            >
                                                {phases.map((phase, index) => {
                                                    return (
                                                        <SwiperSlide key={index}>
                                                            <SwiperContent phase={phase} index={index}></SwiperContent>
                                                        </SwiperSlide>
                                                    );
                                                })}
                                            </Swiper>
                                        </>
                                    )}
                                </div>
                            </OverPack>
                        </div>
                    </section>

                    <section className="what-new-section">
                        <div className="what-new-content">
                            <OverPack>
                                <TweenOne key="what-1" animation={{ opacity: 1, translateY: 0 }} style={{ opacity: 0, transform: 'translateY(30px)' }}>
                                    <div className="section-title">WHAT’S NEW?</div>
                                </TweenOne>

                                <div className="new-parthership">
                                    {state.windowWidth > 750 && (
                                        <div className="new-left">
                                            <TweenOne key="what-2" animation={{ opacity: 1, translateX: 0 }} style={{ opacity: 0, transform: 'translateX(-30px)' }}>
                                                <div className="cover-image img-filter"></div>
                                            </TweenOne>

                                            <TweenOne key="what-3" animation={{ opacity: 1, translateY: 0 }} style={{ opacity: 0, transform: 'translateY(30px)' }}>
                                                <ParthershipItem item={parthershipItems[0]} index={0}></ParthershipItem>
                                            </TweenOne>
                                        </div>
                                    )}

                                    <div className="new-right">
                                        <QueueAnim
                                            delay={300}
                                            animConfig={[
                                                { opacity: [1, 0], translateY: [0, -100] },
                                                { opacity: [1, 0], translateY: [0, 100] }
                                            ]}
                                            className="parthership-items">
                                            {parthershipItems.map((item, index) => {
                                                return (
                                                    <ParthershipItem key={index} item={item} index={index}></ParthershipItem>
                                                );
                                            })}
                                        </QueueAnim>

                                        <TweenOne key="what-4" animation={{ opacity: 1, delay: 1000 }} style={{ opacity: 0 }}>
                                            <div className="view-all">
                                                <div className="view-btn cursor">VIEW ALL</div>
                                            </div>
                                        </TweenOne>
                                    </div>
                                </div>
                            </OverPack>
                        </div>
                    </section>
                    <section className="partner-program-section">
                        <div className="partner-content">
                            <OverPack>
                                <div className="partner-top flex-align">
                                    <TweenOne className="top-left" key="partner-1" animation={{ opacity: 1, translateX: 0 }}
                                        style={{ opacity: 0, transform: 'translateX(-50px)' }}>
                                        <div className="section-title">PARTNER PROGRAM</div>
                                        <div className="desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </div>
                                        <div className="join-us cursor">JOIN US</div>
                                    </TweenOne>
                                    <TweenOne key="partner-2" animation={{ opacity: 1, duration: 500 }}
                                        style={{ opacity: 0 }}>
                                        <div className="top-right img-filter"></div>
                                    </TweenOne>
                                </div>
                                <div className="partner-artists">
                                    <TweenOne key="partner-3" animation={{ opacity: 1, translateY: 0 }}
                                        style={{ opacity: 0, transform: 'translateY(50px)' }}>
                                        <div className="artist-title">PARTNER ARTISTS</div>
                                    </TweenOne>

                                    <QueueAnim
                                        className="artist-imgs"
                                        type="right"
                                        animConfig={[
                                            { opacity: [1, 0], translateX: [0, -50] },
                                            { opacity: [1, 0], translateX: [0, 50] }
                                        ]}>
                                        {[1, 2, 3, 4].map(m => {
                                            return <img key={m} className="artist-img img-filter" alt="" />
                                        })}
                                    </QueueAnim>
                                </div>
                            </OverPack>
                        </div>
                    </section>
                    <section className="qa-section flex-justify">
                        {state.windowWidth > 750 && (
                            <div className="qa-image-c">
                                <img src={QAImage} className="qa-image" alt="QAImage" />
                            </div>
                        )}

                        <div className="qa-content">
                            <h3 className="section-title">Q&A</h3>
                            <div className="questions">
                                {questions.length ? (
                                    questions.map((question, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`question cursor ${question.open && 'open'}`}
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
                                                <div
                                                    className="arrow"
                                                >
                                                    <img loading="lazy" src={DownArrowIcon} alt="DownArrowIcon" />
                                                </div>
                                                <div className="q">
                                                    <div className="q-l">Q:</div>
                                                    <div className="q-r">{question.question}</div>
                                                </div>

                                                <div className={`a ${question.open && 'show'}`}>
                                                    <div className="a-l">A:</div>
                                                    <div className="a-r">
                                                        {question.answer}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : ''}
                            </div>
                        </div>
                    </section>

                    <section className="join-section">
                        <div className="join-content">
                            <Parallax
                                animation={{ opacity: 1, translateY: 0, playScale: [0, 0.5] }}
                                style={{ opacity: 0, transform: 'translateY(100px)' }}>
                                <div className="section-title">JOIN OUR COMMUNITY</div>
                                <div className="desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </div>
                                <div className="join-icons">
                                    <img
                                        className="cursor"
                                        onClick={() => {
                                            window.open('https://twitter.com/Nervapes')
                                        }}
                                        src={TwitterIcon}
                                        alt="TwitterIcon" />
                                    <img
                                        className="cursor"
                                        onClick={() => {
                                            window.open('https://discord.com/invite/7br6nvuNHP')
                                        }}
                                        src={DiscodeIcon}
                                        alt="DiscodeIcon" />
                                </div>
                            </Parallax>
                        </div>
                        <Footer></Footer>
                    </section>
                </div>
            )}
        </div>
    );
}
