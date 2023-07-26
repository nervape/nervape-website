import { BigNumberish } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';

import React, { createContext } from "react";
import { InitialStateType } from './reducers';
import { Event } from '../nervape/campaign';
import { StoryCollectable } from '../nervape/story';

export const initialState = {
    windowWidth: getWindowWidthRange(),
    loading: false,
    loadingNumber: 0,
    showLoginModal: false,
    currentAddress: '',
    formatAddress: '',
    layerOneWrapper: undefined,
    loginWalletType: undefined,
    isInit: false,
    isWalletFold: false,
    isVisibleHeader: true,
    showAvailableQuest: false,
    showLogout: false,
    storyQuizes: [],
    campaignEvents: [],
    switchChain: false,
}

export const DataContext = createContext<{
    state: InitialStateType;
    dispatch: React.Dispatch<any>
}>({
    state: initialState,
    dispatch: () => null
});


// eslint-disable-next-line consistent-return

export function getWindowWidthRange() {
    const width = window.innerWidth;
    if (width <= 375) return 375;
    else if (width > 375 && width <= 600) return 600;
    else if (width > 600 && width <= 750) return 750;
    else if (width > 750 && width <= 1000) return 1000;
    else if (width > 1000 && width <= 1200) return 1200;
    else if (width > 1200 && width <= 1440) return 1440;
    return 1920;
}

export function getWindowScrollTop() {
    return document.documentElement.scrollTop || document.body.scrollTop;
}
export function scrollToTop() {
    setTimeout(() => {
        const sTop = getWindowScrollTop();
        console.log(sTop);
        if (sTop > 0) {
            // window.requestAnimationFrame(scrollToTop);
            window.scrollTo(0, 0);
        }
    }, 100);
}

export const parseBalance = (value: BigNumberish, decimals = 18) => formatUnits(value, decimals);

export function isMobile() {
    const flag = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
    return flag;
}

export function isMetaMaskMobile() {
    return /MetaMaskMobile/.test(navigator.userAgent);
}

export function updateBodyOverflow(open: boolean) {
    document.body.style.overflow = open ? 'auto' : 'hidden';
}

export function shuffle(arr: []) {
    let stack = [];

    while(arr.length) {
        let index = Math.floor(Math.random() * arr.length);
        stack.push(arr[index]);
        arr.splice(index, 1);
    }

    return stack;
}

// 图片加载
export function preloadImage(url: string, callback: Function) {
    let img = new Image();
    img.onload = function() {
        img.onload = null;
        callback && callback();
    }

    img.onerror = function() {
        img.onerror = null;
        callback && callback();
    }

    img.src = url;
}
