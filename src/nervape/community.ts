export enum Community_Type {
    Blog = 'Blog',
    Podcast = 'Podcast',
    CommunityEvent = 'Community Event',
    Artworks = 'Artworks',
}

export enum Community_Status {
    ComingSoon = 'Coming Soon',
    InProgress = 'In Progress',
    Over = 'Over',
}

export class Participant_Infomation {
    identity: string = "";
    avatar: string = "";
    name: string = "";
    twitter: string = "";
    link: string = "";
}

export class Community {
    type: Community_Type = Community_Type.Blog;
    title: string = "";
    sub_title: string = "";
    start_date: string = "";
    end_date?: string;
    tags: string = "";
    participant_infomation?: Participant_Infomation[];
    background?: string;
    banner?: string;
    cover_image: string = "";
    is_banner?: boolean;
    status: Community_Status = Community_Status.ComingSoon;
    sort: number = 0;
}
