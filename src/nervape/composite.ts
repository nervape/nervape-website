export class Question {
    question: string = "";
    answer: string = "";
    sort: number = 0;
    background: string = "";
    open: boolean = false;
}

export class Intro {
    cover: string = '';
    title: string = '';
    desc: string = '';
}

export class Parthership {
    tag: string = '';
    date: string = '';
    title: string = '';
    desc: string = '';
    link: string = '';
}

export class Phase {
    cover: string = '';
    title: string = '';
    startDate: string = '';
    endDate: string = '';
    background: string = '';
    assets: PhaseAsset[] = [];
}

export class PhaseAsset {
    cover: string = '';
    name: string = '';
}

export class Banner {
    startBackground: string = "";
    endBackground: string = "";
    ape: string = "";
    qaBg: string = "";
}

export class SneakPeek {
    _id: string = '';
    url: string = '';
    sort: number = 0;
}

export class MintInfo {
    total: number = 2777;
    minted: number = 0;
}

export class NervapeIntro {
    cover_image: string = "";
    title: string = "";
    sub_title1: string = "";
    sub_title2: string = "";
    desc: string = "";
}
