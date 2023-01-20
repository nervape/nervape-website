import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { nervapeApi } from "../../../api/nervape-api";
import { Story } from "../../../nervape/story";
import { NavTool } from "../../../route/navi-tool";
import { DataContext, getWindowScrollTop, scrollToTop } from "../../../utils/utils";
import Footer from "../../components/footer";
import "./profile.less";
import CharacterDefaultIcon from "../../../assets/story/character_default.svg";
import SideCloseIcon from "../../../assets/story/close.svg";

import { Parallax } from 'rc-scroll-anim';

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
    const [story, setStory] = useState<Story | undefined>();
    const [isRead, setIsRead] = useState(false);
    const { windowWidth } = useContext(DataContext);
    const [keyId, setKeyId] = useState(0);
    const [showSide, setShowSide] = useState(false);

    useEffect(() => {
        if (!params.id) return;
        nervapeApi.fnGetStoryDetail(params.id).then(res => {
            setStory(res);
        })
    }, [params.id]);

    if (!story) return <></>;

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

    return (
        <div className="story-profile-container main-container" key={keyId}>
            <div className="banner">
                <img loading="lazy" src={windowWidth !== 375 ? story?.bannerUrl : story?.bannerUrlSmall} alt="bannerUrl" />
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
                        </div>
                    </Parallax>
                    <div className="footer-sketch">
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
        </div>
    );
}
