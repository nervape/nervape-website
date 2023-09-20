import { getAllHoldPoaps, queryOatPoaps } from './api';

export type PoapItem = {
    name: string;
    type: BADGE_TYPE;
    campaignId: string;
    eventId: number;
    inactivated_cover_url: string;
    cover_image_url: string;
    isHold: boolean;
};

export enum BADGE_TYPE {
    POAP = 'poap',
    OAT = 'oat'
}

export class PoapWrapper {
    public address: string = "";

    public async poaps(poaps: PoapItem[]) {
        const _poaps = await getAllHoldPoaps(this.address);
        await Promise.all(
            poaps.map(async poap => {
                if (poap.type === BADGE_TYPE.OAT) {
                    const _oatPoaps = await queryOatPoaps(this.address, poap.campaignId);
                    // eslint-disable-next-line no-param-reassign
                    poap.isHold = _oatPoaps.length > 0;
                } else {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const filters = _poaps?.data?.filter((_p: any) => {
                        const poapEventIds = poap.eventId.toString().split(',');
                        return poapEventIds.includes(_p.event.id.toString());
                    });
                    // eslint-disable-next-line no-param-reassign
                    poap.isHold = filters?.length > 0;
                }
                return poap;
            })
        );
        return poaps;
    }
}
