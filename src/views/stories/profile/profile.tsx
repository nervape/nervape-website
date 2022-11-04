import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { nervapeApi } from "../../../api/nervape-api";
import { Story } from "../../../nervape/story";
import { NavTool } from "../../../route/navi-tool";
import { DataContext, getWindowScrollTop, scrollToTop } from "../../../utils/utils";
import Footer from "../../components/footer";
import "./profile.less";

import { Parallax } from 'rc-scroll-anim';

export default function StoryProfile(props: any) {
    const params = useParams();
    const [story, setStory] = useState<Story | undefined>();
    const [isRead, setIsRead] = useState(false);
    const { windowWidth } = useContext(DataContext);
    const [keyId, setKeyId] = useState(0);

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
                            `/story/${previousStory.id}`
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
                            `/story/${nextStory.id}`
                        );
                    }}
                >
                    {`NEXT >`}
                </div>
            );
        }
    };

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
        </div>
    );
}
