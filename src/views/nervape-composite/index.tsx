import React, { useContext, useEffect, useRef, useState } from "react";
import './index.less';

import LandingBanner from '../../assets/landing-page/banner.png';
import DownArrow from '../../assets/landing-page/arrow_down.svg';
import PhaseDefaultCover from '../../assets/nacp/phases/minting_0.png';
import QAImage from '../../assets/nacp/Q&A.png';
import LeftArrow from '../../assets/landing-page/left_arrow.svg';
import RightArrow from '../../assets/landing-page/right_arrow.svg';
import DownArrowIcon from '../../assets/nacp/down_arrow.svg';
import NacpLandingPartner from '../../assets/nacp/NACP_landing_partner.png';
import NacpTitle from '../../assets/nacp/nacp.svg';
import NacpMTitle from '../../assets/nacp/nacp_m.svg';
import TwitterIcon from '../../assets/nacp/twitter.svg';
import DiscodeIcon from '../../assets/nacp/discode.svg';

import BannerText1 from '../../assets/nacp/banner_text_1.png';
import BannerText2 from '../../assets/nacp/banner_text_2.png';

import { Banner, Intro, Parthership, Phase, Question, SneakPeek } from "../../nervape/composite";
import { PfpMocks } from "../../mock/composite-mock";
import Footer from "../components/footer";
import { nervapeApi } from "../../api/nervape-api";
import { DataContext, getWindowScrollTop } from "../../utils/utils";
import { Tooltip } from "antd";
// "build": "tsc --noEmit && vite build", 打包报错, build 命令先去除 TS 检测
import { OverPack, Parallax } from 'rc-scroll-anim';
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
                    {/* <div className="phase-date">{phase.startDate + '~' + phase.endDate}</div> */}
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
    const [joinUsClick, setJoinUsClick] = useState(false);

    const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
    const [introItems, setIntroItems] = useState<Intro[]>([]);
    const [parthershipItems, setParthershipItems] = useState<Parthership[]>([]);

    const [questions, setQuestions] = useState<Question[]>([]);
    const [phases, setPhases] = useState<Phase[]>([]);
    const [sneakPeeks, setSneakPeeks] = useState<SneakPeek[]>([]);
    const [phaseCover, setPhaseCover] = useState(PhaseDefaultCover);
    const [banner, setBanner] = useState<Banner>();

    const [sneakCurrPercent, setSneakCurrPercent] = useState(0);
    const sneakRef = useRef(null);

    const fnGetSneakPeeks = async () => {
        const res = await nervapeApi.fnNacpSneakPeek();
        setSneakPeeks(res);
    }

    const IntroItem = (props: { item: any; }) => {
        const { item } = props;
        return (
            <div className="intro-item">
                <div className="intro-img-cover">
                    <img className="intro-img img-filter" src={item.cover} alt="" />
                </div>
                <div className="intro-title">{item.title}</div>
                <div className="intro-desc" dangerouslySetInnerHTML={{ __html: item.desc || "" }}></div>
            </div>
        );
    }

    const ParthershipItem = (props: { item: Parthership; index: number; }) => {
        const { item, index } = props;
        return (
            <div className="parthership-item cursor" onClick={() => {
                window.open(item.link);
            }}>
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
        if (!phases.length) return;
        if (state.windowWidth <= 750) setPhaseCover(phases[0].cover);
    }, [state.windowWidth, phases]);

    useEffect(() => {
        setShowLandingPage(true);
        const {
            questionsData,
            introData,
            parthershipData,
            phaseData,
            bannerData } = PfpMocks.fnGetNacpData();
        setIntroItems(introData);
        setParthershipItems(parthershipData);
        setPhases(phaseData);
        setQuestions(questionsData);
        setBanner(bannerData[Math.floor(Math.random() * bannerData.length)]);
        fnGetSneakPeeks();
    }, []);

    function handleScroll() {
        if (!sneakRef.current) return;
        if (!sneakPeeks.length) return;

        const offset = window.innerWidth - (state.windowWidth > 750 ? 64 : 32);
        const sneakW = (state.windowWidth > 750 ? 664 : 379) * sneakPeeks.length;

        const sTop = getWindowScrollTop();
        const sneakTop = (sneakRef.current as HTMLElement).offsetTop;

        const diffOffset = sTop - sneakTop;

        if (diffOffset > 0 && diffOffset < sneakW - offset) {
            setSneakCurrPercent(diffOffset);
        } else if (diffOffset < 0) {
            setSneakCurrPercent(0);
        } else {
            setSneakCurrPercent(sneakW - offset);
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, true);

        return () => window.removeEventListener('scroll', handleScroll, true);
    });

    return (
        <div className="home-page font-color">
            {showLandingPage && (
                <div className="landing-page">
                    <div className="page-wrap">
                        <div className="nacp-header-content">
                            <Parallax animation={{ backgroundColor: banner?.endBackground, playScale: [1, 3.5] }}
                                style={{ background: banner?.startBackground }}>

                                <section className="banner-section" id="banner-section">
                                    <div className="banner-content">
                                        <div className="banner-container">
                                            <div className="banner">
                                                <img className="banner-img banner-img-1" src={banner?.qaBg} alt="" />
                                                <Parallax
                                                    animation={{ top: `${state.windowWidth > 750 ? '-50px' : '-20px'}`, opacity: 0, playScale: [1, 1.5] }}
                                                    style={{ top: 0, opacity: 1 }}
                                                    location="banner-section"
                                                    className="banner-img"
                                                >
                                                    <img className="banner-img banner-img-2" src={BannerText1} alt="" />
                                                </Parallax>
                                                <Parallax
                                                    animation={{ top: 0, opacity: 1, playScale: [1.5, 1.8] }}
                                                    style={{ top: `${state.windowWidth > 750 ? '50px' : '20px'}`, opacity: 0 }}
                                                    location="banner-section"
                                                    className="banner-img"
                                                >
                                                    <img className="banner-img banner-img-3" src={BannerText2} alt="" />
                                                </Parallax>
                                            </div>
                                            <div className="banner banner-1">
                                                <img className="banner-img banner-img-4" src={banner?.ape} alt="" />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="composite-section">
                                    <OverPack always={false} playScale={0.3} style={{ overflow: 'hidden' }}>
                                        <TweenOne className="nervape-composite"
                                            key="0" animation={{ opacity: 1, delay: 200, duration: 600 }} style={{ opacity: 0 }}>
                                            <div className="composite">
                                                <div className="title transition">
                                                    <img src={state.windowWidth === 375 ? NacpMTitle : NacpTitle} />
                                                </div>
                                                <div className="description">
                                                    NERVAPE COMPOSITE (NACP) is Nervape’s customizable 2D PFP NFTs that let users express themselves. Build and mint your own ape PFPs by selecting from over 700 different design assets created by the team and our community!
                                                </div>
                                            </div>
                                        </TweenOne>
                                        <div className="composite-content" id="composite-content">
                                            {/* <div className="intro-items" style={{ float: 'left', position: 'relative', left: '0' }}>
                                                {introItems.map((item, index) => {
                                                    return (
                                                        <TweenOne className="intro-content"
                                                            key={`composite-${index}`} animation={{ opacity: 1, delay: 200 * (index + 1), duration: 600 }} style={{ opacity: 0 }}>
                                                            <IntroItem item={item}></IntroItem>
                                                            {index == 0 && (
                                                                <div className="bone-list">
                                                                    <div className="title">Bonelist Lookup</div>
                                                                    <div className="address-input">
                                                                        <Tooltip
                                                                            title={() => {
                                                                                return (
                                                                                    <p>{isBonelist ? (
                                                                                        <>
                                                                                            🦴 You’re a bonelist holder!
                                                                                            <br />
                                                                                            🦧 Welcome to the Third Continent.
                                                                                        </>
                                                                                    ) : '❗️You’re not a bonelist ape. No bones for you (yet). Try harder! Join our community for opportunities to get a bonelist! '}</p>
                                                                                );
                                                                            }}
                                                                            placement="bottom"
                                                                            overlayClassName="bonelist-tooltip"
                                                                            color={`${isBonelist ? "#F44D37" : "#CDCFD1"}`}
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
                                                                                setOpen(false);
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
                                                        </TweenOne>
                                                    );
                                                })}
                                            </div> */}
                                            <div className="bone-list">
                                                <div className="title">Bonelist Lookup</div>
                                                <div className="address-input">
                                                    <Tooltip
                                                        title={() => {
                                                            return (
                                                                <p>{isBonelist ? (
                                                                    <>
                                                                        🦴 You’re a bonelist holder!
                                                                        <br />
                                                                        🦧 Welcome to the Third Continent.
                                                                    </>
                                                                ) : '❗️You’re not a bonelist ape. No bones for you (yet). Try harder! Join our community for opportunities to get a bonelist! '}</p>
                                                            );
                                                        }}
                                                        placement="bottom"
                                                        overlayClassName="bonelist-tooltip"
                                                        color={`${isBonelist ? "#F44D37" : "#CDCFD1"}`}
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
                                                            setOpen(false);
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
                                        </div>
                                    </OverPack>
                                </section>
                            </Parallax>
                        </div>

                        <div className="scroll-content">
                            <div className="scroll-list">
                                <ul>
                                    <li>
                                        <span>SHOW YOUR CREATIVITY</span>
                                        <span className="express-yourself">EXPRESS YOURSELF</span>
                                        {state.windowWidth > 375 ? (
                                            <>
                                                <span>SHOW YOUR CREATIVITY</span>
                                                <span className="express-yourself">EXPRESS YOURSELF</span>
                                            </>
                                        ) : ''}
                                    </li>
                                </ul>
                                <ul>
                                    <li>
                                        <span>SHOW YOUR CREATIVITY</span>
                                        <span className="express-yourself">EXPRESS YOURSELF</span>
                                        {state.windowWidth > 375 ? (
                                            <>
                                                <span>SHOW YOUR CREATIVITY</span>
                                                <span className="express-yourself">EXPRESS YOURSELF</span>
                                            </>
                                        ) : ''}
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <section className="minting-phases-section">
                            <div className="minting-content">
                                <OverPack always={false} playScale={0.3}>
                                    <TweenOne key="1" animation={{ opacity: 1, delay: 200, duration: 600 }} style={{ opacity: 0 }}>
                                        <div className="section-title">DRESSING STEPS</div>
                                        <div className="desc">
                                            NACP PFP has 13 different types of assets you can use to assemble your Nervape PFP. 
                                            These asset classes will be divided in 3 steps. 
                                            Each step will allow you to easily buy, trade, and sell your NACP! 
                                            We encourage you to try through all 3 steps to get the full PFP experience 
                                            that our platform has to offer and to design the ape PFP you want!
                                        </div>
                                        <div className="learn-more">More details coming soon!</div>
                                    </TweenOne>

                                    <div className="phase-content flex-center">
                                        <TweenOne key="2" animation={{ opacity: 1, delay: 200, duration: 600 }}
                                            style={{ opacity: 0 }}>
                                            <div className="phase-img-cover img-filter">
                                                <img src={phaseCover} className="phase-img" alt="" />
                                            </div>
                                        </TweenOne>

                                        {state.windowWidth > 750 ? (
                                            <QueueAnim className="phase-step"
                                                type="right"
                                                delay={200}
                                                duration={1000}
                                                animConfig={[
                                                    { opacity: [1, 0], translateY: [0, -50] },
                                                    { opacity: [1, 0], translateY: [0, 50] }
                                                ]}
                                            >
                                                {phases.map((phase, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            className="phase-item transition-1 img-filter"
                                                            style={{ background: phase.background }}
                                                            onMouseOver={() => {
                                                                setPhaseCover(phase.cover);
                                                            }}
                                                            onMouseOut={() => {
                                                                setPhaseCover(PhaseDefaultCover);
                                                            }}
                                                        >
                                                            <div className="origin-item transition-1">
                                                                <div className="phase-title">{phase.title}</div>
                                                                {/* <div className="phase-date">{phase.startDate + '~' + phase.endDate}</div> */}
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
                                                        setPhaseCover(phases[e.activeIndex].cover);
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
                                <OverPack always={false} playScale={0.3}>
                                    <TweenOne key="what-1" animation={{ opacity: 1, delay: 200, duration: 600 }} style={{ opacity: 0 }}>
                                        <div className="section-title">WHAT’S NEW?</div>
                                    </TweenOne>

                                    <div className="new-parthership">
                                        {state.windowWidth > 750 && (
                                            <div className="new-left cursor" onClick={() => {
                                                window.open(parthershipItems[0].link);
                                            }}>
                                                <TweenOne key="what-2" animation={{ opacity: 1, delay: 400, duration: 600 }} style={{ opacity: 0 }}>
                                                    <img className="cover-image img-filter" src="https://nervape-storage.s3.ap-southeast-1.amazonaws.com/album-main/production/8c16604a-3a5e-4e5e-adf2-6236c76249c2.png" alt="" />
                                                </TweenOne>

                                                <TweenOne key="what-3" animation={{ opacity: 1, delay: 600, duration: 600 }} style={{ opacity: 0 }}>
                                                    <ParthershipItem item={parthershipItems[0]} index={0}></ParthershipItem>
                                                </TweenOne>
                                            </div>
                                        )}

                                        <div className="new-right">
                                            <QueueAnim
                                                delay={600}
                                                duration={600}
                                                animConfig={[
                                                    { opacity: [1, 0], translateY: [0, -100] },
                                                    { opacity: [1, 0], translateY: [0, 100] }
                                                ]}
                                                className="parthership-items">
                                                {parthershipItems.filter((p, index) => {
                                                    if (state.windowWidth > 375) {
                                                        return index > 0;
                                                    } else {
                                                        return true;
                                                    }
                                                }).map((item, index) => {
                                                    return (
                                                        <ParthershipItem key={index} item={item} index={index}></ParthershipItem>
                                                    );
                                                })}
                                            </QueueAnim>

                                            <TweenOne key="what-4" animation={{ opacity: 1, delay: 800, duration: 600 }} style={{ opacity: 0 }}>
                                                <div className="view-all">
                                                    <div className="view-btn cursor" onClick={() => {
                                                        window.open('https://tourmaline-elderberry-f93.notion.site/Community-Activities-NACP-36814e1fca4c4f119a07ec0a5cdd48f2?pvs=4')
                                                    }}>VIEW ALL</div>
                                                </div>
                                            </TweenOne>
                                        </div>
                                    </div>
                                </OverPack>
                            </div>
                        </section>

                        <section className="sneak-peek-section" style={{ height: `calc(${(state.windowWidth > 750 ? 664 : 379) * sneakPeeks.length + 'px'} - 100vw + ${state.windowWidth > 750 ? 192 : 64}px + 100vh)` }} ref={sneakRef}>
                            <div className="sticky-wrap">
                                <div className="scroll-inner" style={{ width: 664 * sneakPeeks.length + 'px', transform: `translateX(${-sneakCurrPercent}px)` }}>
                                    {sneakPeeks.map((s, index) => {
                                        return (
                                            <div className="scroll-card" key={index}>
                                                <img src={s.url} alt="Sneak Peek" />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>

                        <section className="partner-program-section">
                            <div className="partner-content">
                                <OverPack always={false} playScale={0.2}>
                                    <div className="partner-top">
                                        <TweenOne className="top-left" key="partner-1" animation={{ opacity: 1, delay: 200, duration: 600 }}
                                            style={{ opacity: 0 }}>
                                            <div className="section-title">
                                                {state.windowWidth > 750 ? ('COLLABORATE WITH US!') : (
                                                    <>
                                                        COLLABORATE
                                                        <br />
                                                        WITH US!
                                                    </>
                                                )}
                                            </div>
                                            <div className="desc">
                                                We value co-creation!
                                                <br />
                                                If you’re an artist or designer with a passion for collaboration,
                                                <br />
                                                join us in creating NACP assets together!
                                            </div>
                                            <div
                                                className={`join-us disable-use-select cursor ${joinUsClick && 'click'}`}
                                                onClick={() => {
                                                    window.open("https://docs.google.com/forms/d/e/1FAIpQLSf5z0cIt3VtwMYPhRyXwnfCb6p2oQo-XqtSqn7PYEq-i77rgA/viewform?usp=pp_url");
                                                }}
                                                onMouseDown={() => {
                                                    setJoinUsClick(true);
                                                }}
                                                onMouseUp={() => {
                                                    setJoinUsClick(false);
                                                }}
                                                onMouseLeave={() => {
                                                    setJoinUsClick(false);
                                                }}
                                                onTouchStart={() => {
                                                    setJoinUsClick(true);
                                                }}
                                                onTouchEnd={() => {
                                                    setJoinUsClick(false);
                                                }}
                                                onTouchCancel={() => {
                                                    setJoinUsClick(false);
                                                }}>JOIN US
                                            </div>
                                        </TweenOne>
                                        <TweenOne key="partner-2" animation={{ opacity: 1, delay: 200, duration: 600 }}
                                            style={{ opacity: 0 }}>
                                            <img src={NacpLandingPartner} className="top-right" />
                                        </TweenOne>
                                    </div>
                                    {/* <div className="partner-artists">
                                        <TweenOne className="artist-title" key="partner-3" animation={{ opacity: 1, delay: 400, duration: 600 }}
                                            style={{ opacity: 0 }}>
                                            <div>PARTNER ARTISTS</div>
                                        </TweenOne>

                                        <div className="artist-imgs flex-center">
                                            {[1, 2, 3, 4].map((m, index) => {
                                                return (
                                                    <TweenOne key={`artist-${index}`}
                                                        className="artist-img img-filter"
                                                        animation={{ opacity: 1, delay: 200 * (index + 1), duration: 600 }}
                                                        style={{ opacity: 0 }}>
                                                        <img alt="" />
                                                    </TweenOne>
                                                );
                                            })}
                                        </div>
                                    </div> */}
                                </OverPack>
                            </div>
                        </section>
                        {/* <section className="qa-section">
                            <div className="qa-container">
                                <OverPack className="flex-justify" always={false} playScale={0.3}>
                                    {state.windowWidth > 750 && (
                                        <TweenOne key="qa-1"
                                            animation={{ opacity: 1, delay: 200, duration: 600 }}
                                            style={{ opacity: 0 }}
                                            className="qa-image-c">
                                            <img src={QAImage} className="qa-image" alt="QAImage" />
                                        </TweenOne>
                                    )}

                                    <div className="qa-content">
                                        <TweenOne key="qa-2" animation={{ opacity: 1, delay: 200, duration: 600 }} style={{ opacity: 0 }}>
                                            <h3 className="section-title">Q&A</h3>
                                        </TweenOne>

                                        <div className="questions">
                                            {questions.length ? (
                                                questions.map((question, index) => {
                                                    return (
                                                        <TweenOne
                                                            key={`question-${index}`}
                                                            animation={{ opacity: 1, delay: 200 * (index + 1), duration: 600 }}
                                                            style={{ opacity: 0 }}
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
                                                            }}>
                                                            <div className="arrow">
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
                                                        </TweenOne>
                                                    );
                                                })
                                            ) : ''}
                                        </div>
                                    </div>
                                </OverPack>
                            </div>
                        </section> */}
                    </div>

                    <section className="join-section">
                        <footer className="join-footer">
                            <div className="join-content">
                                <div className="section-title">JOIN OUR COMMUNITY</div>
                                <div className="desc">
                                    Don’t miss our NACP release!
                                    <br />
                                    An NACP PFP will open more doors for you in the Nervape ecosystem.
                                </div>
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
                            </div>
                            <Footer></Footer>
                        </footer>
                    </section>
                </div>
            )}
        </div>
    );
}
