import React, { useContext, useEffect, useState } from "react";
import './index.less';
import { nervapeApi } from "../../../api/nervape-api";
import { Event, EventType, Vote } from "../../../nervape/campaign";
import { queryGetVotes } from "../../../utils/snapshot";
import { DataContext } from "../../../utils/utils";

import InProgressIcon from "../../../assets/wallet/tx/not_start.svg";
import NotStartIcon from "../../../assets/wallet/tx/in_progress.svg";
import EndIcon from "../../../assets/wallet/tx/end.svg";
import SuccessIcon from "../../../assets/wallet/tx/success.svg";
import FailIcon from "../../../assets/wallet/tx/fail.svg";
import NotComplete from "../../../assets/wallet/tx/not_complete.svg";
import dayjs from "dayjs";
import useDebounce from "../../../hooks/useDebounce";

export default function WalletEvent(props: any) {
    const { isFold, setLoading } = props;

    const { state, dispatch } = useContext(DataContext);
    const [events, setEvents] = useState<Event[]>([]);

    const initDebounce = useDebounce(async () => {
        fnGetCampaignEvents();
    }, 500);

    const EventItem = (props: { event: Event; }) => {
        const { event } = props;
        const now = new Date().getTime();
        const icons = [NotStartIcon, InProgressIcon, EndIcon];

        const eventStatus = () => {
            if (now < event.startTime) {
                return 0;
            } else if (now >= event.startTime && now <= event.endTime) {
                return 1;
            } else {
                return 2;
            }
        }

        const userStatus = () => {
            if (event.show) {
                return eventStatus() == 2 ? FailIcon : NotComplete;
            } else {
                return SuccessIcon;
            }
        }

        return (
            <div className="event-item-c">
                <div className="event-item transition flex-align cursor" onClick={() => {
                    window.open(event.openUrl);
                }}>
                    <div className="event-tab title">{event.title}</div>
                    <div className="event-tab timeframe">{dayjs(event.startTime).format('MM/DD/YYYY') + ' - ' + dayjs(event.endTime).format('MM/DD/YYYY')}</div>
                    <div className={`event-tab status flex-center ${!event.show && 'active'}`}>
                        <img src={icons[eventStatus()]} className="icon" alt="StatusIcon" />
                        <img src={userStatus()} className="icon" alt="StatusIcon" />
                    </div>
                </div>
            </div>
        );
    }

    async function fnGetCampaignEvents() {
        setLoading(true);
        const events: Event[] = await nervapeApi.fnGetActiveEvents(state.currentAddress, 'all');
        await Promise.all(
            events.map(async event => {
                if (event.type == EventType.Vote) {
                    const votes: Vote[] = await queryGetVotes(event.proposalId);
                    const count = votes.filter(vote => vote.voter == state.currentAddress).length;
                    event.show = count == 0;
                }

                return event;
            })
        )
        setEvents(events);
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }

    useEffect(() => {
        initDebounce();
    }, [state.currentAddress]);

    return (
        <div className={`wallet-event-container ${isFold && 'fold'}`}>
            <div className="wallet-event-header transition position-sticky flex-align">
                <div className="event-title">EVENT</div>
            </div>

            <div className="wallet-event-content">
                <div className="event-tabs transition flex-align">
                    <div className="event-tab title">Title</div>
                    <div className="event-tab timeframe">Timeframe</div>
                    <div className="event-tab status">Status</div>
                </div>

                <div className="event-histories">
                    {events.map((event, index) => (
                        <EventItem event={event} key={index}></EventItem>
                    ))}
                </div>
            </div>
        </div>
    );
}
