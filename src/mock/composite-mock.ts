import { Question, Intro, Parthership, Phase } from "../nervape/composite";

import FreeMint from '../assets/nacp/free_mint.png';

const questionsData: Question[] = [
    {
        answer: 'Curabitur euismod, ex quis tincidunt tincidunt, nulla libero hendrerit nisi, ac mollis neque diam luctus dui. Duis eu ipsum posuere, auctor sem sed, laoreet massa. Sed volutpat odio quis leo varius tincidunt. ',
        background: '#141D26',
        question: 'Nullam vitae sapien sit amet massa semper congue sit amet non tortor. Nulla mollis, ipsum sit amet mollis congue, turpis velit porttitor?',
        sort: 3,
        open: false
    },
    {
        answer: 'Curabitur euismod, ex quis tincidunt tincidunt, nulla libero hendrerit nisi, ac mollis neque diam luctus dui. Duis eu ipsum posuere, auctor sem sed, laoreet massa. Sed volutpat odio quis leo varius tincidunt. ',
        background: '#282F41',
        question: 'Nullam vitae sapien sit amet massa semper congue sit amet non tortor. Nulla mollis, ipsum sit amet mollis congue, turpis velit porttitor?',
        sort: 2,
        open: false
    },
    {
        answer: 'Curabitur euismod, ex quis tincidunt tincidunt, nulla libero hendrerit nisi, ac mollis neque diam luctus dui. Duis eu ipsum posuere, auctor sem sed, laoreet massa. Sed volutpat odio quis leo varius tincidunt. ',
        background: '#9196A5',
        question: 'Nullam vitae sapien sit amet massa semper congue sit amet non tortor. Nulla mollis, ipsum sit amet mollis congue, turpis velit porttitor?',
        sort: 1,
        open: false
    },
    {
        answer: 'Curabitur euismod, ex quis tincidunt tincidunt, nulla libero hendrerit nisi, ac mollis neque diam luctus dui. Duis eu ipsum posuere, auctor sem sed, laoreet massa. Sed volutpat odio quis leo varius tincidunt. ',
        background: '#506077',
        question: 'Nullam vitae sapien sit amet massa semper congue sit amet non tortor. Nulla mollis, ipsum sit amet mollis congue, turpis velit porttitor?',
        sort: 0,
        open: false
    }
];

const introData: Intro[] = [
    {
        cover: FreeMint,
        title: 'Free Mint',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
        cover: FreeMint,
        title: 'Assemble Your Own PFP',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
        cover: FreeMint,
        title: 'Assemble Your Own PFP',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    }
];

const parthershipData: Parthership[] = [
    {
        tag: 'NEW PARTNERSHIP',
        date: '02/27/2023',
        title: 'Latest Update Title',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
        tag: 'NEW PARTNERSHIP',
        date: '02/27/2023',
        title: 'Latest Update Title',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
        tag: 'NEW PARTNERSHIP',
        date: '02/27/2023',
        title: 'Latest Update Title',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    }
];

const phaseData: Phase[] = [
    {
        title: 'PHASE 1',
        cover: '',
        startDate: '10/03/2023',
        endDate: '20/03/2023',
        background: '#FFF5C1',
        assets: [
            {
                cover: '',
                name: 'Skin'
            },
            {
                cover: '',
                name: 'Background'
            }
        ]
    },
    {
        title: 'PHASE 2',
        cover: '',
        startDate: '10/03/2023',
        endDate: '20/03/2023',
        background: '#FEA063',
        assets: [
            {
                cover: '',
                name: 'Lower Body'
            },
            {
                cover: '',
                name: 'Upper Body'
            },
            {
                cover: '',
                name: 'Suit'
            }
        ]
    },
    {
        title: 'PHASE 3',
        cover: '',
        startDate: '10/03/2023',
        endDate: '20/03/2023',
        background: '#A8E9C2',
        assets: [
            {
                cover: '',
                name: 'Ears'
            },
            {
                cover: '',
                name: 'Mouth'
            },
            {
                cover: '',
                name: 'Eyewear'
            },
            {
                cover: '',
                name: 'Mask'
            },
            {
                cover: '',
                name: 'Headwear'
            },
            {
                cover: '',
                name: 'Tattoo'
            }
        ]
    },
    {
        title: 'PHASE 4',
        cover: '',
        startDate: '10/03/2023',
        endDate: '20/03/2023',
        background: '#C5BAF7',
        assets: [
            {
                cover: '',
                name: 'Accessory'
            },
            {
                cover: '',
                name: 'Handheld'
            },
            {
                cover: '',
                name: 'Special'
            }
        ]
    }
];

export class PfpMocks {
    public static fnGetNacpData() {
        return { questionsData, introData, parthershipData, phaseData }
    }
}
