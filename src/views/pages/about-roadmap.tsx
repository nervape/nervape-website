import React, { Component } from "react";
import { TimelineItem } from "../components/timeline-item";
import "./about-roadmap.less";
import img01 from "../../assets/about/01prequel.svg";
import img02 from "../../assets/about/02character.svg";
import img03 from "../../assets/about/03scene.svg";
import img04 from "../../assets/about/04item.svg";
import img05 from "../../assets/about/05customizable.svg";
import img06 from "../../assets/about/06spaces.svg";

const phase1 = [
  {
    direction: "left",
    title: "Prequel",
    content: `The story will unfold in 3 chapters that follow the Nervapes’ adventure to find the Third Continent. As they discover more about the Third Continent and meet friends and foes, we will learn more about their personalities and unique abilities.`,
    image: img01,
  },
  {
    direction: "right",
    title: "Character NFTs",
    content: `Character NFTs are Nervapes that appear in the story. Each Nervape have unique tools that specifically correspond to their job. New characters will be released as they are introduced in the story. `,
    image: img02,
  },
  {
    direction: "left",
    title: "Scene NFTs",
    content: `Scene NFTs are dioramas that portray key scenes in the story.`,
    image: img03,
  },
  {
    direction: "right",
    title: "Item NFTs",
    content: `Item NFTs are items that appear in or are related to the story. `,
    image: img04,
  },
];
const phase2 = [
  {
    direction: "left",
    title: "Customizable Personal Identity",
    content: `Your Nervape is your digital identity in the Third Continent. You can use your own web3.0 assets to give a Nervape new life. You are not only the holder, but also the creator. `,
    image: img05,
  },
  {
    direction: "right",
    title: "Customizable Spaces",
    content: `This will be your personal virtual apartment, a gallery to display your web3.0 assets, and a space for other users to visit. `,
    image: img06,
  },
];

export class AboutRoadmap extends Component {
  render() {
    const color1 = "#d6e7f6";
    const color2 = "#86C0F7";

    return (
      <div className="about-roudmap">
        <div className="about-roudmap-content">
          <div className="headline1" style={{ color: color1 }}>
            Limited 3D NFT Collections
          </div>
          <div className="phase1" style={{ color: color1 }}>
            {/* <div className="pahse-title">
            <div className="phase">Phase 1</div>
            <div className="time">2022 Q1, Q2</div>
          </div> */}

            <div className="timeline">
              {phase1.map((v, i) => (
                <TimelineItem
                  title={v.title}
                  content={v.content}
                  direction={v.direction}
                  img={v.image}
                  key={i}
                  color={color1}
                ></TimelineItem>
              ))}
            </div>
          </div>
          <div className="headline2" style={{ color: color2 }}>
            Customizable Avatar platform
          </div>
          <div className="phase2" style={{ color: color2 }}>
            {/* <div className="pahse-title">
            <div className="phase">Phase 2</div>
            <div className="time">2022 Q3, Q4</div>
          </div> */}

            {phase2.map((v, i) => (
              <TimelineItem
                title={v.title}
                content={v.content}
                direction={v.direction}
                img={v.image}
                key={i}
                color={color2}
              ></TimelineItem>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
