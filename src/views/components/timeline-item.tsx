import React, { Component } from "react";
import "./timeline-item.less";

export interface ITimelineItemProps {
  title?: string;
  content?: string;
  img?: string;
  direction?: string;
  color?: string;
}

export class TimelineItem extends Component<ITimelineItemProps> {
  render() {
    const { title, content, direction, color, img } = this.props;
    const defaultColor = "#ffffff";
    return (
      <div className="timeline-item">
        <div
          className={`v-trunk`}
          style={{ background: color ? color : defaultColor }}
        ></div>
        <div
          className={`h-trunk ${
            direction !== "right" ? "h-trunk-left " : "h-trunk-right"
          }`}
          style={{ background: color ? color : defaultColor }}
        ></div>
        <img
          className={`pattern ${
            direction !== "right" ? "pattern-left " : "pattern-right"
          }`}
          style={{ background: img ? "" : color ? color : defaultColor }}
          src={img}
        ></img>
        <div
          className={`text-panel  ${
            direction !== "right" ? "text-panel-left " : "text-panel-right"
          }`}
          style={{ color: color ? color : defaultColor }}
        >
          <div className="title">{title ? title : "Defaule Title"}</div>
          <div className="content">{content ? content : "Defaule content"}</div>
        </div>
      </div>
    );
  }
}
