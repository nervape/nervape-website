/* @vite-ignore */
import React, { Component, useEffect, useRef, useState } from "react";
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
import HomePage from "./home";
import MaintenancePage from "./maintenance";
import { configureChains, createClient, mainnet, goerli, WagmiConfig } from "wagmi";
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { godWoken, godWokenTestnet } from "../utils/Chain";
import WalletPage from "./wallet";
import Composite from "./nervape-composite";
import Nacp from "./nervape-composite/create";

export default function App() {
  NavTool.navigation = useNavigate();
  NavTool.location = useLocation();

  const [maintenance, setMaintenance] = useState(false);
  const host = window.location.host;

  if (maintenance && host == 'www.nervape.com') {
    return <MaintenancePage></MaintenancePage>;
  }

  const chains = [godWoken, godWokenTestnet, mainnet, goerli];

  const { provider, webSocketProvider } = configureChains(chains, [
    alchemyProvider({ apiKey: 'BbyuzUYnWmVjjGxGfgHnkUluVj2fiHBo' }),
    publicProvider()
  ]);

  const wagmiClient = createClient({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({ chains }),
      new WalletConnectConnector({
        chains,
        options: {
          qrcode: true
        }
      }),
      new CoinbaseWalletConnector({
        chains,
        options: {
          appName: 'Nervape Wallet'
        }
      })
    ],
    provider,
    webSocketProvider
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <div className="app">
        <Routes>
          <Route
            path=""
            element={
              <PageView disableFooter={true}>
                <HomePage />
              </PageView>
            }
          />
          <Route
            path="/about"
            element={
              <PageView activeIndex={1} disableFooter={true}>
                <AboutPage />
              </PageView>
            }
          />
          <Route
            path="/3dnft"
            element={
              <PageView activeIndex={3}>
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
              <PageView activeIndex={5}>
                <CampaignPage />
              </PageView>
            }
          />
          <Route
            path="/wallet"
            element={
              <PageView activeIndex={7} disableFooter={true}>
                <WalletPage></WalletPage>
              </PageView>
            }>
          </Route>
          <Route
            path="/nacp"
            element={
              <PageView activeIndex={0} disableFooter={true}>
                <Composite></Composite>
              </PageView>
            }>
          </Route>
          <Route
            path="/nacp/create"
            element={
              <PageView activeIndex={0} disableFooter={true}>
                <Nacp></Nacp>
              </PageView>
            }>
          </Route>
          <Route path="*" element={<Navigate to="" />} />
        </Routes>
      </div>
    </WagmiConfig>
  );
}
