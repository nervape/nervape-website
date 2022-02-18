import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.less";
import { INavProps, NavBar } from "./components/header";
import { About } from "./pages/about";
import { Campaign } from "./pages/campaign";
import { Gallery } from "./pages/gallery";
import { Stories } from "./pages/stories";
import { history, HistoryRouter } from "../route/history";
import { Footer } from "./components/footer";
const navData = {
  pages: [
    {
      title: "About Nervape",
      url: "/about",
      active: true,
    },
    {
      title: "NFT Gallery",
      url: "/gallery",
    },
    {
      title: "Stories",
      url: "/stories",
    },
    {
      title: "Campaign",
      url: "/campaign",
    },
  ],
} as INavProps;

export class App extends Component {
  render() {
    return (
      <div className="app">
        <HistoryRouter history={history}>
          <NavBar pages={navData.pages}></NavBar>
          <Routes>
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/campaign" element={<Campaign />} />
          </Routes>
          <Footer></Footer>
        </HistoryRouter>
      </div>
    );
  }
}
