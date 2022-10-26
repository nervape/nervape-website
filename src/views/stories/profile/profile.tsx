import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { nervapeApi } from "../../../api/nervape-api";
import { Story } from "../../../nervape/story";
import { NavTool } from "../../../route/navi-tool";
import { getWindowScrollTop } from "../../../utils/utils";
import Footer from "../../components/footer";
import "./profile.less";

export default function StoryProfile(props: any) {
    const params = useParams();
    const [story, setStory] = useState<Story>();
    const [isRead, setIsRead] = useState(false);

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
        <div className="story-profile-container main-container">
            <div className="banner">
                <img loading="lazy" src={story?.bannerUrl} alt="bannerUrl" />
            </div>
            <div className="profile-content">
                <div className="header-sketch">
                    <img loading="lazy" src={story?.headerSketch} alt="headerSketch" />
                </div>
                <div className="story-content" style={{ background: story?.background }}>
                    <div className="profile-info">
                        <div className="chapter-name">{story?.chapterId?.name}</div>
                        <div className="story-serial">{story?.serial}</div>
                        <div className="story-name">{story?.title}</div>
                        <div className="sr-content" dangerouslySetInnerHTML={{ __html: story?.content || "" }}></div>
                    </div>
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
