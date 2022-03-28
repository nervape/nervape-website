import React, { Component } from "react";
import "./footer.less";
import logo from "../../assets/logo/logo_nervape.svg";
import twitter from "../../assets/icons/twitter.svg";
import discord from "../../assets/icons/discord.svg";
import instagram from "../../assets/icons/instagram.svg";
import socialmedia from "../../assets/icons/socialmedia.svg";
import github from "../../assets/icons/github.svg";
import email from "../../assets/icons/email.svg";

export class Footer extends Component {
  public domRoot: HTMLElement | null = null;

  render() {
    return (
      <div
        className="footer"
        ref={(el) => {
          this.domRoot = el;
        }}
      >
        <div className="top-line">
          <img className="logo" src={logo} />
          <div className="icon-group">
            <a
              className="icon"
              target="_blank"
              href="https://twitter.com/Nervapes"
            >
              <img src={twitter} />
            </a>

            <a
              className="icon"
              target="_blank"
              href="https://discord.gg/EWWanFs4Hu"
            >
              <img src={discord} />
            </a>

            <a
              className="icon"
              target="_blank"
              href="https://www.instagram.com/nervapes/"
            >
              <img src={instagram} />
            </a>

            <a
              className="icon"
              target="_blank"
              href="https://medium.com/@Nervape"
            >
              <img src={socialmedia} />
            </a>

            <a
              className="icon"
              target="_blank"
              href="https://github.com/nervape"
            >
              <img src={github} />
            </a>

            <a
              className="icon"
              target="_blank"
              href="mailto:creative@nervape.com"
            >
              <img src={email} />
            </a>
          </div>
        </div>
        <div className="bottom-line">
          <a
            className="brand-assets"
            target="_blank"
            href="https://tourmaline-elderberry-f93.notion.site/Nervape-Brand-Assets-b7c52ca6f17c492e87cd18b5496da8f0"
          >
            Brand Assets
          </a>

          <a
            className="join-us"
            target="_blank"
            href="https://tourmaline-elderberry-f93.notion.site/Nervape-Job-Board-7b62e55294cf4010bf6fae57f3cb47d0"
          >
            Join Us
          </a>
        </div>
      </div>
    );
  }
}
