import { Chapter, Story } from "../nervape/story";
import { NavTool } from "../route/navi-tool";



export class StoriesMock {
  // public static fnGetStories() {
  //   return [];
  // }

  // public static fnGetLatest() {
  //   return chapter01.stories[0];
  // }

  // public static fnGetStory(chapterName: string, storySerial: string) {
  //   console.log("fnGetStory", chapterName, storySerial);
  //   const datas = [chapter01, chapter02, chapter03];
  //   const cpData = datas.find((v) => {
  //     console.log(NavTool.fnStdNavStr(v.name), chapterName);
  //     return NavTool.fnStdNavStr(v.name) === chapterName;
  //   }) as Chapter;
  //   console.log(cpData);
  //   const story = cpData.stories.find((v) => {
  //     return NavTool.fnStdNavStr(v.serial) === storySerial;
  //   }) as Story;
  //   const index = cpData.stories.indexOf(story);
  //   return {
  //     story: story,
  //     previous: index > 0 ? cpData.stories[index - 1] : null,
  //     next:
  //       index < cpData.stories.length - 1 ? cpData.stories[index + 1] : null,
  //   };
  // }
}
