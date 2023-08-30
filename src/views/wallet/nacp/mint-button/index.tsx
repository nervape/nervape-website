import React, { useEffect, useState } from "react";
import './index.less';
import { NacpPhase, NacpSetting } from "../../../../nervape/nacp";
import { updateBodyOverflow } from "../../../../utils/utils";
import useIntervalAsync from "../../../../hooks/useIntervalAsync";

export class MintButtobObj {
    title: string = '';
    desc: string = '';
    icon?: string = '';
    showMintButton?: boolean = false;
    buttonText?: string;
    countdownStr?: string;
    countdown?: number | string;
    hide?: boolean;
}

export default function MintButton(props: {
    nacpSetting: NacpSetting | undefined;
    phasesSetting: NacpPhase[];
    isBonelist: Boolean;
    type: string;
    isMinting: Boolean;
    isMintedSuccess: Boolean;
    hasMinted: Boolean;
    setShowMintTip?: Function;
    isTokenSuccess?: Boolean;
    initUnMintApes?: Function;
}) {
    const { nacpSetting, isBonelist, isMinting, isMintedSuccess, hasMinted, type, phasesSetting, isTokenSuccess, setShowMintTip, initUnMintApes } = props;

    const [mintButtonObj, setMintButtonObj] = useState<MintButtobObj>(new MintButtobObj());
    const [mintStart, setMintStart] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [countdownColor, setCountdownColor] = useState('');
    const [updateText, setUpdateText] = useState(0);

    useIntervalAsync(updateNacpStatus, 1000);

    async function updateNacpStatus() {
        if (!nacpSetting) return;
        if (!phasesSetting.length) return;

        const now = new Date().getTime();

        if (type == 'spot') {
            if (now > nacpSetting.public_end_time) return;

            if (isMintedSuccess && !hasMinted) {
                if (now >= nacpSetting.bonelist_start_time && now <= nacpSetting.bonelist_end_time) {
                    if (isBonelist) {
                        setCountdown(now - nacpSetting.bonelist_end_time);
                    } else {
                        setCountdown(now - nacpSetting.public_start_time);
                    }
                } else if (now >= nacpSetting.public_start_time && now <= nacpSetting.public_end_time) {
                    setCountdown(now - nacpSetting.public_end_time);
                } else {
                    setMintButtonObj({ ...mintButtonObj, countdownStr: '', countdown: '' });
                }
            } else {
                setMintButtonObj({ ...mintButtonObj, countdownStr: '', countdown: '' });
            }
        } else if (type == 'ape') {
            const phase1 = phasesSetting[0];
            const phase2 = phasesSetting[1];
            const phase3 = phasesSetting[2];

            if (now < phase1.start_date) {
                setCountdown(now - phase1.start_date);
            } else {
                if (now > phase1.start_date && now < phase1.end_date) {
                    setCountdown(now - phase1.end_date);
                } else if (now > phase2.start_date && now < phase2.end_date) {
                    setCountdown(now - phase2.end_date);
                } else if (now > phase3.start_date && now < phase3.end_date) {
                    setCountdown(now - phase3.end_date);
                } else {
                    setMintButtonObj({ ...mintButtonObj, countdownStr: '', countdown: '' });
                }
            }
        }
    }

    useEffect(() => {
        const abs = Math.abs(countdown);

        if (abs < 24 * 60 * 60 * 1000) {
            // 按时分秒格式化
            const hour = Math.floor((abs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minute = Math.floor((abs % (1000 * 60 * 60)) / (1000 * 60));
            const second = Math.floor((abs % (1000 * 60)) / 1000);
            setMintButtonObj({
                ...mintButtonObj,
                countdown: mintButtonObj.countdownStr?.replace('{countdown}', `${hour < 10 ? ('0' + hour) : hour}:${minute < 10 ? ('0' + minute) : minute}:${second < 10 ? ('0' + second) : second}`)
            });
            setCountdownColor('#FF5151');
        } else {
            // 按天格式化
            setCountdownColor('#3BD46F');
            setMintButtonObj({ ...mintButtonObj, countdown: mintButtonObj.countdownStr?.replace('{countdown}', `${Math.ceil(abs / (24 * 60 * 60 * 1000))} Days`) });
        }

        if (Math.floor(abs / 1000) == 0) {
            setTimeout(() => {
                setUpdateText(updateText + 1);

                initUnMintApes && initUnMintApes();
            }, 1000);
            return;
        }
    }, [countdown]);

    useEffect(() => {
        if (type != 'spot') return;
        if (!isMintedSuccess) return;
        if (hasMinted) return;
        if (!nacpSetting) return;

        const now = new Date().getTime();

        console.log(updateText);

        if (now > nacpSetting.public_end_time) return;
        setMintStart(true);
        // 当前在 bonelist_start_time 和 public_end_time 之间
        // 当前时间在 bonelist mint 时间段内
        if (now < nacpSetting.bonelist_start_time) {
            // mint 未开始
            setMintButtonObj({
                title: '',
                desc: `Bonelist Mint will start in ${new Date(nacpSetting.bonelist_start_time).toLocaleString("en-US")}! 
                    Public Mint will start in ${new Date(nacpSetting.public_start_time).toLocaleString("en-US")}!
                    Don’t miss out!`,
                showMintButton: false,
                hide: false,
            });
        } else if (now >= nacpSetting.bonelist_start_time && now <= nacpSetting.bonelist_end_time) {
            if (isBonelist) {
                setMintButtonObj({
                    title: isMinting ? 'MINTING NACPs…' : 'BONELIST MINT HAS STARTED!',
                    desc: isMinting
                        ? 'This might take several minutes. Sit back and enjoy a Gorilla Cola!'
                        : `To maintain your bonelist spots you MUST mint before ${new Date(nacpSetting.bonelist_end_time).toLocaleString("en-US")}. 
                                Clicking the mint button below will mint all 3 of your spots at the same time. Don’t miss out!`,
                    showMintButton: true,
                    hide: false,
                    buttonText: isMinting ? 'MINTING...' : 'MINT',
                    countdownStr: `{countdown} Left`
                });
            } else {
                setMintButtonObj({
                    title: 'BONELIST MINT NOW, PUBLIC MINT SOON!',
                    desc: `Only Bonelist members can currently mint. Don’t worry! The public mint will be starting from ${new Date(nacpSetting.public_start_time).toLocaleString("en-US")}. See you then!`,
                    countdownStr: 'Public Mint Starts in {countdown}',
                    showMintButton: false,
                    hide: false,
                });
            }
        } else if (now >= nacpSetting.public_start_time && now <= nacpSetting.public_end_time) {
            setMintButtonObj({
                title: isMinting ? 'MINTING NACPs…' : 'PUBLIC MINT HAS STARTED',
                desc: isMinting
                    ? 'This might take several minutes. Sit back and enjoy a Gorilla Cola!'
                    : `Public mint ends ${new Date(nacpSetting.public_end_time).toLocaleString("en-US")}. Make sure you mint your NACP before the deadline! Have fun!`,
                showMintButton: true,
                hide: false,
                buttonText: isMinting ? 'MINTING...' : 'MINT',
                countdownStr: '{countdown} Left'
            });
        } else {
            setMintButtonObj({ ...mintButtonObj, hide: true });
        }

    }, [isBonelist, nacpSetting, isMinting, isMintedSuccess, hasMinted, type, updateText]);

    useEffect(() => {
        if (type != 'ape') return;
        if (!phasesSetting.length) return;

        const now = new Date().getTime();
        const phase1 = phasesSetting[0];
        const phase2 = phasesSetting[1];
        const phase3 = phasesSetting[2];

        if (now < phase1.start_date) {
            setMintButtonObj({
                title: 'YOU CAN’T EDIT YOUR NACPs JUST YET!',
                desc: `Phase 1 (Dress Up Your Ape) starts ${new Date(phase1.start_date).toLocaleString("en-US")}. Once phase 1 starts, you will be able to start editing your NACPs.`,
                showMintButton: false,
                hide: false,
                countdownStr: 'Phase 1 Starts in {countdown}'
            });
        } else {
            let title: string, desc: string = '', countdownStr = '';

            if (now > phase1.start_date && now < phase1.end_date) {
                title = `PHASE 1 - “DRESS UP YOUR APE” HAS STARTED!`
                desc = `Phase 1 - Dress Up Your Ape, ends ${new Date(phase1.end_date).toLocaleString("en-US")}. During this phase you will be able to select your ape’s base skin, tattoo, upper and lower body wear, suit/costume. Get your ape all dressed up!`
                countdownStr = `{countdown} Left`;
            } else if (now > phase2.start_date && now < phase2.end_date) {
                title = `PHASE 2 -  “STYLE UP YOUR HEAD” HAS STARTED!`
                desc = `Phase 2 - Style Up Your Head, ends ${new Date(phase2.end_date).toLocaleString("en-US")}. During this phase you will be able to select hats, masks, glasses, and ear wear. Give your ape’s head some style!`
                countdownStr = `{countdown} Left`;
            } else if (now > phase3.start_date && now < phase3.end_date) {
                title = `PHASE 3 - “MAKE YOUR APE SPECIAL” HAS STARTED!`
                desc = `Phase 3 - Make Your Ape Special, ends ${new Date(phase3.end_date).toLocaleString("en-US")}. During this phase you will be able to select companions, handheld items, neckwear, and backgrounds. This is where you can make your ape extra special!`
                countdownStr = `{countdown} Left`;
            } else {
                title = ''
                desc = 'Wow look at the awesome apes you’ve created! Congratulations! All phases have ended and you won’t be able to edit until a new phase is released. Stay tuned!'
            }
            setMintButtonObj({
                title,
                desc,
                countdownStr,
                hide: false,
                showMintButton: false,
            });
        }

    }, [type, phasesSetting, updateText]);

    useEffect(() => {
        if (type != 'end') return;
        if (!isMintedSuccess) return;
        if (!isTokenSuccess) return;
        if (hasMinted) return;

        setMintButtonObj({
            title: 'MINT PHASE HAS ENDED',
            desc: `It seems you missed the public mint. It’s ok, my fellow ape! You can still buy NACPs from Opensea and participate in the upcoming phases. Don’t worry!`,
            showMintButton: false,
            hide: false,
        });

    }, [type, isMintedSuccess, hasMinted, isTokenSuccess, updateText]);

    if (type == 'spot' && (!nacpSetting || !mintStart)) return <></>;

    if (type == 'ape' && !phasesSetting.length) return <></>;

    if (type == 'end' && (!nacpSetting || hasMinted)) return <></>;

    if (mintButtonObj.hide) return <></>;

    return (
        <div className={`mint-button-content ${isMinting && 'minting'}`}>
            <div className={`mint-content flex-align`}>
                <div className="mint-icon"></div>
                <div className="mint-desc">
                    {mintButtonObj.title && (
                        <div className="mint-tip-title">{mintButtonObj.title}</div>
                    )}
                    {mintButtonObj.countdown && (
                        <div className="mint-tip-count" style={{ color: countdownColor, borderColor: countdownColor }}>
                            {mintButtonObj.countdown}
                        </div>
                    )}
                    {!mintButtonObj.countdown && (
                        <div className="mint-tip-desc">
                            {mintButtonObj.desc}
                        </div>
                    )}
                </div>
            </div>
            {mintButtonObj.countdown && (
                <div className="mint-tip-desc">
                    {mintButtonObj.desc}
                </div>
            )}
            {mintButtonObj.showMintButton && (
                <button className="mint-btn cursor" onClick={() => {
                    setShowMintTip && setShowMintTip(true);
                    updateBodyOverflow(false);
                }}>{mintButtonObj.buttonText}</button>
            )}
        </div>
    );
}
