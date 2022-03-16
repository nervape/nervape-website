import moment from "moment";
import { nervapeApi } from "../api/nervape-api";
import { Campaign } from "../nervape/campaign";
import { NFT } from "../nervape/nft";
import { Story, CHAPTER_TYPE } from "../nervape/story";
import { Chapter } from "../views/pages/stories-list";

export class WebMock {
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
        name: "Chapter II",
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
      chapters[chpIdx].stories.push(story);
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
    campaignParty.name = "Groovy Party";
    campaignParty.overview = `Breaking out of our daily routine, Nervapes have a DAY OFF today! We’re gonna have fun, goof around, and explore this new world to the fullest! Find hidden gems in this crystal ball. Piece together an era of dreams.`;
    campaignParty.ruleUrl =
      "https://medium.com/@Nervape/groovy-party-4ebe82b40a78";
    campaignParty.materialUrl = "https://www.nervape.com/claim/availability";
    campaignParty.claimUrl = "https://www.nervape.com/claim/login";
    campaignParty.startTime = moment("2022-01-21 00:00:00");
    campaignParty.reward = [...nfts.filter((v) => v.name === "Groovy Party")];

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

  public static async fnGetMockInfo() {
    const storyData = (await nervapeApi.fnGetStoryList()) as Story[];
    const nftData = (await nervapeApi.fnGetNftList()) as NFT[];

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
}
