import { Question, Intro, Parthership, Phase } from "../nervape/composite";

import Landing01 from '../assets/nacp/Landing-01.png';
import Landing02 from '../assets/nacp/Landing-02.png';
import Landing03 from '../assets/nacp/Landing-03.png';

import AssetIconSkin from '../assets/nacp/assets/assets_icon-01.png';
import AssetIconBg from '../assets/nacp/assets/assets_icon-02.png';
import AssetIconSuit from '../assets/nacp/assets/assets_icon-03.png';
import AssetIconUpper from '../assets/nacp/assets/assets_icon-04.png';
import AssetIconLower from '../assets/nacp/assets/assets_icon-05.png';
import AssetIconHeadwear from '../assets/nacp/assets/assets_icon-06.png';
import AssetIconMask from '../assets/nacp/assets/assets_icon-07.png';
import AssetIconEyewear from '../assets/nacp/assets/assets_icon-08.png';
import AssetIconMouth from '../assets/nacp/assets/assets_icon-09.png';
import AssetIconEars from '../assets/nacp/assets/assets_icon-10.png';
import AssetIconTatto from '../assets/nacp/assets/assets_icon-11.png';
import AssetIconAccessory from '../assets/nacp/assets/assets_icon-12.png';
import AssetIconHandheld from '../assets/nacp/assets/assets_icon-13.png';
import AssetIconSpecial from '../assets/nacp/assets/assets_icon-14.png';

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
        cover: Landing01,
        title: 'Free Mint',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
        cover: Landing02,
        title: 'Assemble Your Own PFP',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
        cover: Landing03,
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
                cover: AssetIconSkin,
                name: 'Skin'
            },
            {
                cover: AssetIconBg,
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
                cover: AssetIconLower,
                name: 'Lower Body'
            },
            {
                cover: AssetIconUpper,
                name: 'Upper Body'
            },
            {
                cover: AssetIconSuit,
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
                cover: AssetIconEars,
                name: 'Ears'
            },
            {
                cover: AssetIconMouth,
                name: 'Mouth'
            },
            {
                cover: AssetIconEyewear,
                name: 'Eyewear'
            },
            {
                cover: AssetIconMask,
                name: 'Mask'
            },
            {
                cover: AssetIconHeadwear,
                name: 'Headwear'
            },
            {
                cover: AssetIconTatto,
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
                cover: AssetIconAccessory,
                name: 'Accessory'
            },
            {
                cover: AssetIconHandheld,
                name: 'Handheld'
            },
            {
                cover: AssetIconSpecial,
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
