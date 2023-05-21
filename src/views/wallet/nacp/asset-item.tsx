import { useEffect, useState } from "react";
import { NACP_SPECIAL_ASSET, STORY_QUIZ_STATUS } from "../../../nervape/nacp";
import useIntervalAsync from "../../../hooks/useIntervalAsync";

export default function AssetItem(props: { asset: NACP_SPECIAL_ASSET; }) {
    const { asset } = props;

    const [status, setStatus] = useState<STORY_QUIZ_STATUS>();
    const [formatTimeStr, setFormatTimeStr] = useState('');

    useIntervalAsync(formatTime, 1000);

    function fnGetStoryQuizStatus(asset: NACP_SPECIAL_ASSET) {
        const now = new Date().getTime();

        if (now < asset.task_start_time) {
            return STORY_QUIZ_STATUS.NOT_START;
        } else if (now >= asset.task_start_time && now <= asset.task_end_time) {
            return STORY_QUIZ_STATUS.IN_PROGRESS;
        } else {
            return STORY_QUIZ_STATUS.OVER;
        }
    }

    async function formatTime() {
        const now = new Date().getTime();

        const timestamp = status == STORY_QUIZ_STATUS.IN_PROGRESS ? asset.task_end_time : asset.task_start_time;

        if (now > timestamp) return setFormatTimeStr('');

        const diff = (timestamp - now) / 1000;
        const day = parseInt(diff / 86400 + "");

        // 
        const remain = diff % 86400;
        const hour = parseInt(remain / 3600 + "");

        //
        const _remain = remain % 3600;
        const minute = parseInt(_remain / 60 + "");

        setFormatTimeStr(day + 'd ' + hour + 'h ' + minute + 'm');
    }

    useEffect(() => {
        const _status = fnGetStoryQuizStatus(asset);
        setStatus(_status);
    }, [asset]);

    if (!asset.isObtain && status == STORY_QUIZ_STATUS.OVER) return <></>;

    return (
        <div className="nacp-asset-item">
            <div className="cover-image">
                <img className="cover" src={asset.url} alt="AssetCoverImage" />
                {!asset.isObtain && (
                    <div className={`cover-no-right transition flex-center ${status}`}>
                        <div className="story-name">
                            Story001
                            <br />
                            Challenge Reward
                        </div>
                        <div className="time-left">
                            {status == STORY_QUIZ_STATUS.IN_PROGRESS ? 'Time left:' : 'Available in:'}
                            <br />
                            {formatTimeStr}
                        </div>
                    </div>
                )}
            </div>
            <div className="asset-name">{asset.name}</div>
            <div className="category flex-align">
                <img src={asset.category?.icon} alt="CategoryIcon" className="category-icon" />
                <div className="category-name">{asset.category?.name}</div>
            </div>
        </div>
    );
}
