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
          <div className="brand-assets">Brand Assets</div>
          <div className="join-us">Join Us</div>
        </div>
      </div>
    );
  }
}
