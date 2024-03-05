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
import { Digital, Question, Staff } from "../../nervape/about";
import { nervapeApi } from "../../api/nervape-api";
import TwitterIcon from '../../assets/about/twitter.svg';
import UpArrowIcon from '../../assets/about/up_arrow.svg';
import AboutBottom from '../../assets/about/about_bottom.png';
import { NavTool } from "../../route/navi-tool";
import { DataContext, isMobile, scrollToTop } from "../../utils/utils";
import CryptapeLogo from '../../assets/about/partners/cryptape.svg';
import DidLogo from '../../assets/about/partners/did.svg';
import JoyidLogo from '../../assets/about/partners/joyid.svg';
import Mail3Logo from '../../assets/about/partners/mail3.svg';
import NervosLogo from '../../assets/about/partners/nervos.svg';
import RbyLogo from '../../assets/about/partners/rby.svg';
import SeedaoLogo from '../../assets/about/partners/seedao.svg';

import TwitterLogo from '../../assets/about/social-media/twitter.svg';
import DiscodeLogo from '../../assets/about/social-media/discode.svg';
import InstagramLogo from '../../assets/about/social-media/instagram.svg';
import YoutubeLogo from '../../assets/about/social-media/youtube.svg';
import PodcastLogo from '../../assets/about/social-media/podcast.svg';
import MediumLogo from '../../assets/about/social-media/medium.svg';
import PinterestLogo from '../../assets/about/social-media/pinterest.svg';
import RedLogo from '../../assets/about/social-media/red.svg';

import { Parallax } from 'rc-scroll-anim';
import Footer from "../components/footer";

export default function AboutPage() {
    const [humans, setHumans] = useState<Staff[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currIndex, setCurrIndex] = useState(-1);
    const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
    const [innerHeight, setInnerHeight] = useState(0);
    const [digitals, setDigitals] = useState<Digital[]>([]);
    const [partners, setPartners] = useState<Digital[]>([]);
    const [socialMedia, setSocialMedia] = useState<Digital[]>([]);

    const { state } = useContext(DataContext);

    const bannerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setDigitals([
            {
                cover_image: 'https://nervape-storage.s3.ap-southeast-1.amazonaws.com/album-main/production/8714f12c-907a-4742-992d-1e1ae9e43c8a.png',
                title: 'NACP',
                link: '/nacp'
            },
            {
                cover_image: 'https://nervape-storage.s3.ap-southeast-1.amazonaws.com/album-main/production/33702679-bcf5-4ba6-83ac-7eafdbd30958.png',
                title: '3D Collection',
                link: '/3dnft'
            },
            {
                cover_image: 'https://nervape-storage.s3.ap-southeast-1.amazonaws.com/album-main/production/58a53ee5-af10-478f-a2a3-55d0685ba782.png',
                title: 'Collab NFTs',
                link: '/collab-nfts'
            }
        ]);
        setPartners([
            {
                cover_image: NervosLogo,
                title: '',
                link: 'https://www.nervos.org/',
            },
            {
                cover_image: CryptapeLogo,
                title: '',
                link: 'https://cryptape.com/#/home',
            },
            {
                cover_image: JoyidLogo,
                title: '',
                link: 'https://joy.id/',
            },
            {
                cover_image: DidLogo,
                title: '',
                link: 'https://d.id/',
            },
            {
                cover_image: SeedaoLogo,
                title: '',
                link: 'https://seedao.xyz/',
            },
            {
                cover_image: Mail3Logo,
                title: '',
                link: 'https://mail3.me/',
            },
            {
                cover_image: RbyLogo,
                title: '',
                link: 'https://www.facebook.com/rbywooddesign/',
            },
        ]);

        setSocialMedia([
            {
                cover_image: TwitterLogo,
                title: '',
                link: 'https://twitter.com/Nervapes',
            },
            {
                cover_image: DiscodeLogo,
                title: '',
                link: 'https://discord.gg/rXTcbsxnzd',
            },
            {
                cover_image: InstagramLogo,
                title: '',
                link: 'https://www.instagram.com/nervapes/?hl=en',
            },
            {
                cover_image: YoutubeLogo,
                title: '',
                link: 'https://www.youtube.com/@nervapes',
            },
            {
                cover_image: PodcastLogo,
                title: '',
                link: 'https://podcasts.apple.com/us/podcast/nervape-podcast/id1715173378',
            },
            {
                cover_image: MediumLogo,
                title: '',
                link: 'https://medium.com/@Nervape/',
            },
            {
                cover_image: PinterestLogo,
                title: '',
                link: 'https://www.pinterest.com/nervape/',
            },
            {
                cover_image: RedLogo,
                title: '',
                link: 'https://www.xiaohongshu.com/user/profile/60d0b58300000000010009b8?xhsshare=CopyLink&appuid=60d0b58300000000010009b8&apptime=1696992894',
            },
        ]);
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
                {state.windowWidth !== 375 && (
                    <div className="intro-top" id="intro-top">
                        <Parallax
                            animation={{ opacity: 0, top: `${innerHeight + 300}px`, playScale: [1, 1.3] }}
                            style={{ opacity: 1, top: `${innerHeight}px` }}
                            location="intro-top"
                            className="intro-top-text"
                        >
                            Nervape is a Metaverse with an Ongoing Story and NFTs Shaped by the Community.
                        </Parallax>
                    </div>
                )}

                <div className="planet-large" id="planet-large">
                    {state.windowWidth !== 375 ? (
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
            <section className="mission-section">
                <div className="section-bg flex-center">
                    <img loading="lazy" src={state.windowWidth !== 375 ? SceneDragon : SceneDragonSmall} alt="SceneDragon" />

                    <div className="title">”YOU ARE THE ONLY ONE WHO CAN DEFINE YOURSELF.”</div>
                </div>
            </section>
            <div className="stable-line"></div>
            <section className="digital-section">
                <div className="section-bg flex-align">
                    {digitals.map((digital, index) => {
                        return (
                            <div className="digital-item cursor" key={index}>
                                <img src={digital.cover_image} onClick={() => {
                                    if (digital.link) {
                                        window.open(digital.link, '_blank');
                                    }
                                }} alt="" />
                                <div className="title transition">{digital.title}</div>
                            </div>
                        );
                    })}
                </div>

                <div className="digital-info">
                    <div className="title">Digital NFTs</div>

                    <div className="desc">
                        <p>Express yourself. Create your own avatar. Nervape is for everyone.</p>
                        <p>Character NFTs that have been released by Nervape can be disassembled and reassembled into different combinations.</p>
                    </div>
                </div>
            </section>
            <div className="stable-line"></div>
            <section className="physical-section">
                <div className="section-bg flex-center">
                    <img loading="lazy" src={state.windowWidth !== 375 ? SceneDragon : SceneDragonSmall} alt="SceneDragon" />
                    <div className="title">”YOU ARE THE ONLY ONE WHO CAN DEFINE YOURSELF.”</div>
                </div>
            </section>
            <div className="stable-line"></div>
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
                    <img loading="lazy" src={state.windowWidth !== 375 ? SceneDragon : SceneDragonSmall} alt="SceneDragon" />
                </div>
                {/* <div className="customizable-collection">
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
                                window.open('https://medium.com/@Nervape/customize-your-nft-e2ed3c460d33');
                            }}
                        >
                            <div className="a">DETAIL</div>
                            <img loading="lazy" src={ArrowIcon} alt="ArrowIcon" />
                        </div>
                    </div>
                </div> */}
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
                                        className={`human ${state.windowWidth !== 375 ? 'pc' : 'mobile'} ${currIndex === index && 'open'}`}
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

            <section className="partners-section">
                <div className="title">Partners</div>

                <div className="partners flex-align">
                    {partners.map((partner, index) => {
                        return (
                            <div className="partner cursor" key={index}>
                                <img src={partner.cover_image} onClick={() => {
                                    if (partner.link) {
                                        window.open(partner.link, '_blank');
                                    }
                                }} alt="" />
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="social-media-section">
                <div className="title">Social Media</div>

                <div className="social-medias flex-align">
                    {socialMedia.map((item, index) => {
                        return (
                            <div className="social-media transition cursor" key={index}>
                                <img src={item.cover_image} onClick={() => {
                                    if (item.link) {
                                        window.open(item.link, '_blank');
                                    }
                                }} alt="" />
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* <section className="qa-section">
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
            </section> */}

            <section className="bottom-section">
                <img loading="lazy" src={AboutBottom} alt="AboutBottom" />
            </section>
            <section className="page-footer">
                <Footer></Footer>
            </section>
        </div>
    );
}
