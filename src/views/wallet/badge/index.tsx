import React, { useEffect, useState } from "react";
import './index.less';
import { PoapItem } from "../../../utils/poap";

export default function WalletBadge(props: { badges: PoapItem[]; }) {
    const { badges } = props;

    const [chapters, setChapters] = useState<any[]>([]);

    useEffect(() => {
        setChapters([
            {
                title: 'Chapter 1: Factory of Broken Dreams',
                stories: [
                    {
                        cover: ''
                    },
                    {
                        cover: ''
                    },
                    {
                        cover: ''
                    },
                    {
                        cover: ''
                    },
                    {
                        cover: ''
                    },
                    {
                        cover: ''
                    },
                ]
            },
            {
                title: 'Chapter 2: Kingdom of Arancia',
                stories: [
                    {
                        cover: ''
                    },
                    {
                        cover: ''
                    },
                    {
                        cover: ''
                    },
                    {
                        cover: ''
                    },
                    {
                        cover: ''
                    },
                    {
                        cover: ''
                    },
                    {
                        cover: ''
                    },
                    {
                        cover: ''
                    },
                    {
                        cover: ''
                    },
                    {
                        cover: ''
                    },
                    {
                        cover: ''
                    },
                    {
                        cover: ''
                    },
                ]
            },
            {
                title: 'Chapter 3: ???',
                stories: [
                    {
                        cover: ''
                    },
                    {
                        cover: ''
                    },
                    {
                        cover: ''
                    },
                    {
                        cover: ''
                    },
                    {
                        cover: ''
                    },
                    {
                        cover: ''
                    },
                ]
            }
        ]);
    }, []);

    return (
        <div className="wallet-badge-container">
            <div className="wallet-badge-header">
                <div className="badge-title">EVENT BADGE</div>
            </div>

            <div className="wallet-badge-content">
                {badges.length > 0 && (
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
                )}
            </div>

            <div className="wallet-badge-header story-reward">
                <div className="badge-title">STORY REWARD</div>
            </div>

            <div className="wallet-badge-content wallet-story-reward-content flex-align">
                <div className="review-card"></div>
                <div className="wallet-story-rewards">
                    {chapters.map((chapter, index) => {
                        return (
                            <div className="chapter-item" key={`chapter-${index}`}>
                                <div className="title">{chapter.title}</div>
                                <div className="chapter-stories flex-align">
                                    {chapter.stories.map((story, _index) => {
                                        return (
                                            <div className="story-item" key={`story-${_index}`}>
                                                <img alt="" />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
