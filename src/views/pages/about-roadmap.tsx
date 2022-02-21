import React, { Component } from "react";
import { TimelineItem } from "../components/timeline-item";
import "./about-roudmap.less";

const phase1 = [
  {
    direction: "left",
    title: "Prequel",
    content:
      "The story will be told in 3 chapters, each set in a different world. In each chapter, we’ll follow the adventures of various Nervapes, each of them with unique personalities, jobs, and abilities. ",
  },
  {
    direction: "right",
    title: "Character NFTs",
    content:
      "Character NFTs are Nervapes that appear in the story. Each Nervape has unique tools that specifically correspond to their job.",
  },
  {
    direction: "left",
    title: "Scene NFTs",
    content: "Scene NFTs are dioramas that portray key scenes in the story.",
  },
  {
    direction: "right",
    title: "Item NFTs",
    content: "Item NFTs are items that appear in or are related to the story. ",
  },
];
const phase2 = [
  {
    direction: "left",
    title: "Customizable Personal Identity",
    content:
      "Your Nervape is your digital identity in the Third Continent. We will provide an avatar platform where everyone in the community can customize their Nervapes and turn them into 3D avatars. ",
  },
  {
    direction: "right",
    title: "Personal Spaces",
    content:
      "This will be your personal virtual apartment, a gallery to display your NFT collection, and a space for other users to visit. ",
  },
  {
    direction: "left",
    title: "More items for customization",
    content:
      "We will continue to create more items that you can use to customize your Nervapes. In this phase, we also encourage our community to create their version of items for the Nervape universe. ",
  },
];

export class AboutRoadmap extends Component {
  render() {
    const color1 = "#d6e7f6";
    const color2 = "#86C0F7";

    return (
      <div className="about-roudmap">
        <div className="headline">ROADMAP</div>
        <div className="phase1" style={{ color: color1 }}>
          <div className="pahse-title">
            <div className="phase">Phase 1</div>
            <div className="time">2022 Q1, Q2</div>
          </div>

          <div className="timeline">
            {phase1.map((v, i) => (
              <TimelineItem
                title={v.title}
                content={v.content}
                direction={v.direction}
                key={i}
                color={color1}
              ></TimelineItem>
            ))}
          </div>
        </div>
        <div className="phase2" style={{ color: color2 }}>
          <div className="pahse-title">
            <div className="phase">Phase 2</div>
            <div className="time">2022 Q3, Q4</div>
          </div>

          {phase2.map((v, i) => (
            <TimelineItem
              title={v.title}
              content={v.content}
              direction={v.direction}
              key={i}
              color={color2}
            ></TimelineItem>
          ))}
        </div>
      </div>
    );
  }
}
