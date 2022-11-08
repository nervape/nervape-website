import { useEffect, useState } from "react";
import { nervapeApi } from "../../api/nervape-api";
import { ChapterList } from "../../nervape/story";
import { NavTool } from "../../route/navi-tool";
import "./index.less";

export default function Story() {

    const [chapters, setChapters] = useState<ChapterList[]>();

    useEffect(() => {
        nervapeApi.fnGetChapters().then(res => {
            setChapters(res);
        })
    }, []);

    return (
        <div className="stories-container main-container">
            <div className="story-header">
                <div className="title">NERVAPE SAGA</div>
                <div className="desc">
                    Our story unfolds in 3 chapters that follow the Nervapes’ journey to find the Third Continent.
                    If the Nervapes make it to the Third Continent, what awaits them will be beyond expectations.
                    They will continue onwards to explore the vast Third Continent and meet new characters,
                    discover unique features of the land, and find fantasy elements that will be added as 3D NFTs to the blockchain.
                </div>
            </div>
            <div className="story-content">
                {chapters?.map((chapter, index) => {
                    return (
                        <div className="chapter-item" key={index}>
                            <div className="process-left">
                                <div className="process-c" style={{ background: chapter.background }}>
                                    {/* <div className="process" style={{ background: chapter.background }}></div> */}
                                    <div className="dot" style={{ background: chapter.color }}></div>
                                </div>
                            </div>
                            <div className="story-items">
                                <div className="chapter-info">
                                    <div className="chapter-info-c">
                                        <div className="chapter-title" style={{ color: chapter.color }}>{chapter.name}</div>
                                        <div className="chapter-desc">{chapter.desc}</div>
                                    </div>
                                </div>
                                <div className="stories">
                                    {chapter.stories?.map((story, _index) => {
                                        return (
                                            <div className="item story-item cursor" onClick={() => {
                                                NavTool.fnJumpToPage(`/story/${story?._id}`)
                                            }} key={_index}>
                                                <img loading="lazy" className="image-url dishover" src={story.imageUrl} alt="imageUrl" />
                                                <img loading="lazy" className="image-url hover" src={story.hoverImageUrl} alt="imageUrl" />
                                                <span className="serial">{story.serial.split(' ')[1]}</span>
                                                <div className="story-info hover">
                                                    <span className="name">{story.title}</span>
                                                    <span className="overview">{story.overview}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {chapter.coming_soon && (
                                        <div className="item coming-soon">
                                            <span className="serial">COMING SOON</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
