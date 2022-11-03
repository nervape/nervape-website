import React, { Component, useEffect, useRef } from "react";
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import 'antd/dist/antd.css';
import "./app.less";
import AboutPage from "./about";
import CampaignPage from "./campaigns";
import Story from "./stories";
import NFTPage from "./nfts";
import { NavTool } from "../route/navi-tool";
import PageView from "./components/page-view";
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
