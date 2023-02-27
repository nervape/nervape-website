import React from 'react';
import './poap-badge.less';
import { PoapItem } from '../../../utils/poap';

export default function PoapBadge(props: { badges: PoapItem[] }) {
    const { badges } = props;

    return (
        <div className="poap-badge-container">
            <div className="title">Nervape Badge</div>
            {badges.length > 0 && (
                <div className="badge-content">
                    {badges.map((badge, index) => {
                        return (
                            <div className="badge-cover" key={index}>
                                <img
                                    src={
                                        badge.isHold
                                            ? badge.cover_image_url
                                            : badge.inactivated_cover_url
                                    }
                                    className="cover-image"
                                    alt=""
                                />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
