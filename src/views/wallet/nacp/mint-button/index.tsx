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
                    desc: `Bonelist mint phase is on. Public mint will start from 
                        ${new Date(nacpSetting.public_start_time).toLocaleString("en-US")} to ${new Date(nacpSetting.public_end_time).toLocaleString("en-US")}.`,
                    showMintButton: false
                });
            }
        } else if (now >= nacpSetting.public_start_time && now <= nacpSetting.public_end_time) {
            setMintButtonObj({
                title: isMinting ? 'MINTING NACPs…' : 'PUBLIC MINT HAS STARTED!',
                desc: isMinting
                    ? 'This might take several minutes. Sit back and enjoy a Gorilla Cola!'
                    : `Public mint ends ${new Date(nacpSetting.public_end_time).toLocaleString("en-US")}. Make sure you mint your NACP!`,
                showMintButton: true,
                buttonText: isMinting ? 'MINTING...' : 'MINT'
            });
        }

    }, [isBonelist, nacpSetting, isMinting, isMintedSuccess, hasMinted, type]);

    useEffect(() => {
        if (type != 'ape') return;
        if (!phasesSetting.length) return;

        const now = new Date().getTime();
        const phase = phasesSetting[0];

        if (now < phase.start_date) {
            setMintButtonObj({
                title: 'YOU CAN’T EDIT YOUR NACPs YET',
                desc: `Dressing Phase 1 starts ${new Date(phase.start_date).toLocaleString("en-US")}. Once the phase 1 starts, you will be able to start editing your NACPs.`,
                showMintButton: false,
            });
        } else {
            setMintButtonObj({
                title: 'DRESSING PHASE 1 STARTED',
                desc: `Dressing Phase 1 ends ${new Date(phase.end_date).toLocaleString("en-US")}. During this phase you will be able to select color, background, tattoo, and suit`,
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
            desc: `It seems you missed the public mint. You can still buy NACPs from Opensea and participate in the upcoming dressing phases.`,
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
