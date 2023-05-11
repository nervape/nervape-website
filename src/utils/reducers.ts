import { UnipassV3Wrapper } from "./UnipassV3Wrapper";
import { getWindowWidthRange } from "./utils";
import { LoginWalletType } from "./Wallet";

export enum Types {
    UpdateWindowWith = 'UpdateWindowWith',
    ShowLoading = 'ShowLoading',
    HideLoading = 'HideLoading',
    ShowLoginModal = 'ShowLoginModal',
    HideLoginModal = 'HideLoginModal',
    CurrentAddress = 'CurrentAddress',
    LayerOneWrapper = 'LayerOneWrapper',
    LoginWalletType = 'LoginWalletType',
    IsInit = 'IsInit',
}

export type InitialStateType = {
    windowWidth: number;
    loading: boolean;
    loadingNumber: number;
    showLoginModal: boolean;
    currentAddress: string;
    layerOneWrapper: UnipassV3Wrapper | undefined;
    loginWalletType: LoginWalletType | undefined;
    isInit: boolean;
}

export const globalReducer = (state: InitialStateType, action) => {
    switch (action.type) {
        case Types.UpdateWindowWith:
            return {
                ...state,
                windowWidth: getWindowWidthRange()
            };
        case Types.IsInit:
            return {
                ...state,
                isInit: action.value
            };
        case Types.ShowLoading:
            return {
                ...state,
                loadingNumber: state.loadingNumber++,
                loading: true
            };
        case Types.HideLoading:
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
