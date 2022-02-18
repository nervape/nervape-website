import React, { Component } from "react";
import "./footer.less";
import logo from "../../assets/logo/logo_nervape.svg";
import twitter from "../../assets/icons/twitter.svg";
import discord from "../../assets/icons/discord.svg";
import instagram from "../../assets/icons/instagram.svg";
import github from "../../assets/icons/github.svg";
import email from "../../assets/icons/email.svg";

export class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <img className="logo" src={logo} />
        <div className="icon-group">
          <div className="icon">
            <img src={twitter} />
          </div>
          <div className="icon">
            <img src={discord} />
          </div>
          <div className="icon">
            <img src={instagram} />
          </div>
          <div className="icon">
            <img src={github} />
          </div>
          <div className="icon">
            <img src={email} />
          </div>
        </div>
      </div>
    );
  }
}
