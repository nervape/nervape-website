import React, { useContext, useEffect, useState } from "react";
import './index.less';
import { nervapeApi } from "../../../api/nervape-api";
import { Event, Vote } from "../../../nervape/campaign";
import { queryGetVotes } from "../../../utils/snapshot";
import { DataContext } from "../../../utils/utils";
import dayjs from "dayjs";

export default function WalletEvent(props: any) {
    const { setLoading } = props;

    const { state, dispatch } = useContext(DataContext);
    const [events, setEvents] = useState<Event[]>([]);

    const EventItem = (props: { event: Event; }) => {
        const { event } = props;

        return (
            <div className="event-item-c">
                <div className="event-item transition flex-align">
                    <div className="event-tab title">{event.title}</div>
                    <div className="event-tab timeframe">{dayjs(event.startTime).format('MM/DD/YYYY') + '-' + dayjs(event.endTime).format('MM/DD/YYYY')}</div>
                    <div className={`event-tab status ${!event.show && 'active'}`}>
                        <img src="" className="icon" alt="StatusIcon" />
                    </div>
                </div>
            </div>
        );
    }

    async function fnGetCampaignEvents() {
        setLoading(true);
        const events: Event[] = await nervapeApi.fnGetActiveEvents('all');
        await Promise.all(
            events.map(async event => {
                const votes: Vote[] = await queryGetVotes(event.proposalId);
                const count = votes.filter(vote => vote.voter == state.currentAddress).length;
                event.show = count == 0;
            })
        )
        setEvents(events);
        setLoading(false);
    }

    useEffect(() => {
        fnGetCampaignEvents();
    }, [state.currentAddress]);

    return (
        <div className="wallet-event-container">
            <div className="wallet-event-header flex-align">
                <div className="event-title">EVENT</div>
            </div>

            <div className="wallet-event-content">
                <div className="event-tabs flex-align">
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
