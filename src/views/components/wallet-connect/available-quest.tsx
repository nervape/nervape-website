import React, { useContext } from "react";
import './available-quest.less';
import { Event } from "../../../nervape/campaign";
import { StoryCollectable } from "../../../nervape/story";

import EventIcon from '../../../assets/campaign/event.svg';
import QuizIcon from '../../../assets/campaign/quiz.svg';

import moment from "moment";
import { DataContext, updateBodyOverflow } from "../../../utils/utils";
import { NavTool } from "../../../route/navi-tool";
import { Types } from "../../../utils/reducers";

export default function AvailableQuest(props: { events: Event[]; quizes: StoryCollectable[]; }) {
    const { events, quizes } = props;

    const { state, dispatch } = useContext(DataContext);

    const close = (value: boolean) => {
        updateBodyOverflow(!value);
        dispatch({
            type: Types.ShowAvailableQuest,
            value: value
        })
    }
    const QuestItem = (props: { item: any; type: string; }) => {
        const { item, type } = props;

        const isEvent = type == 'event';

        return (
            <div className="quest-item cursor flex-align" onClick={() => {
                if (isEvent) {
                    window.open(item.openUrl);
                } else {
                    window.open(`/story/${item.urlMask}#quiz`);
                    close(false);
                }
            }}>
                <div className="quest-icon-cover">
                    <img src={isEvent ? EventIcon : QuizIcon} alt="" />
                    <div className="text">{isEvent ? 'Badge' : 'Quiz'}</div>
                </div>
                <div className={`quest-right ${state.windowWidth > 375 && 'flex-align'}`}>
                    <div className="quest-title">{isEvent ? item.title : item.quizName}</div>
                    {isEvent && (
                        <div className="quest-date">{`ends ${moment(item.endTime).format("M/D/Y")}`}</div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={`alailable-quest-container popup-container ${state.showAvailableQuest && 'show'}`} onClick={() => {
            close(false)
        }}>
            <div className="quest-content" onClick={e => e.stopPropagation()}>
                <div className="title">Available Quest(s)</div>
                {quizes.length + events.length > 0 ? (
                    <div className="quest-list">
                        {events.map((event, index) => {
                            return <QuestItem key={index} item={event} type="event"></QuestItem>
                        })}
                        {quizes.map((quiz, index) => {
                            return <QuestItem key={index} item={quiz} type="quiz"></QuestItem>
                        })}
                    </div>
                ) : (
                    <div className="empty-content">
                        There's no available quests at this time.
                        <br />
                        <a
                            target="_block"
                            href="https://tourmaline-elderberry-f93.notion.site/NACP-Bonelist-aka-Whitelist-f021cb54342549ae95f752d393ab3211">
                            Check additional ways to get bonelisted
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
