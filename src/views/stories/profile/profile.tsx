import React, { useContext, useEffect, useState } from "react";
import { useParams, useLocation } from "react-router";
import { nervapeApi } from "../../../api/nervape-api";
import { Story } from "../../../nervape/story";
import { NavTool } from "../../../route/navi-tool";
import { DataContext, scrollToTop, shuffle } from "../../../utils/utils";
import Footer from "../../components/footer";
import "./profile.less";
import CharacterDefaultIcon from "../../../assets/story/character_default.svg";
import SideCloseIcon from "../../../assets/story/close.svg";
import InfoIcon from '../../../assets/story/info.svg';

import { Parallax } from 'rc-scroll-anim';
import { useAccount, useSignMessage } from "wagmi";
import { Types } from "../../../utils/reducers";
import StoryQuestionPop from "../question/question";
import { SiweMessage } from "siwe";
import { godWoken, godWokenTestnet } from "../../../utils/Chain";
import { queryOatPoaps } from "../../../utils/api";
import { Tooltip } from "antd";
import LeaveConfirm from "../question/leave-confirm";

function SideStoryDetail(props: any) {
    const { close, story } = props;
    return (
        <div
            className="side-story-detail mask-cover"
            style={{ background: story?.sideStoryBackground }}
            onClick={close}
            onTouchMove={e => {
                e.preventDefault();
            }}>
            <div className="side-content" onClick={e => {
                e.stopPropagation();
            }}>
                <div className="side-top">
                    <div className="side-l">
                        <div className="chapter-name">
                            {/* <span>{story?.serial}</span> */}
                            {story.sideStorySerial}
                        </div>
                        <div className="story-name">{story?.sideStoryName}</div>
                    </div>
                    <div className="close" onClick={close}>
                        <img src={SideCloseIcon} alt="" />
                    </div>
                </div>
                <div className="side-bottom">
                    <img src={story.sideStoryCover} alt="" />
                    <div className="desc">{story.sideStoryDesc}</div>
                </div>
            </div>
        </div>
    );
}

export default function StoryProfile(props: any) {
    const params = useParams();
    const location = useLocation();
    const [story, setStory] = useState<Story | undefined>();
    const [hasTake, setHasTake] = useState(false);
    const [hasTakeOat, setHasTakeOat] = useState(false);
    const { state, dispatch } = useContext(DataContext);
    const [keyId, setKeyId] = useState(0);
    const [showSide, setShowSide] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

    // 钱包相关
    const { address, isConnected } = useAccount();

    const domain = window.location.host;
    const origin = window.location.origin;

    const { signMessageAsync } = useSignMessage();

    const createSiweMessage = async (_address: string, statement: string) => {
        const res = await nervapeApi.fnGetStoryQuizNonce();

        const message = new SiweMessage({
            domain,
            address: _address,
            statement,
            uri: origin,
            version: '1',
            chainId: godWoken.id,
            nonce: res
        });

        return message.prepareMessage();
    }

    const signInWithEthereum = async () => {
        if (!address || !story) return false;

        const message = await createSiweMessage(address, story.signMessage || 'Sign in to complete Story Challenge.');

        const signature = await signMessageAsync({ message });

        const res = await nervapeApi.fnStoryQuizVerify(message, signature, story?.id);

        if (res) {
            nervapeApi.fnQueryHasTakeQuiz(address, story.id).then(async res => {
                setHasTake(res > 0);

                await _queryOatPoaps(address, story.galxeCampaignId);
            });
        }
        return res;
    }

    const _queryOatPoaps = async (_address: string, _campaignId: string) => {
        const _oatPoaps = await queryOatPoaps(_address, _campaignId);
        setHasTakeOat(_oatPoaps.length > 0);
    }

    const openGalxeUrl = () => {
        window.open(`https://galxe.com/nervape/campaign/${story?.galxeCampaignId}`)
    }

    useEffect(() => {
        window.onload = () => {
            console.log('onload', location);
            if (location.hash == '#quiz') {
                setTimeout(() => {
                    const storyProfile = document.getElementById('quiz');
                    storyProfile?.scrollIntoView({ behavior: 'smooth' });
                }, 300);
            }
        }
    }, []);

    useEffect(() => {
        if (!params.id) return;
        nervapeApi.fnGetStoryDetail(params.id).then(res => {
            res.questions = shuffle(res.questions || []);
            setStory(res);
        })
    }, [params.id]);

    useEffect(() => {
        if (!address || !isConnected || !story) return;

        nervapeApi.fnQueryHasTakeQuiz(address, story.id).then(async res => {
            setHasTake(res > 0);
            if (res > 0) {
                await _queryOatPoaps(address, story.galxeCampaignId);
            }
        });
    }, [address, isConnected, story]);

    if (!story) return <></>;

    const challengeTitle = () => {
        return (
            <div className="challenge-title">
                Take the Nervape Saga Challenge to test your knowledge of Nervape’s story
                and for a chance to win a Nervape Saga Scholar OAT!
                <ul>
                    <li>Follow Nervape Twitter (@Nervapes)</li>
                    <li>Join Nervape Discord</li>
                    <li>
                        <span>Read the Nervape Saga and complete the challenge! You can do it!</span>
                    </li>
                </ul>
            </div>
        );
    }
    const { previousStory, nextStory } = story;

    const fnPrev = () => {
        if (previousStory) {
            return (
                <div
                    className="sr-previous"
                    onClick={() => {
                        setStory(undefined);
                        scrollToTop();
                        setKeyId(keyId + 1);
                        NavTool.fnJumpToPage(
                            `/story/${previousStory.urlMask}`
                        );
                    }}
                >
                    {`< PREVIOUS`}
                </div>
            );
        }
    };
    const fnNext = () => {
        if (nextStory) {
            return (
                <div
                    className="sr-next"
                    onClick={() => {
                        setStory(undefined);
                        scrollToTop();
                        setKeyId(keyId + 1);
                        NavTool.fnJumpToPage(
                            `/story/${nextStory.urlMask}`
                        );
                    }}
                >
                    {`NEXT >`}
                </div>
            );
        }
    };

    function ArrowRight() {
        return (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 2L11 8L5 14" stroke="#666666" strokeWidth="2" />
            </svg>
        );
    }

    const fnSideStory = () => {
        return (
            <div className="side-story">
                <div className="side-c cursor" onClick={() => {
                    document.body.style.overflow = 'hidden';
                    setShowSide(true);
                }}>
                    <div className="icon">
                        <img className="story-icon dishover" src={story.sideStoryIcon} alt="" />
                        <img className="story-icon hover" src={story.sideStoryIconHover} alt="" />
                    </div>
                    <div className="side-info">
                        <div className="title">
                            {story.sideStorySerial}
                        </div>
                        <div className="nfts">
                            {story.nfts.map((nft) => {
                                return (
                                    <div className="character-icon" key={nft.id}>
                                        <img className="character dishover" src={CharacterDefaultIcon} alt="" />
                                        <img className="character hover" src={nft.character_icon} alt="" />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="right-arrow">
                        <ArrowRight></ArrowRight>
                    </div>
                </div>
            </div>
        );
    }

    const fnGetBanner = () => {
        const urls = story?.bannerUrl.split('.');
        if (urls.length > 1 && urls[urls.length - 1] === 'mp4') {
            return <video
                id="video"
                playsInline
                loop
                preload="true"
                autoPlay
                muted
                src={state.windowWidth !== 375 ? story?.bannerUrl : story?.bannerUrlSmall}></video>
        }
        return <img loading="lazy" src={state.windowWidth !== 375 ? story?.bannerUrl : story?.bannerUrlSmall} alt="bannerUrl" />
    }

    const fnQuiz = () => {
        const questions = story?.questions;

        if (story?.collectable && questions?.length) {
            return (
                <div className="quiz-btn-container">
                    <div className="quiz-btn-content" style={{ background: story?.collectQuizBackground }}>
                        <div className="quiz-left flex-align">
                            <img className="quiz-icon" alt="" />
                            <div className="quiz">CHALLENGE</div>
                            <div className="info-icon">
                                <Tooltip
                                    showArrow={state.windowWidth > 750}
                                    overlayClassName="challenge-tooltip"
                                    color="#506077"
                                    title={challengeTitle()}
                                >
                                    <img src={InfoIcon} alt="infoIcon" />
                                </Tooltip>
                            </div>
                        </div>

                        <div className={`quiz-right`}>
                            {!isConnected ? (
                                <div className="connect-tip">
                                    Take the challenge to win an award!
                                    <button className="connect-btn quiz-btn button-hover-action-red cursor"
                                        onClick={() => {
                                            dispatch({
                                                type: Types.ShowLoginModal,
                                            })
                                        }}>CONNECT WALLET</button>
                                </div>
                            ) :
                                !hasTake ? (
                                    <div className="take-quiz">
                                        Test your Nervape Saga knowledge.
                                        <button className="take-quiz-btn quiz-btn button-hover-action-red cursor"
                                            onClick={() => {
                                                document.body.style.overflow = 'hidden';
                                                setShowQuiz(true);
                                            }}>START</button>
                                    </div>
                                ) : !hasTakeOat ? (
                                    <div className="claim-reward">
                                        Challenge completed!
                                        <button className="connect-btn quiz-btn button-hover-action-red cursor"
                                            onClick={() => {
                                                openGalxeUrl();
                                            }}>CLAIM REWARD</button>
                                    </div>
                                ) : (
                                    <div className="claim-reward">
                                        Reward Claimed. You’re a true follower of Nervape!
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            );
        }

        return <></>;
    }

    return (
        <div id="story-profile-container" className="story-profile-container main-container" key={keyId}>
            <div className="banner">
                {fnGetBanner()}
            </div>
            <div className="profile-content">
                <div className="header-sketch">
                    <img loading="lazy" src={story?.headerSketch} alt="headerSketch" />
                </div>
                <div className="story-content" style={{ background: story?.background }}>
                    <Parallax
                        animation={{ y: 0, opacity: 1, playScale: [0.1, 0.5] }}
                        style={{ transform: 'translateY(50px)', opacity: 0 }}
                    >
                        <div className="profile-info">
                            <div className="chapter-name">
                                <span>{story?.chapterId?.name}</span>
                                {` | ${story?.serial}`}
                            </div>
                            <div className="story-name">{story?.title}</div>
                            <div className="sr-content" dangerouslySetInnerHTML={{ __html: story?.content || "" }}></div>
                            {story.sideStoryOpen && fnSideStory()}
                            {fnQuiz()}
                        </div>
                    </Parallax>
                    <div className="footer-sketch" id="quiz">
                        <img loading="lazy" src={story?.footerSketch} alt="footerSketch" />
                        <div className="sr-nav-footer">
                            {fnPrev()}
                            {fnNext()}
                        </div>
                    </div>
                    <div className="page-footer">
                        <Footer></Footer>
                    </div>
                </div>
            </div>
            {showSide && (
                <SideStoryDetail
                    story={story}
                    close={() => {
                        document.body.style.overflow = 'auto';
                        setShowSide(false);
                    }}></SideStoryDetail>
            )}
            <StoryQuestionPop
                show={showQuiz}
                questions={story?.questions || []}
                signInWithEthereum={signInWithEthereum}
                openGalxeUrl={openGalxeUrl}
                close={() => {
                    setShowLeaveConfirm(true);
                }}></StoryQuestionPop>
            <LeaveConfirm
                show={showLeaveConfirm}
                close={() => {
                    setShowLeaveConfirm(false);
                }}
                confirm={() => {
                    document.body.style.overflow = 'auto';
                    setShowLeaveConfirm(false);
                    setShowQuiz(false);
                }}></LeaveConfirm>
        </div>
    );
}
