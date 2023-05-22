import React, { useContext, useEffect, useState } from "react";
import './index.less';

import DefaultAvatar from '../../../assets/wallet/default_avatar.svg';
import NervosLogo from '../../../assets/logo/nervos_logo.svg';
import GodwokenLogo from '../../../assets/logo/godwoken_logo.svg';
import EthLogo from '../../../assets/logo/etherum.svg';
import InfoIcon from '../../../assets/icons/info_icon.svg';

import { Dropdown, MenuProps, message } from "antd";
import { StoryCollectable } from "../../../nervape/story";
import { nervapeApi } from "../../../api/nervape-api";
import { queryOatPoaps } from "../../../utils/api";
import { Vote, Event } from "../../../nervape/campaign";
import { queryGetVotes } from "../../../utils/snapshot";
import { disconnect, mainnet } from "@wagmi/core";
import { useAccount, useNetwork } from "wagmi";
import CopyToClipboard from "react-copy-to-clipboard";
import { DataContext, updateBodyOverflow } from "../../../utils/utils";
import { LoginWalletType } from "../../../utils/Wallet";
import { godWoken } from "../../../utils/Chain";
import Logout from "../../components/logout";
import AvailableQuest from "../../components/wallet-connect/available-quest";

export default function WalletHeader(props: any) {
    const { state, dispatch } = useContext(DataContext);
    const { setShowTransfer, balance, isBonelist } = props;

    const { chain } = useNetwork();

    /**
     * 地址 hover 
     */
    const [open, setOpen] = useState(false);
    const [showQuest, setShowQuest] = useState(false);
    const [storyQuizes, setStoryQuizes] = useState<StoryCollectable[]>([]);
    const [campaignEvents, setCampaignEvents] = useState<Event[]>([]);

    const [showLogout, setShowLogout] = useState(false);

    async function initQuizAndEvent(_address: string) {
        const stories: StoryCollectable[] = await nervapeApi.fnStoryQuestions();
        await Promise.all(
            stories.map(async story => {
                const _oatPoaps = await queryOatPoaps(_address, story.galxeCampaignId);
                story.show = _oatPoaps.length <= 0;
                return story;
            })
        );
        setStoryQuizes(stories.filter(item => item.show));
        console.log(storyQuizes);
        const events: Event[] = await nervapeApi.fnGetActiveEvents('');
        await Promise.all(
            events.map(async event => {
                const votes: Vote[] = await queryGetVotes(event.proposalId);
                const count = votes.filter(vote => vote.voter == _address).length;
                event.show = count == 0;
            })
        )
        setCampaignEvents(events.filter(item => item.show));
    }

    useEffect(() => {
        if (!state.currentAddress) return;

        initQuizAndEvent(state.currentAddress);
    }, [state.currentAddress]);

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

    const CopyAddress = () => {
        return (
            <CopyToClipboard
                text={state.currentAddress}
                onCopy={() => {
                    message.success(`Copy Success!`);
                    setOpen(false);
                }}
            >
                <button className="copy-address cursor">Copy Address</button>
            </CopyToClipboard>
        );
    }

    const Available = () => {
        return (
            <button
                className="nervape-asset cursor"
                onClick={() => {
                    setOpen(false);
                    setShowQuest(true);
                    document.body.style.overflow = 'hidden';
                }}>
                {`Available Quest (${storyQuizes.length + campaignEvents.length})`}
            </button>
        );
    }
    const SignOut = () => {
        return (
            <button
                className="logout-out cursor"
                onClick={() => {
                    // sessionStorage.removeItem('UP-A');
                    setOpen(false);
                    setShowLogout(true);
                }}
            >
                Sign Out
            </button>
        );
    }

    const items: MenuProps['items'] = [
        {
            label: CopyAddress(),
            key: '1'
        },
        {
            label: Available(),
            key: '3'
        },
        {
            label: SignOut(),
            key: '2'
        }
    ];

    /**
     * 地址 hover 
     */

    const walletIcon = () => {
        if (state.loginWalletType === LoginWalletType.UNIPASS_V3) return NervosLogo;
        // 检查是否支持当前网络
        if (!chain || ![godWoken.id, mainnet.id].includes(chain.id)) {
            return InfoIcon;
        }
        return chain.id === godWoken.id ? GodwokenLogo : EthLogo;
    };

    const myBalance = () => {
        const balanceArr = balance.split('.');
        return (
            <>
                {balanceArr[0]}
                <span>{balanceArr[1] ? `.${balanceArr[1]}` : ''}</span>
            </>
        );
    };

    const AddressDropdown = () => {
        return (
            <div className="user-address flex-align">
                <Dropdown
                    menu={{ items }}
                    trigger={['hover']}
                    overlayClassName="wallet-connect-dropmenu"
                    onOpenChange={_open => {
                        setOpen(_open);
                    }}
                >
                    <div className={`address transition flex-align cursor ${open && 'open'}`}>
                        <img src={walletIcon()} alt="UnipassIcon" />
                        <div className="span">{state.formatAddress}</div>
                        {(storyQuizes.length + campaignEvents.length > 0) && (
                            <div className="available-quest-count">
                                {storyQuizes.length + campaignEvents.length > 99 ? '1+' : storyQuizes.length + campaignEvents.length}
                            </div>
                        )}
                    </div>
                </Dropdown>
            </div>
        );
    }

    const UserInfo = () => {
        if (state.loginWalletType == LoginWalletType.UNIPASS_V3) {
            return (
                <div className="ckb-balance">
                    <div className="title flex-align">
                        CKB BALANCE
                        <div className="transfer">
                            <button
                                className="transfer-btn cursor"
                                onClick={() => {
                                    setShowTransfer(true);
                                    updateBodyOverflow(false);
                                }}>Transfer</button>
                        </div>
                    </div>

                    <div className="balance-value">{myBalance()}</div>
                </div>
            );
        }


        return (
            <div className="bone-list-points flex-align">
                <div className="bone-item bone-list">
                    <div className="title">BONE LIST</div>
                    <div className={`nacp flex-align ${isBonelist && 'holder'}`}>
                        <div className="name">NACP</div>
                        <div className="icon"></div>
                    </div>
                    <div className="nft-3d flex-align">
                        <div className="name">3D NFT</div>
                        <div className="icon"></div>
                    </div>
                </div>
                <div className="bone-item bone-points">
                    <div className="title flex-align">
                        <div className="title-left">BONE POINTS</div>
                        {/* <div className="record cursor">Record</div> */}
                    </div>
                    {/* <div className="points">1,000,000</div>
            <div className="daily-add">+1,000,000 daily</div> */}
                    <div className="coming-soon">COMING SOON</div>
                </div>
            </div>
        );
    }

    return (
        <div className="wallet-header-container">
            {state.windowWidth > 375 ? (
                <div className="user-center-content flex-align">
                    <div className="user-avatar">
                        <img src={DefaultAvatar} alt="UserAvatar" />
                    </div>
                    <div className="user-info">
                        {AddressDropdown()}

                        {UserInfo()}
                    </div>
                </div>
            ) : (
                <div className="user-center-content m">
                    <div className="user-info flex-align">
                        <div className="user-avatar">
                            <img src={DefaultAvatar} alt="UserAvatar" />
                        </div>

                        {AddressDropdown()}
                    </div>

                    {UserInfo()}
                </div>
            )}

            <AvailableQuest
                show={showQuest}
                events={campaignEvents}
                quizes={storyQuizes}
                close={() => {
                    setShowQuest(false);
                    document.body.style.overflow = 'auto';
                }}></AvailableQuest>
            <Logout
                show={showLogout}
                close={() => {
                    setShowLogout(false);
                }}
                logout={disconnectReload}></Logout>
        </div>
    );
}
