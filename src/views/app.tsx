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

export class App extends Component {
  render() {
    return (
      <div className="app">
        <HistoryRouter history={history}>
          <NavBar
            pages={[
              {
                title: "About Nervape",
                url: ["/about"],
              },
              {
                title: "NFT Gallery",
                url: ["/nft"],
              },
              {
                title: "Stories",
                url: ["/story"],
              },
              {
                title: "Campaign",
                url: ["/campaign"],
              },
            ]}
          ></NavBar>
          <Routes>
            <Route path="/about" element={<About />} />
            <Route path="/nft" element={<Gallery />} />
            <Route path="/story" element={<Stories />} />
            <Route path="/campaign" element={<Campaign />} />
          </Routes>
          <Footer></Footer>
        </HistoryRouter>
      </div>
    );
  }
}
