import { Question, Intro, Parthership, Phase } from "../nervape/composite";

import Landing01 from '../assets/nacp/Landing-01.png';
import Landing02 from '../assets/nacp/Landing-02.png';
import Landing03 from '../assets/nacp/Landing-03.png';

import AssetIconSkin from '../assets/nacp/assets/assets_icon-01.svg';
import AssetIconBg from '../assets/nacp/assets/assets_icon-02.svg';
import AssetIconSuit from '../assets/nacp/assets/assets_icon-03.svg';
import AssetIconUpper from '../assets/nacp/assets/assets_icon-04.svg';
import AssetIconLower from '../assets/nacp/assets/assets_icon-05.svg';
import AssetIconHeadwear from '../assets/nacp/assets/assets_icon-06.svg';
import AssetIconMask from '../assets/nacp/assets/assets_icon-07.svg';
import AssetIconEyewear from '../assets/nacp/assets/assets_icon-08.svg';
import AssetIconMouth from '../assets/nacp/assets/assets_icon-09.svg';
import AssetIconEars from '../assets/nacp/assets/assets_icon-10.svg';
import AssetIconTattoo from '../assets/nacp/assets/assets_icon-11.svg';
import AssetIconAccessory from '../assets/nacp/assets/assets_icon-12.svg';
import AssetIconHandheld from '../assets/nacp/assets/assets_icon-13.svg';
import AssetIconSpecial from '../assets/nacp/assets/assets_icon-14.svg';

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
                cover: AssetIconSuit,
                name: 'Suit'
            },
            {
                cover: AssetIconUpper,
                name: 'Upper Body'
            },
            {
                cover: AssetIconLower,
                name: 'Lower Body'
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
                cover: AssetIconHeadwear,
                name: 'Headwear'
            },
            {
                cover: AssetIconMask,
                name: 'Mask'
            },
            {
                cover: AssetIconEyewear,
                name: 'Eyewear'
            },
            {
                cover: AssetIconMouth,
                name: 'Mouth'
            },
            {
                cover: AssetIconEars,
                name: 'Ears'
            },
            {
                cover: AssetIconTattoo,
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
