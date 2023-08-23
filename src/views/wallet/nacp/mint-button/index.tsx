import React, { useEffect, useState } from "react";
import './index.less';
import { NacpPhase, NacpSetting } from "../../../../nervape/nacp";
import { updateBodyOverflow } from "../../../../utils/utils";

export class MintButtobObj {
    title: string = '';
    desc: string = '';
    icon?: string = '';
    showMintButton?: boolean = false;
    buttonText?: string;
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
}) {
    const { nacpSetting, isBonelist, isMinting, isMintedSuccess, hasMinted, type, phasesSetting, isTokenSuccess, setShowMintTip } = props;

    const [mintButtonObj, setMintButtonObj] = useState<MintButtobObj>(new MintButtobObj());

    useEffect(() => {
        if (type != 'spot') return;
        if (!isMintedSuccess) return;
        if (hasMinted) return;
        if (!nacpSetting) return;

        const now = new Date().getTime();

        if (now < nacpSetting.bonelist_start_time || now > nacpSetting.public_end_time) return;
        // 当前在 bonelist_start_time 和 public_end_time 之间
        // 当前时间在 bonelist mint 时间段内
        if (now >= nacpSetting.bonelist_start_time && now <= nacpSetting.bonelist_end_time) {
            if (isBonelist) {
                setMintButtonObj({
                    title: isMinting ? 'MINTING NACPs…' : 'BONELIST MINT HAS STARTED!',
                    desc: isMinting
                        ? 'This might take several minutes. Sit back and enjoy a Gorilla Cola!'
                        : `To maintain your bonelist spots you MUST mint before ${new Date(nacpSetting.bonelist_end_time).toLocaleString("en-US")}. 
                                Clicking the mint button below will mint all 3 of your spots at the same time. Don’t miss out!`,
                    showMintButton: true,
                    buttonText: isMinting ? 'MINTING...' : 'MINT'
                });
            } else {
                setMintButtonObj({
                    title: 'BONELIST MINT PHASE',
                    desc: `The bonelist mint phase is live! Bonelist members can mint now 🦴. 
                        If you don’t have a bonelist, the public mint will start from ${new Date(nacpSetting.public_start_time).toLocaleString("en-US")} to ${new Date(nacpSetting.public_end_time).toLocaleString("en-US")}.`,
                    showMintButton: false
                });
            }
        } else if (now >= nacpSetting.public_start_time && now <= nacpSetting.public_end_time) {
            setMintButtonObj({
                title: isMinting ? 'MINTING NACPs…' : 'PUBLIC MINT HAS STARTED',
                desc: isMinting
                    ? 'This might take several minutes. Sit back and enjoy a Gorilla Cola!'
                    : `Public mint ends ${new Date(nacpSetting.public_end_time).toLocaleString("en-US")}. Make sure you mint your NACP before the deadline! Have fun!`,
                showMintButton: true,
                buttonText: isMinting ? 'MINTING...' : 'MINT'
            });
        }

    }, [isBonelist, nacpSetting, isMinting, isMintedSuccess, hasMinted, type]);

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
            });
        } else {
            let title: string, desc: string = '';

            if (now > phase1.start_date && now < phase1.end_date) {
                title = `PHASE 1 - “DRESS UP YOUR APE” HAS STARTED!`
                desc = `Phase 1 - Dress Up Your Ape, ends ${new Date(phase1.end_date).toLocaleString("en-US")}. During this phase you will be able to select your ape’s base skin, tattoo, upper and lower body wear, suit/costume. Get your ape all dressed up!`
            } else if (now > phase2.start_date && now < phase2.end_date) {
                title = `PHASE 2 -  “STYLE UP YOUR HEAD” HAS STARTED!`
                desc = `Phase 2 - Style Up Your Head, ends ${new Date(phase2.end_date).toLocaleString("en-US")}. During this phase you will be able to select hats, masks, glasses, and ear wear. Give your ape’s head some style!`
            } else if (now > phase3.start_date && now < phase3.end_date) {
                title = `PHASE 3 - “MAKE YOUR APE SPECIAL” HAS STARTED!`
                desc = `Phase 3 - Make Your Ape Special, ends ${new Date(phase3.end_date).toLocaleString("en-US")}. During this phase you will be able to select companions, handheld items, neckwear, and backgrounds. This is where you can make your ape extra special!`
            } else {
                title = ''
                desc = ''
            }
            setMintButtonObj({
                title,
                desc,
                showMintButton: false,
            });
        }

    }, [type, phasesSetting]);

    useEffect(() => {
        if (type != 'end') return;
        if (!isMintedSuccess) return;
        if (!isTokenSuccess) return;
        if (hasMinted) return;

        setMintButtonObj({
            title: 'MINT PHASE HAS ENDED',
            desc: `It seems you missed the public mint. It’s ok, my fellow ape! You can still buy NACPs from Opensea and participate in the upcoming phases. Don’t worry!`,
            showMintButton: false,
        });

    }, [type, isMintedSuccess, hasMinted, isTokenSuccess]);

    if (type == 'spot' && !nacpSetting) return <></>;

    if (type == 'ape' && !phasesSetting.length) return <></>;

    if (type == 'end' && (!nacpSetting || hasMinted)) return <></>;

    return (
        <div className={`mint-button-content ${isMinting && 'minting'}`}>
            <div className={`mint-content flex-align`}>
                <div className="mint-icon"></div>
                <div className="mint-desc">
                    <div className="mint-tip-title">{mintButtonObj.title}</div>
                    <div className="mint-tip-desc">
                        {mintButtonObj.desc}
                    </div>
                </div>
            </div>
            {mintButtonObj.showMintButton && (
                <button className="mint-btn cursor" onClick={() => {
                    setShowMintTip && setShowMintTip(true);
                    updateBodyOverflow(false);
                }}>{mintButtonObj.buttonText}</button>
            )}
        </div>
    );
}
