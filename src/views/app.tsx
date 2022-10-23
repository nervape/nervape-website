import React, { Component, useEffect, useRef } from "react";
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./app.less";
import { AboutPage } from "./pages/about";
import CampaignPage from "./campaigns";
// import { Gallery } from "./pages/gallery";
// import { StoriesPage } from "./pages/stories";
import Story from "./stories";
import NFTPage from "./nfts";
import { NavTool } from "../route/navi-tool";
import PageView from "./components/page-view";
// import { StoryDetailPage } from "./pages/stories-detail";
import StoryProfile from "./stories/profile/profile";

export function App() {
  NavTool.navigation = useNavigate();
  NavTool.location = useLocation();

  return (
    <div className="app">
        <Routes>
          <Route
            path="/about"
            element={
              <PageView activeIndex={0}>
                <AboutPage />
              </PageView>
            }
          />
          <Route
            path="/nft"
            element={
              <PageView activeIndex={1}>
                <NFTPage />
              </PageView>
            }
          />
          <Route
            path="/story"
            element={
              <PageView activeIndex={2}>
                <Story />
              </PageView>
            }
          />
          <Route
            path="/story/:id"
            element={
              <PageView activeIndex={2} disableFooter={true}>
                <StoryProfile />
              </PageView>
            }
          />
          <Route
            path="/campaign"
            element={
              <PageView activeIndex={3}>
                <CampaignPage />
              </PageView>
            }
          />
          <Route path="*" element={<Navigate to="/about" />} />
        </Routes>
    </div>
  );
}
