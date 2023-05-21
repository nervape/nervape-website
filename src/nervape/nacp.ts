export class NACP_APE {
    coverImage: string = "";
    name: string = "";
    isRight: boolean = false;
}

export class NACP_CATEGORY {
    _id: string = '';
    name: string = '';
    icon: string = '';
}
export class NACP_SPECIAL_ASSET {
    _id?: string;
    access_type: string = '';
    category?: NACP_CATEGORY;
    isObtain: boolean = false;
    name: string = '';
    sort: number = 0;
    task_start_time: number = 0; // ms
    task_end_time: number = 0; // ms
    task_type: string = '';
    url?: string = '';
    thumb_url?: string = '';
}

export enum STORY_QUIZ_STATUS {
    NOT_START = 'not_start',
    IN_PROGRESS = 'in_progress',
    OVER = 'over'
}
