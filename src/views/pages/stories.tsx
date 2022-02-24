import React, { Component } from "react";
import { StoriesIntro } from "./stories-intro";
import { StoriesList } from "./stories-list";
import testImg from "../../assets/noval/intro-bg.png";
import { StoriesReader } from "./stories-reader";
import { StoriesMock } from "../../mock/stories-mock";
import { NavTool } from "../../route/navi-tool";
import { useParams } from "react-router-dom";

export class StoriesPage extends Component {
  render() {
    const chapter = NavTool.fnQueryParam("chapter");
    const serial = NavTool.fnQueryParam("serial");
    const latest = StoriesMock.fnGetLatest();

    console.log(`chapter;${chapter}, story:${serial}`);

    let enableChapters = false;
    let enableStory = false;
    if ((chapter === null && serial === null) || chapter !== null) {
      enableChapters = true;
    }
    if (serial !== null) {
      enableChapters = false;
      enableStory = true;
    }
    return (
      <div className="stories-page">
        {enableChapters === true ? (
          <>
            <StoriesIntro latest={latest}></StoriesIntro>
            <StoriesList></StoriesList>
          </>
        ) : (
          <></>
        )}
        {enableStory === true ? (
          <StoriesReader
          ></StoriesReader>
        ) : (
          <></>
        )}
      </div>
    );
  }
}
