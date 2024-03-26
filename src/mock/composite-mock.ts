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
        question: 'Where is Nervape going to be minted and what protocol will it use?',
        background: '#141D26',
        answer: 'Nervape will be minted on Bitcoin, using the RGB++ protocol.',
        sort: 10,
        open: false
    },
    {
        question: 'What is the estimated launch of Nervape?',
        background: '#282F41',
        answer: 'Expected launch is mid to late April of Phase 1 where users can mint blank ape avatars on Bitcoin. Phase 2 will be the release of the accessory assets which we anticipate for early May. The first blockchain the accessory assets will launch on will be Nervos’ CKB, with more chains to follow.',
        sort: 9,
        open: false
    },
    {
        question: 'What is the price per mint?',
        background: '#9196A5',
        answer: 'Due to the significant fluctuation in Bitcoin prices, the specific mint price will be announced just before the official sale starts. We ask for your understanding.',
        sort: 8,
        open: false
    },
    {
        question: 'How many Nervapes will be issued in total? How many bonelist (whitelist) spots are there?',
        background: '#506077',
        answer: 'There will be a total of 2777 Nervapes issued, with 1800 bonelist spots available. The remaining spots will be open for a Public Mint at a first come, first serve basis.',
        sort: 7,
        open: false
    },
    {
        question: 'How many bonelist spots can each wallet have?',
        background: '#506077',
        answer: 'Each wallet can have a maximum of one bonelist spot.',
        sort: 6,
        open: false
    },
    {
        question: 'What are the benefits of having a bonelist spot?',
        background: '#506077',
        answer: "1.Bonelist holders can mint in advance during the bonelist minting phase.<br/>2.Each spot guarantees a mint of the Nervape base asset.<br/>3.Discounted mint price.",
        sort: 5,
        open: false
    },
    {
        question: 'Is there still a chance to claim a bonelist spot?',
        background: '#506077',
        answer: 'Yes there is! Please follow our official X (Twitter) account and join our Discord to participate in community events for your chance to win a bonelist.',
        sort: 4,
        open: false
    },
    {
        question: 'How many Nervapes can each wallet mint at most?',
        background: '#506077',
        answer: 'During the Bonelist Mint phase, users with a bonelist spot can mint a maximum of one Nervape.During the Public Mint phase, each wallet can mint a maximum of 5 Nervapes.',
        sort: 3,
        open: false
    },
    {
        question: 'What wallets can be used to mint Nervape?',
        background: '#506077',
        answer: 'Currently, Joyid Wallet is confirmed to be be able to mint Nervapes. The team is also working on integrating Unisat Wallet and OKX Wallet, with more details to follow.',
        sort: 2,
        open: false
    },
    {
        question: 'For Bonelist spots claimed using a Metamask ethereum address, how can they be migrated to a Bitcoin address?',
        background: '#506077',
        answer: 'The team will provide users a simple online application that allows them to transfer their bonelist spot from an ethereum address to a bitcoin address.',
        sort: 1,
        open: false
    },
    {
        question: 'What is the relationship between the previous Nervape 3D NFT collections (character, item, scene, special) and the upcoming Nervape release?',
        background: '#506077',
        answer: 'There is no direct relationship. The 3D series is centered around the Nervape Saga, our multi-chapter narrative, with the 3D NFT collections directly related to the content of the story. The upcoming Nervape release are multi-chain composable digital objects built on Bitcoin. Nervape exists as its own digital objects collection; though some of the accessory assets are inspired by the Nervape Saga, many more assets take inspiration from our community and team’s input.',
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
        cover_image: "https://nervape-storage.s3.ap-southeast-1.amazonaws.com/album-main/production/55469455-e28b-4d8b-b2bc-f5bd9a7b5776.png",
        title: NervapeTitle,
        sub_title1: "“Base Assets” are issued on Bitcoin.",
        sub_title2: "“Accessory Assets” are issued on the Nervos Network and will also be available on other major blockchains.",
        desc: "Nervape combines a single \"Base Asset,\" that allows users to mint an on-chain blank ape avatar on Bitcoin, with thirteen multi-chain \"Accessory Assets\" that can be dynamically combined with the base asset. There are a total of 2,777 blank ape avatars, which are our base level on-chain assets on Bitcoin. They form the foundation of everything that follows."
    },
    {
        cover_image: "https://nervape-storage.s3.ap-southeast-1.amazonaws.com/album-main/production/45e9b1d7-d378-4b9c-8a99-fb4f2518a414.png",
        title: NervapeTitle,
        sub_title1: "“Base Assets” are issued on Bitcoin.",
        sub_title2: "“Accessory Assets” are issued on the Nervos Network and will also be available on other major blockchains.",
        desc: "“Accessory assets”, which require frequent interaction, will be issued on chains that are more cost-effective and have better performance. Therefore, the first wave of accessory-type assets as well as the first protocol to equip/un-equip such assets will be issued on the Nervos Network."
    }
];

const nervapeModules: NervapeModule[] = [
    {
        title: 'Composability',
        color: "#FAA5EB",
        desc: 'Nervape combines a "Base Asset" of blank ape avatars minted on Bitcoin with thirteen "Accessory Assets" minted across multiple chains for dynamic customization.'
    },
    {
        title: 'Dynamic Nature',
        color: "#CD9B64",
        desc: 'Nervape accessory assets can be assembled, disassembled, and updated, allowing the Nervape to evolve with the user’s preferences.'
    },
    {
        title: 'Value and Ownership',
        color: "#FAA5EB",
        desc: 'As an on-chain Bitcoin asset, the ape avatar offers complete ownership and immutability, permanently residing on the Bitcoin blockchain.'
    },
    {
        title: 'Human-First Approach',
        color: "#FAA5EB",
        desc: "Rejecting machine-generated images, Nervape has a human-first approach, with holders deciding their avatars' final appearance instead of a machine."
    },
    {
        title: 'Co-Creation Platform',
        color: "#CD9B64",
        desc: 'Nervape is a permissionless platform that enables all users to create and sell assets across chains, promoting a community-driven ecosystem.'
    },
    {
        title: 'Creator Economy',
        color: "#FAA5EB",
        desc: 'Nervape supports a creator economy where designers profit from and continually benefit from the circulation of their creations, fostering a growing collaborative ecosystem.'
    },
];

const roadMaps: RoadMap[] = [
    {
        cover_image: "https://nervape-storage.s3.ap-southeast-1.amazonaws.com/album-main/production/8ad8e498-da64-4cec-acb1-41963314ee5f.png",
        title: "Phase 1: Open Mint for \"Base\" Assets  (Late April, 2024)",
        desc: "We will launch 2777 on-chain, blank ape avatars for mint on Bitcoin. Owning these base level, blank Nervapes is a crucial first step for future participation."
    },
    {
        cover_image: "https://nervape-storage.s3.ap-southeast-1.amazonaws.com/album-main/production/d3e3c7e5-ea3c-464a-b818-c0d8bfbd2c29.png",
        title: "Phase 2: Open \"Accessory\" Assets",
        desc: "We will release \"Accessory Assets\" designed for the blank ape avatar. The first collection of these assets will be minted on the Nervos Network. We will also develop a protocol to allow users to assemble and disassemble their Nervape accessory assets on our platform."
    },
    {
        cover_image: "https://nervape-storage.s3.ap-southeast-1.amazonaws.com/album-main/production/fcf4f05b-bb66-4866-995c-15a3de4e43ab.png",
        title: "Phase 3: Open Co-Creation",
        desc: "Launch a co-creation platform for independent creators and the community to design and develop their own “accessory assets” on the Nervos Network and other chains. This allows users to claim, purchase, and trade these “accessory assets”. "
    }
];

export class PfpMocks {
    public static fnGetNacpData() {
        return { questionsData, introData, parthershipData, phaseData, bannerData, nervapeIntro, nervapeModules, roadMaps }
    }
}
