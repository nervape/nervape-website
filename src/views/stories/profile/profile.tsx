import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { nervapeApi } from "../../../api/nervape-api";
import { Story } from "../../../nervape/story";
import Footer from "../../components/footer";
import "./profile.less";

export default function StoryProfile(props: any) {
    const params = useParams();
    const [story, setStory] = useState<Story>();
    
    useEffect(() => {
        if (!params.id) return;
        nervapeApi.fnGetStoryDetail(params.id).then(res => {
            console.log(res);
            setStory(res);
        })
    }, [params.id]);
   
    return (
        <div className="story-profile-container main-container">
            <div className="banner">
                <img src={story?.bannerUrl} alt="bannerUrl" />
            </div>
            <div className="profile-content">
                <div className="header-sketch">
                    <img src={story?.headerSketch} alt="headerSketch" />
                </div>
                <div className="story-content" style={{background: story?.background}}>
                    <div className="profile-info">
                        <div className="chapter-name">{story?.chapterId?.name}</div>
                        <div className="story-serial">{story?.serial}</div>
                        <div className="story-name">{story?.title}</div>
                        <div className="sr-content" dangerouslySetInnerHTML={{ __html: story?.content || "" }}></div>
                    </div>
                    <div className="footer-sketch">
                        <img src={story?.footerSketch} alt="footerSketch" />
                    </div>
                    <div className="page-footer">
                        <Footer></Footer>
                    </div>
                </div>
            </div>
        </div>
    );
}
