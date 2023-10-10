import { StoryCollectable } from "../nervape/story";
import { UnipassV3Wrapper } from "./UnipassV3Wrapper";
import { getWindowWidthRange, updateBodyOverflow } from "./utils";
import { LoginWalletType } from "./Wallet";
import { Event } from '../nervape/campaign';

export enum Types {
    UpdateWindowWith = 'UpdateWindowWith',
    ShowLoading = 'ShowLoading',
    HideLoading = 'HideLoading',
    ShowLoginModal = 'ShowLoginModal',
    HideLoginModal = 'HideLoginModal',
    CurrentAddress = 'CurrentAddress',
    FormatAddress = 'FormatAddress',
    LayerOneWrapper = 'LayerOneWrapper',
    LoginWalletType = 'LoginWalletType',
    IsInit = 'IsInit',
    IsWalletFold = 'IsWalletFold',
    IsVisibleHeader = 'IsVisibleHeader',
    ShowAvailableQuest = 'ShowAvailableQuest',
    ShowLogout = 'ShowLogout',
    StoryQuizes = 'StoryQuizes',
    CampaignEvents = 'CampaignEvents',
    SwitchChain = 'SwitchChain',
}

export type InitialStateType = {
    windowWidth: number;
    loading: boolean;
    loadingNumber: number;
    showLoginModal: boolean;
    currentAddress: string;
    formatAddress: string;
    layerOneWrapper: UnipassV3Wrapper | undefined;
    loginWalletType: LoginWalletType | undefined;
    isInit: boolean;
    isWalletFold: boolean;
    isVisibleHeader: boolean;
    showAvailableQuest: boolean;
    showLogout: boolean;
    storyQuizes: StoryCollectable[];
    campaignEvents: Event[];
    switchChain: boolean;
}

export const globalReducer = (state: InitialStateType, action: any) => {
    switch (action.type) {
        case Types.UpdateWindowWith:
            const width = getWindowWidthRange();

            return {
                ...state,
                windowWidth: width
            };
        case Types.IsInit:
            return {
                ...state,
                isInit: action.value
            };
        case Types.SwitchChain:
            return {
                ...state,
                switchChain: action.value
            };
        case Types.IsWalletFold:
            return {
                ...state,
                isWalletFold: action.value
            };
        case Types.StoryQuizes:
            return {
                ...state,
                storyQuizes: action.value
            };
        case Types.CampaignEvents:
            return {
                ...state,
                campaignEvents: action.value
            };
        case Types.ShowAvailableQuest:
            return {
                ...state,
                showAvailableQuest: action.value
            };
        case Types.ShowLogout:
            return {
                ...state,
                showLogout: action.value
            };
        case Types.IsVisibleHeader:
            return {
                ...state,
                isVisibleHeader: action.value
            };
        case Types.ShowLoading:
            updateBodyOverflow(false);
            return {
                ...state,
                loadingNumber: state.loadingNumber++,
                loading: true
            };
        case Types.HideLoading:
            updateBodyOverflow(true);
            if (action.value == true) state.loadingNumber = 1;

            if (state.loadingNumber - 1 <= 0) {
                return {
                    ...state,
                    loadingNumber: 0,
                    loading: false
                };
            }
            return {
                ...state,
                loading: true
            }; 
            
        case Types.ShowLoginModal:
            return {
                ...state,
                showLoginModal: true
            };
        case Types.HideLoginModal:
            return {
                ...state,
                showLoginModal: false
            };
        case Types.CurrentAddress:
            return {
                ...state,
                currentAddress: action.value
            }
        case Types.FormatAddress:
            return {
                ...state,
                formatAddress: action.value
            }
        case Types.LayerOneWrapper:
            return {
                ...state,
                layerOneWrapper: action.value
            }
        case Types.LoginWalletType:
            return {
                ...state,
                loginWalletType: action.value
            }
        default: return state;
    }
}
