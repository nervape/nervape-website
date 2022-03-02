import { Chapter, Story } from "../nervape/story";
import imgStroy001 from "../assets/noval/intro-bg.png";
import { NavTool } from "../route/navi-tool";
import { NFTsMock, NftStory001 } from "./nft-mock";
import stroyBanner from "../assets/noval/story-banner.png";

export const story001 = new Story();
story001.chapter = "Chapter I";
story001.name = "An Unexpected Encounter";
story001.serial = "Story 001";
story001.overview = `Lost in a mysterious world, Dev the Developer encounters a giant monolith ahead. What he sees next went beyond his imagination.`;
story001.nft = [NftStory001];
story001.imageUrl = imgStroy001;
story001.storyBannerUrl = stroyBanner;
story001.content = `Dev the pink ape coughed and sputtered as he pushed through the swirling sandstorm. 

There was nowhere to go but forward. His laptop lost many miles ago, he now had only himself to rely on. 

He was not sure if this was the right way, but knew in his heart that he was getting closer to what he is seeking. 

The storm dissipated. 

Dev dusted himself off and took a deep sand free breath. It was night time now and a hush fell upon the dark, empty lands. 

He made a window with his fingers and peered through, looking up at the sky.

“This is unreal...”

What looked to be a brilliant starry cosmos of swirling comets and bright stars sprawled out endlessly above. He felt the sensation of cool rock at his feet and looked out towards a rocky and barren terrain of dry cliffs and valleys.

Several feet ahead, a towering monolith stood on its own. Smooth and black, the monolith gleamed as if to beckon Dev to come closer.

“Come to the Third Continent. You’ll find what you are looking for.”

An unknown voice filled the earth and Dev’s mind.

Who was that? What’s the Third Continent? He stepped forward in the direction of the monolith.

He saw himself reflected against its mirror-like surface. A pink ape of average height and looks, a bit downtrodden from the routine of life and work, a slightly pudgy underbelly from an affinity for soda.

The mirror-like surface began to wobble. His reflection wavered and distorted, now forming a new ghostlike image of Dev. The images were visible but wispy, as if made of clouds.

The same ape now sat in a spacious, stylish room in a high rise condo, playing the latest game in front of a wall to wall widescreen TV. Comic books lined his bookshelves and his high tech fridge announced with a happy jingle that it was fully stocked with Gorilla Dew. Reflection Dev turned towards Dev, cracked open an ice cold Gorilla Dew and raised the bottle towards him with a smile. He took a long swig, reclining in his gaming chair.

What a life! Dev walked faster towards the monolith, watching himself live a life of pure indulgence.

As Dev approached closer, the images began to warp once again. The Gorilla Dew soda in the monolith swirled around and faded away to a green blur.

“No…” Dev’s shoulders dropped in dismay. The dream life had dissolved.

Slowly, a new image rose up, this time much more vibrant and clear. Dev let out a small gasp at the sight.

A pink ape sat at the computer, fervently typing with a look of quiet determination in his face.

As the pink ape entered more code, something was happening outside of the monolith. 

A swirl of neon colored signals and nodes began to spin around above Dev’s head across the sky. Stars boogied and the galaxy twirled in an electrifying dance. The cosmos buzzed, bounced, and grew as more code was entered into the computer.

Dev was entranced by this magical occurrence in the sky, when he heard the sweet chirping of birds. He looked down to see the once rocky planet now transformed into a lush green world of flora and fauna.

With rapid strokes on his keyboard, the pink ape in the monolith created a new world. He looked identical to Dev, but his eyes had a new light to them, a certain fire. He lived with purpose and a dream. He was a Developer, like Dev, but his actions created synergy.

The ape’s fingers typed even faster and with each line the swirling cosmos grew more vibrant and alive. A glowing white light poured out from the pink ape as he worked, the shining beam now streaming outside of the monolith and illuminating Dev.

Like a moth to a flame, Dev took more steps forward, the light triggering an outpour of emotions. Wonder, excitement, a bit of fear, hope, curiosity, and another feeling he had no name for.

What was this new self doing, and how could he get there?

He took more steps towards the monolith, now almost completely engulfed by the light.

Dev reached out towards the monolith.

An earth-rumbling roar. As fast as Dev could look up with mouth agape, he witnessed an unimaginable sight. An iridescent silver dragon with piercing eyes and smoke pouring out of its flaring nostrils. It took a swan dive from hundreds of feet above and was now headed…

Straight. Towards. Dev.`;

// export const story002 = new Story();
// story002.chapter = "Chapter I";
// story002.serial = "Story 002";
// story002.name = "The Escape";
// story002.overview = `An explosion prompts Dev to make a life changing decision. Will he stay or will he leave?`;
// story002.nft = [Nftstory002];
// story002.imageUrl = imgStroy001;
// story002.content = ``

const chapter01 = new Chapter();
chapter01.name = "Chapter I";
chapter01.stories = [story001];

const chapter02 = new Chapter();
chapter02.name = "Chapter II";
chapter02.stories = [];

const chapter03 = new Chapter();
chapter03.name = "Chapter III";
chapter03.stories = [];

(() => {
  const nfts = NFTsMock.fnGetNftList();
  nfts.map((v) => {
    v.story = story001;
  });
})();

export class StoriesMock {
  public static fnGetStories() {
    return [chapter01, chapter02, chapter03];
  }

  public static fnGetLatest() {
    return chapter01.stories[0];
  }

  public static fnGetStory(chapterName: string, storySerial: string) {
    console.log("fnGetStory", chapterName, storySerial);
    const datas = [chapter01, chapter02, chapter03];
    const cpData = datas.find((v) => {
      console.log(NavTool.fnStdNavStr(v.name), chapterName);
      return NavTool.fnStdNavStr(v.name) === chapterName;
    }) as Chapter;
    console.log(cpData);
    const story = cpData.stories.find((v) => {
      return NavTool.fnStdNavStr(v.serial) === storySerial;
    }) as Story;
    const index = cpData.stories.indexOf(story);
    return {
      story: story,
      previous: index > 0 ? cpData.stories[index - 1] : null,
      next:
        index < cpData.stories.length - 1 ? cpData.stories[index + 1] : null,
    };
  }
}
