import React, { Component } from "react";
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./App.less";
import { INavProps, NavBar } from "./components/header";
import { AboutPage } from "./pages/about";
import { CampaignPage } from "./pages/campaign";
import { Gallery } from "./pages/gallery";
import { StoriesPage } from "./pages/stories";
import { Footer } from "./components/footer";
import { NavTool } from "../route/navi-tool";

export function App() {
  NavTool.navigation = useNavigate();
  NavTool.location = useLocation();

  return (
    <div className="app">
      <NavBar
        pages={[
          {
            title: "About Nervape",
            url: "/about",
          },
          {
            title: "NFT Gallery",
            url: "/nft",
          },
          {
            title: "Stories",
            url: "/story",
          },
          {
            title: "Campaign",
            url: "/campaign",
          },
        ]}
      ></NavBar>
      <Routes>
        <Route path="/about" element={<AboutPage />} />
        <Route path="/nft" element={<Gallery />} />
        <Route path="/story" element={<StoriesPage />} />
        <Route path="/campaign" element={<CampaignPage />} />
        <Route path="*" element={<Navigate to="/about" />} />
      </Routes>
      <Footer></Footer>
    </div>
  );
}
