import React, { useEffect, useReducer, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavTool } from "../../route/navi-tool";
import { globalReducer, Types } from "../../utils/reducers";
import { DataContext, initialState } from "../../utils/utils";
import Footer from "./footer";
import NavHeader from "./header";
import LoadingModal from "./loading/loading";
import "./page-view.less";
import LoginModal from "./wallet-connect/login-modal";
import Logout from "./logout";
import { useAccount, useDisconnect } from "wagmi";
import AvailableQuest from "./wallet-connect/available-quest";
import { LoginWalletType } from "../../utils/Wallet";
import { StoryCollectable } from "../../nervape/story";
import { nervapeApi } from "../../api/nervape-api";
import { queryOatPoaps } from "../../utils/api";
import { Event, EventType, Vote } from "../../nervape/campaign";
import { queryGetVotes } from "../../utils/snapshot";

interface PageViewState {
  windowWidth: number
}

export default function PageView(props: any) {
  NavTool.navigation = useNavigate();
  NavTool.location = useLocation();
  const { children, activeIndex, disableFooter } = props;

  const [state, dispatch] = useReducer(globalReducer, initialState);

  const setShowLogout = (value: boolean) => {
    dispatch({
      type: Types.ShowLogout,
      value: value
    })
  }

  const { disconnect } = useDisconnect();
  const disconnectReload = () => {
    localStorage.clear();
    disconnect();
    window.location.reload();
  };

  useAccount({
    onDisconnect() {
      disconnectReload();
    }
  });

  const setStoryQuizes = (value: StoryCollectable[]) => {
    dispatch({
      type: Types.StoryQuizes,
      value: value
    })
  }

  const setCampaignEvents = (value: Event[]) => {
    dispatch({
      type: Types.CampaignEvents,
      value: value
    })
  }

  async function initQuizAndEvent(_address: string) {
    if (state.loginWalletType !== LoginWalletType.WALLET_CONNECT) return;

    const stories: StoryCollectable[] = await nervapeApi.fnStoryQuestions();
    await Promise.all(
      stories.map(async story => {
        const _oatPoaps = await queryOatPoaps(_address, story.galxeCampaignId);
        story.show = _oatPoaps && _oatPoaps.length <= 0;
        return story;
      })
    );
    setStoryQuizes(stories.filter(item => item.show));
    // const events: Event[] = await nervapeApi.fnGetActiveEvents(state.currentAddress, '');
    // await Promise.all(
    //   events.map(async event => {
    //     if (event.type == EventType.Vote) {
    //       const votes: Vote[] = await queryGetVotes(event.proposalId);
    //       const count = votes.filter(vote => vote.voter == _address).length;
    //       event.show = count == 0;
    //     }

    //     return event;
    //   })
    // )
    // setCampaignEvents(events.filter(item => item.show));
  }

  function fnResizeWindow() {
    dispatch({
      type: Types.UpdateWindowWith
    });
    
    dispatch({
      type: Types.UpdateWindowRealWith
    });
  }

  useEffect(() => {
    fnResizeWindow();
    window.addEventListener("resize", fnResizeWindow, true);
    return () => {
      window.removeEventListener("resize", fnResizeWindow, true)
    }
  }, []);

  useEffect(() => {
    if (!state.currentAddress) return;
    // init Story Quiz and Events data
    initQuizAndEvent(state.currentAddress);
  }, [state.currentAddress]);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      <div className="page-view">
        <div className="page-header">
          <NavHeader
            activeIndex={activeIndex}
          ></NavHeader>
        </div>
        <div
          className="page-main"
        >
          <>
            {children}
            {!disableFooter && (
              <div className="page-footer">
                <Footer></Footer>
              </div>
            )}
          </>
        </div>
        <LoadingModal show={state.loading}></LoadingModal>
        <LoginModal activeIndex={activeIndex} ></LoginModal>
        <Logout
          show={state.showLogout}
          close={() => {
            setShowLogout(false);
          }}
          logout={disconnectReload}></Logout>
        <AvailableQuest
          events={state.campaignEvents}
          quizes={state.storyQuizes}></AvailableQuest>
      </div>
    </DataContext.Provider>
  );
}

