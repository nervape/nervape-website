import React, { useContext } from "react";
import './available-quest.less';
import { Event } from "../../../nervape/campaign";
import { StoryCollectable } from "../../../nervape/story";

import EventIcon from '../../../assets/campaign/event.svg';
import QuizIcon from '../../../assets/campaign/quiz.svg';

import moment from "moment";
import { DataContext } from "../../../utils/utils";
import { NavTool } from "../../../route/navi-tool";

export default function AvailableQuest(props: { show: boolean; close: any; events: Event[]; quizes: StoryCollectable[]; }) {
    const { show, close, events, quizes } = props;

    const { state, dispatch } = useContext(DataContext);

    const QuestItem = (props: { item: any; type: string; }) => {
        const { item, type } = props;

        const isEvent = type == 'event';
        
        return (
            <div className="quest-item cursor flex-align" onClick={() => {
                if (isEvent) {
                    window.open(item.openUrl);
                } else {
                    NavTool.fnJumpToPage(`/story/${item.urlMask}#quiz`);
                    close();
                }
            }}>
                <div className="quest-icon-cover">
                    <img src={isEvent ? EventIcon : QuizIcon} alt="" />
                    <div className="text">{isEvent ? 'Badge' : 'Quiz'}</div>
                </div>
                <div className={`quest-right ${state.windowWidth > 375 && 'flex-align'}`}>
                    <div className="quest-title">{isEvent ? item.title : item.serial + ' Quiz'}</div>
                    {isEvent && (
                        <div className="quest-date">{`ends ${moment(item.endTime).format("M/D/Y")}`}</div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={`alailable-quest-container ${show && 'show'}`} onClick={close}>
            <div className="quest-content" onClick={e => e.stopPropagation()}>
                <div className="title">Available Quest(s)</div>
                <div className="quest-list">
                    {events.map((event, index) => {
                        return <QuestItem key={index} item={event} type="event"></QuestItem>
                    })}
                    {quizes.map((quiz, index) => {
                        return <QuestItem key={index} item={quiz} type="quiz"></QuestItem>
                    })}
                </div>
            </div>
        </div>
    );
}
