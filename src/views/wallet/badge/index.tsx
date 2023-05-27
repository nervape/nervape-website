import React, { useContext, useEffect, useState } from "react";
import './index.less';
import { PoapItem } from "../../../utils/poap";
import { ChapterList, WalletStoryOat } from "../../../nervape/story";
import { nervapeApi } from "../../../api/nervape-api";
import { queryOatPoaps } from "../../../utils/api";
import { DataContext } from "../../../utils/utils";

import OatIcon from '../../../assets/wallet/badge/oat.svg';
import { NavTool } from "../../../route/navi-tool";

export default function WalletBadge(props: { badges: PoapItem[]; setLoading: Function; isFold: boolean; }) {
    const { badges, setLoading, isFold } = props;

    const { state, dispatch } = useContext(DataContext);

    const [chapters, setChapters] = useState<ChapterList[]>([]);
    const [selectedStoryOat, setSelectedStoryOat] = useState<WalletStoryOat>();

    const openGalxeUrl = (galxeCampaignId: string | undefined) => {
        if (!galxeCampaignId) return;
        window.open(`https://galxe.com/nervape/campaign/${galxeCampaignId}`);
    }

    async function fnGetChapters() {
        setLoading(true);
        const res = await nervapeApi.fnGetChapters();

        await Promise.all(
            res.map(async chapter => {
                chapter.stories = chapter.stories.filter(story => story.collectable);
                await Promise.all(
                    chapter.stories.map(async story => {
                        if (story.galxeCampaignId) {
                            const _oatPoaps = await queryOatPoaps(state.currentAddress, story.galxeCampaignId);
                            story.isHolderOat = _oatPoaps && _oatPoaps.length > 0;
                        } else {
                            story.isHolderOat = false;
                        }
                        return story;
                    })
                );
                return chapter;
            })
        );

        setChapters(res);
        setLoading(false);
    }

    useEffect(() => {
        fnGetChapters();
    }, []);

    useEffect(() => {
        if (chapters.length && chapters[0].stories.length) {
            setSelectedStoryOat({
                walletStoryOatTheme: chapters[0].walletStoryOatTheme,
                chapterName: chapters[0].name,
                story: chapters[0].stories[0],
            });
        }
    }, [chapters]);

    return (
        <div className={`wallet-badge-container ${isFold && 'fold'}`}>
            {badges.length && (
                <>
                    <div className="wallet-badge-header transition position-sticky">
                        <div className="badge-title">EVENT BADGE</div>
                    </div>

                    <div className="wallet-badge-content">
                        <div className="badge-content flex-align">
                            {badges.map((badge, index) => {
                                return (
                                    <div className="badge-cover" key={index}>
                                        <img
                                            src={
                                                badge.isHold
                                                    ? badge.cover_image_url
                                                    : badge.inactivated_cover_url
                                            }
                                            className="cover-image transition"
                                            alt=""
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}

            {chapters.length && (
                <>
                    <div className="wallet-badge-header wallet-story-reward-header transition position-sticky story-reward">
                        <div className="badge-title">STORY REWARD</div>
                    </div>

                    <div className={`wallet-badge-content transition wallet-story-reward-content ${state.windowWidth > 375 && 'flex-align'}`}>
                        <div className="review-card-content transition position-sticky">
                            <div
                                className={`review-card ${!selectedStoryOat?.story?.isHolderOat && 'unholder'}`}
                                style={{
                                    border: `1px solid ${selectedStoryOat?.walletStoryOatTheme}`,
                                    color: `${selectedStoryOat?.walletStoryOatTheme}`
                                }}>
                                {/* <div className="bp">
                                    100
                                    <div className="unit">BP</div>
                                </div> */}
                                <div className="cover-image-c">
                                    <div className="cover-image" style={{ border: `3px solid ${selectedStoryOat?.walletStoryOatTheme}` }}>
                                        <img
                                            className="cover transition"
                                            src={
                                                selectedStoryOat?.story?.isHolderOat
                                                    ? selectedStoryOat?.story?.collectedCover
                                                    : selectedStoryOat?.story?.notCollectCover}
                                            alt="StoryOatCover" />
                                    </div>
                                    <img
                                        className="oat cursor"
                                        src={OatIcon}
                                        onClick={() => {
                                            openGalxeUrl(selectedStoryOat?.story?.galxeCampaignId);
                                        }}
                                        alt="OatIcon" />
                                </div>

                                <div className="story-info">
                                    <div className="chapter-story">
                                        {selectedStoryOat?.chapterName + ' | ' + selectedStoryOat?.story?.serial}
                                    </div>
                                    <div className="story-title cursor" onClick={() => {
                                        NavTool.fnJumpToPage(`/story/${selectedStoryOat?.story?.urlMask}#quiz`);
                                    }}>{selectedStoryOat?.story?.title}</div>
                                    <div className="story-desc">
                                        {selectedStoryOat?.story?.isHolderOat ? selectedStoryOat?.story?.overview : (
                                            <div className="tip">
                                                You have not yet acquired this badge. To earn it, you must complete the
                                                <div className="challenge cursor"
                                                    onClick={() => {
                                                        NavTool.fnJumpToPage(`/story/${selectedStoryOat?.story?.urlMask}#quiz`);
                                                    }}>Story Challenge.</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="wallet-story-rewards">
                            {chapters?.map((chapter, index) => {
                                return (
                                    <div className="chapter-item" key={`chapter-${index}`}>
                                        <div className="title" style={{color: `${chapter.walletStoryOatTheme}`}}>
                                            {chapter.name + ': '}
                                            <span>{chapter.desc.toLocaleLowerCase()}</span>
                                        </div>
                                        <div className="chapter-stories flex-align">
                                            {chapter.stories.length ? (
                                                chapter.stories.map((story, _index) => {
                                                    return (
                                                        <div
                                                            className={`story-item cursor`}
                                                            style={{
                                                                border: (story._id == selectedStoryOat?.story?._id && selectedStoryOat?.walletStoryOatTheme) 
                                                                    ? `3px solid ${selectedStoryOat?.walletStoryOatTheme}` : 'unset'
                                                            }}
                                                            onClick={() => {
                                                                setSelectedStoryOat({
                                                                    walletStoryOatTheme: chapter.walletStoryOatTheme,
                                                                    chapterName: chapter.name,
                                                                    story: story,
                                                                })
                                                            }}
                                                            key={`story-${_index}`}>
                                                            <img 
                                                                className="transition cover-image"
                                                                src={story.isHolderOat ? story.collectedCover : story.notCollectCover} alt="StoryOatCover" />
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="locked">- LOCKED -</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
