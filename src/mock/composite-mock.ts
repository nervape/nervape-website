import { Question, Intro, Parthership, Phase, Banner, NervapeIntro, NervapeModule, RoadMap } from "../nervape/composite";

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

import Phase1Cover from '../assets/nacp/phases/minting_1.gif';
import Phase2Cover from '../assets/nacp/phases/minting_2.gif';
import Phase3Cover from '../assets/nacp/phases/minting_3.gif';

import Banner1Ape from '../assets/nacp/banner_1_ape.png';
import Banner1Bg from '../assets/nacp/banner_1_bg.png';
import Banner2Ape from '../assets/nacp/banner_2_ape.png';
import Banner2Bg from '../assets/nacp/banner_2_bg.png';
import Banner3Ape from '../assets/nacp/banner_3_ape.png';
import Banner3Bg from '../assets/nacp/banner_3_bg.png';

import NervapeTitle from '../assets/landing-page/nervape_title.svg';

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
        title: 'Refundable NFT',
        desc: "Want to return your purchase? Don't worry, you can get a full refund within our return timeframe! We’re sad to see you go. <br /><br />However, if you don’t want to miss out on this opportunity to express your creativity,  you can always purchase again while spots are available."
    },
    {
        cover: Landing02,
        title: 'Assemble Your Own PFP',
        desc: 'Want a PFP of your own? You get what you give! Express yourself and show your creativity by making your own Nervape PFP! '
    },
    {
        cover: Landing03,
        title: 'Total Supply 7777',
        desc: 'You like the number 7? We do too! A total of 7,777 NACPs will be issued: 7,700 will be released in our public mint (with a priority for bonelist members) with the other 77 NACPs reserved for our team and collaborators.'
    }
];

const parthershipData: Parthership[] = [
    {
        tag: 'COMMUNITY ACTIVITY',
        date: '06/12/2023',
        title: 'Saga Challenge Week 3 - Who Stole My Sweets?!',
        desc: "Win exclusive Saga only assets for Nervape Saga stories 1 thru 4 + story 15! New quizzes up every 24 hours, M-F, 6/12 10a to 6/17 11:59p.",
        link: "https://tourmaline-elderberry-f93.notion.site/Saga-Challenge-Week-3-Who-Stole-My-Sweets-31b26780fa7d4149b1698693b78cbd44?pvs=4",
    },
    {
        tag: 'COMMUNITY ACTIVITY',
        date: '06/05/2023',
        title: 'Saga Challenge Week 2 - The Princess and the Outsiders',
        desc: "For For this week's challenge we re-visit our ragtag team of outsiders, our favorite princess, the great dragon Yinhe, and much more! ",
        link: "https://tourmaline-elderberry-f93.notion.site/Saga-Challenge-Week-2-The-Princess-and-the-Outsiders-8671b668afea4eb8a453944dbe4f8d11?pvs=4",
    },
    {
        tag: 'COMMUNITY ACTIVITY',
        date: '05/29/2023',
        title: 'Saga Challenge Week 1 - We’re a Forever Family',
        desc: "For this week's challenge, there are 5 story quizzes awaiting your completion.",
        link: "https://tourmaline-elderberry-f93.notion.site/Saga-Challenge-Week-1-We-re-a-Forever-Family-b5e24e0260c741c49bf7e65acbbde720",
    },
    {
        tag: 'ANNOUNCEMENT',
        date: '05/28/2023',
        title: 'What is an NACP Bonelist?',
        desc: "What is an NACP Bonelist? It's a better whitelist!",
        link: "https://tourmaline-elderberry-f93.notion.site/NACP-Bonelist-aka-Whitelist-f021cb54342549ae95f752d393ab3211",
    }
];

const phaseData: Phase[] = [
    {
        title: 'STEP 1',
        cover: Phase1Cover,
        startDate: '10/03/2023',
        endDate: '20/03/2023',
        background: '#FFF5C1',
        assets: [
            // {
            //     cover: AssetIconSkin,
            //     name: 'Skin'
            // },
            {
                cover: AssetIconTattoo,
                name: 'Tattoo'
            },
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
        title: 'STEP 2',
        cover: Phase2Cover,
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
            }
        ]
    },
    {
        title: 'STEP 3',
        cover: Phase3Cover,
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
            },
            {
                cover: AssetIconBg,
                name: 'Background'
            }
        ]
    }
];

const bannerData: Banner[] = [
    {
        startBackground: "rgba(30, 122, 214, 1)",
        endBackground: "rgba(30, 122, 214, 0)",
        ape: Banner1Ape,
        qaBg: Banner1Bg
    },
    {
        startBackground: "rgba(0, 82, 67, 1)",
        endBackground: "rgba(0, 82, 67, 0)",
        ape: Banner2Ape,
        qaBg: Banner2Bg
    },
    {
        startBackground: "rgba(255, 201, 0, 1)",
        endBackground: "rgba(255, 201, 0, 0)",
        ape: Banner3Ape,
        qaBg: Banner3Bg
    }
]; 

const nervapeIntro: NervapeIntro[] = [
    {
        cover_image: "https://nervape-storage.s3.ap-southeast-1.amazonaws.com/album-main/production/63d4b427-e741-422b-b734-553817ded90d.png",
        title: NervapeTitle,
        sub_title1: "Rooted in Bitcoin",
        sub_title2: "Spreading across multichain",
        desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi."
    },
    {
        cover_image: "https://nervape-storage.s3.ap-southeast-1.amazonaws.com/album-main/production/33702679-bcf5-4ba6-83ac-7eafdbd30958.png",
        title: NervapeTitle,
        sub_title1: "Rooted in Bitcoin",
        sub_title2: "Spreading across multichain",
        desc: "1 Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi."
    }
];

const nervapeModules: NervapeModule[] = [
    {
        title: 'Title',
        color: "#BD4141",
        desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. "
    },
    {
        title: 'Title',
        color: "#507CAF",
        desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. "
    },
    {
        title: 'Title',
        color: "#1D7C7C",
        desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. "
    },
    {
        title: 'Title',
        color: "#408F51",
        desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. "
    },
    {
        title: 'Title',
        color: "#B535A9",
        desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. "
    },
    {
        title: 'Title',
        color: "#A7A954",
        desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. "
    },
];

const roadMaps: RoadMap[] = [
    {
        cover_image: "https://nervape-storage.s3.ap-southeast-1.amazonaws.com/album-main/production/7ef6663c-5abf-4095-9f3c-bd385e44b3dc.png",
        title: "1Create, Collaborate, and Grow Together",
        desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi."
    },
    {
        cover_image: "https://nervape-storage.s3.ap-southeast-1.amazonaws.com/album-main/production/7ef6663c-5abf-4095-9f3c-bd385e44b3dc.png",
        title: "2Create, Collaborate, and Grow Together",
        desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi."
    },
    {
        cover_image: "https://nervape-storage.s3.ap-southeast-1.amazonaws.com/album-main/production/7ef6663c-5abf-4095-9f3c-bd385e44b3dc.png",
        title: "3Create, Collaborate, and Grow Together",
        desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi."
    }
];

export class PfpMocks {
    public static fnGetNacpData() {
        return { questionsData, introData, parthershipData, phaseData, bannerData, nervapeIntro, nervapeModules, roadMaps }
    }
}
