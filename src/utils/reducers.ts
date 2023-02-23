import { getWindowWidthRange } from "./utils";

export enum Types {
    UpdateWindowWith = 'UpdateWindowWith',
    ShowLoading = 'ShowLoading',
    HideLoading = 'HideLoading',
    ShowLoginModal = 'ShowLoginModal',
    HideLoginModal = 'HideLoginModal',
    CurrentAddress = 'CurrentAddress',
    B = 'b'
}

export type InitialStateType = {
    windowWidth: number;
    loading: boolean;
    loadingNumber: number;
    showLoginModal: boolean;
    currentAddress: string;
}

export const globalReducer = (state, action) => {
    switch (action.type) {
        case Types.UpdateWindowWith:
            return {
                ...state,
                windowWidth: getWindowWidthRange()
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
        default: return state;
    }
}
