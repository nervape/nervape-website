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
import { NavHeader } from "./components/header";
import { AboutPage } from "./pages/about";
import { CampaignPage } from "./pages/campaign";
import { Gallery } from "./pages/gallery";
import { StoriesPage } from "./pages/stories";
import { Footer } from "./components/footer";
import { NavTool } from "../route/navi-tool";
import PageView from "./components/page-view";

export function App() {
  NavTool.navigation = useNavigate();
  NavTool.location = useLocation();

  return (
    <div className="app">
      <div>
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
                <Gallery />
              </PageView>
            }
          />
          <Route
            path="/story"
            element={
              <PageView activeIndex={2}>
                <StoriesPage />
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
    </div>
  );
}
