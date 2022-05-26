import React, { Component, useImperativeHandle } from "react";
import { StoriesIntro } from "./stories-intro";
import { Chapter, StoriesList } from "./stories-list";
import testImg from "../../assets/noval/intro-bg.png";
import { StoriesReader } from "./stories-reader";
import { StoriesMock } from "../../mock/stories-mock";
import { NavTool } from "../../route/navi-tool";
import "./stories.less";
import { nervapeApi } from "../../api/nervape-api";
import { CHAPTER_TYPE, Story } from "../../nervape/story";
import { NFT } from "../../nervape/nft";
import { WebMock } from "../../mock/web-mock";
import { useParams } from "react-router-dom";

interface StoryDetailPageProps {
}

interface StoryDetailPageStates {
    story?: Story;
    funRef: any;
    storyId: string
}

// 定义函数式组件
function A(props: any) {
    // 获取动态路由的值
    const params = useParams();
    useImperativeHandle(props.onRef, () => {
        props.updateStoryId(params.id);
        return {
            params,
        }
    });
    return (
        <span></span>
    )
}

export class StoryDetailPage extends Component<StoryDetailPageProps, StoryDetailPageStates> {
    constructor(props: StoryDetailPageProps) {
        super(props);
        this.state = { 
            story: undefined,
            funRef: React.createRef(),
            storyId: ''
        };
    }

    fnInitStoryInfo = async (id: string) => {
        // const { latestStory, stories, nfts, chapters } = await WebMock.fnGetMockInfo();
        const { story } = await WebMock.fnGetStoryDetailInfo(id);

        this.setState({
            story
        });
    }

    componentDidUpdate(prevProps: StoryDetailPageProps, prevNext: StoryDetailPageStates) {
        if (this.state.storyId !== prevNext.storyId) {
            this.fnInitStoryInfo(this.state.storyId)
        }
    }
    componentDidMount() {
        // this.fnInitStoryInfo(this.state.funRef.current.params.id);
    }

    fnFindSerialStory() {

    }

    render() {
        const fnShowDetail = () => {
            return <StoriesReader story={this.state.story}></StoriesReader>;
        };

        return (
            <div className="stories-page">
                <A onRef={this.state.funRef} updateStoryId={(id: string) => {
                    if (this.state.storyId !== id) {
                        this.setState({storyId: id})
                    }
                }} style={{display:'none'}}></A>
                {fnShowDetail()}
            </div>
        );
    }
}
