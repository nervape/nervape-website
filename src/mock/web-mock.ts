import moment from "moment";
import { nervapeApi } from "../api/nervape-api";
import { Campaign } from "../nervape/campaign";
import { NFT } from "../nervape/nft";
import { Story, CHAPTER_TYPE } from "../nervape/story";
import { NavTool } from "../route/navi-tool";
import { Chapter } from "../views/pages/stories-list";

export class WebMock {
  public static typeData = ["Featured", "Character", "Scene", "Item"];
  public static chapterData: CHAPTER_TYPE[] = ["Chapter I", "Chapter II", "Chapter III"];
  public static fnGroupStory(stories: Story[]) {
    const chapters = [
      {
        name: "Chapter I",
        stories: [],
      },
      {
        name: "Chapter II",
        stories: [],
      },
      {
        name: "Chapter III",
        stories: [],
      },
    ] as Chapter[];
    const chapterName: CHAPTER_TYPE[] = [
      "Chapter I",
      "Chapter II",
      "Chapter III",
    ];
    for (let i = 0; i < stories.length; ++i) {
      const story = stories[i];
      const chpIdx = chapterName.indexOf(story.chapter);
      if (chpIdx !== -1) {
        chapters[chpIdx].stories.push(story);
      }
    }

    return chapters;
  }

  public static fnRelateStoryAndNft(stories: Story[], nfts: NFT[]) {
    for (let i = 0; i < stories.length; ++i) {
      const story = stories[i];
      story.nfts = [];
      story.nftId.map((v) => {
        const nft = nfts.find((n) => n.id === v);
        if (nft) {
          story.nfts.push(nft);
        }
      });

      story.previousStory = stories.find((v) => v.id === story.previousId);
      story.nextStory = stories.find((v) => v.id === story.nextId);
    }

    for (let i = 0; i < nfts.length; ++i) {
      const nft = nfts[i];
      nft.stories = [];
      nft.storyId.map((sId) => {
        const story = stories.find((n) => n.id === sId);
        if (story) {
          nft.stories.push(story);
        }
      });
    }

    return { stories, nfts };
  }

  public static fnSetCompainData(nfts: NFT[]) {
    const campaignParty = new Campaign();
    // campaignParty.name = "Groovy Party";
    // campaignParty.overview = `Breaking out of our daily routine, Nervapes have a DAY OFF today! We???re gonna have fun, goof around, and explore this new world to the fullest! Find hidden gems in this crystal ball. Piece together an era of dreams.`;
    // campaignParty.ruleUrl =
    //   "https://medium.com/@Nervape/groovy-party-4ebe82b40a78";
    // campaignParty.materialUrl = "https://www.nervape.com/claim/availability";
    // campaignParty.claimUrl = "https://www.nervape.com/claim/login";
    // campaignParty.startTime = moment("2022-05-21 00:00:00");
    // campaignParty.reward = [...nfts.filter((v) => v.name === "Groovy Party")];

    const materials = [
      "Nervape / GROOVY NFTer",
      "Nervape / GROOVY Rookie",
      "Nervape / GROOVY DeFier",
      "Nervape / GROOVY Researcher",
      "Nervape / GROOVY Whale",
      "Nervape / GROOVY Miner",
      "Nervape / GROOVY Developer",
    ];
    campaignParty.materials = [
      ...nfts.filter((v) => materials.indexOf(v.name) !== -1),
    ];

    const campaigns: Campaign[] = [campaignParty];

    return campaigns;
  }

  public static storyData: Story[] | null = null;
  public static nftData: NFT[] | null = null;

  public static async fnGetMockInfo() {
    if (WebMock.storyData === null) {
      WebMock.storyData = (await nervapeApi.fnGetStoryList()) as Story[];
    }
    let storyData = WebMock.storyData;
 
    if (WebMock.nftData === null) {
      WebMock.nftData = (await nervapeApi.fnGetSyncFromMibao()) as NFT[];
    }
    let nftData = WebMock.nftData;

    console.log(storyData);

    const { stories, nfts } = WebMock.fnRelateStoryAndNft(storyData, nftData);
    const chapters = WebMock.fnGroupStory(stories);
    const latestStory = stories.find((v) => v.latest);
    const latestNft = nfts.find((v) => v.latest);

    const campaigns = WebMock.fnSetCompainData(nfts);
    console.log(nfts);
    return {
      latestStory,
      stories,
      chapters,

      nfts,
      latestNft,

      campaigns,
    };
  }

  public static async fnGetNftMockInfo(latest: boolean, type?: string | null) {
    type = type || NavTool.fnQueryParam("type");
    if (type === null) {
      type = NavTool.fnStdNavStr(WebMock.typeData[0]);
    }
    const data = await nervapeApi.fnGetNfts(type, latest);
    return {
      nfts: data.normalNfts,
      latestNft: data.latestNfts.length > 0 ? data.latestNfts[0] : null
    }
  }

  public static async fnGetStoryMockInfo(latest: boolean, chapter?: string | null) {
    chapter = chapter || NavTool.fnQueryParam('chapter');
    if (chapter === null) {
      chapter = WebMock.chapterData[0]
    }
    let _chapter = chapter;
    WebMock.chapterData.forEach(chap => {
      if (NavTool.fnStdNavStr(chap) === NavTool.fnStdNavStr(chapter as string)) {
        _chapter = chap;
      }
    })
    const data = await nervapeApi.fnGetStories(_chapter, latest);
    return {
      stories: data.normalStories,
      latestStory: data.latestStories.length > 0 ? data.latestStories[0] : null,
      chapters: WebMock.chapterData
    }
  }

  public static async fnGetStoryDetailInfo(id: string) {
    const data = await nervapeApi.fnGetStoryDetail(id);
    return {
      story: data as Story
    }
  }

  public static async fnGetCampaigns() {
    const data = await nervapeApi.fnGetCampaigns();
    return {
      campaigns: data as Campaign[]
    }
  }
}
