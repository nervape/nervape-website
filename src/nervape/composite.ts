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
