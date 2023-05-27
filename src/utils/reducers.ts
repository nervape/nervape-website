import { UnipassV3Wrapper } from "./UnipassV3Wrapper";
import { getWindowWidthRange, updateBodyOverflow } from "./utils";
import { LoginWalletType } from "./Wallet";

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
        case Types.IsWalletFold:
            return {
                ...state,
                isWalletFold: action.value
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
