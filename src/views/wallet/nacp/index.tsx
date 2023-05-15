import React, { useEffect, useState } from "react";
import './index.less';

import NacpLogo from '../../../assets/wallet/NACP_logo.svg';
import DefaultNacpApe from '../../../assets/wallet/nacp/default_nacp_ape.svg';
import { Popover } from "antd";

export class NACP_APE {
    coverImage: string = "";
    name: string = "";
    isRight: boolean = false;
}

export default function WalletNacp(props: { isBonelist: boolean; }) {
    const { isBonelist } = props;

    const [currNacpTab, setCurrNacpTab] = useState('ape');
    const [nacpApes, setNacpApes] = useState<NACP_APE[]>([]);

    useEffect(() => {
        let _apes: NACP_APE[] = [];

        for (let i = 0; i < 3; i++) {
            let isRight = false;

            if (i == 0) isRight = true;
            else {
                isRight = isBonelist;
            }
            _apes.push({
                coverImage: DefaultNacpApe,
                name: `NACP Spot #${i + 1}`,
                isRight: isRight
            })
        }
        setNacpApes(_apes);
    }, [isBonelist]);

    const ApeItem = (props: { ape: NACP_APE }) => {
        const { ape } = props;

        const _html = () => {
            return (
                <div className="nacp-ape-item">
                    <div className="cover-image">
                        <img className="cover" src={ape.coverImage} alt="DefaultNacpApe" />
                        {!ape.isRight && (
                            <div className="cover-no-right transition flex-center">
                                <img className="no-right-image" alt="" />
                                <div className="bonelist-required">Bonelist Required</div>
                                <a href="##" className="how-get transition">How to get bonelisted?</a>
                            </div>
                        )}
                    </div>
                    <div className="name">{ape.name}</div>
                </div>
            );
        };

        if (ape.isRight) {
            return (
                <Popover
                    color="#506077"
                    placement="bottom"
                    overlayClassName="nacp-ape-popover"
                    content={() => {
                        return (
                            <div className="nacp-ape-hover-popover">
                                <p>Each open spot allows you to mint one NACP NFT when it’s launched</p>
                                <a target="_block" href="/nacp">Learn more</a>
                            </div>
                        );
                    }}>
                    {_html()}
                </Popover>
            );
        }
        return _html();
    }
    return (
        <div className="wallet-nacp-container">
            <div className="wallet-nacp-header flex-align">
                <div className="nacp-logo">
                    <img src={NacpLogo} alt="NacpLogo" />
                </div>

                <div className="nacp-tabs flex-align">
                    <div className={`nacp-tab cursor transition nacp-ape-tab ${currNacpTab == 'ape' && 'active'}`} onClick={() => { setCurrNacpTab('ape') }}>APE</div>
                    <div className={`nacp-tab cursor transition nacp-asset-tab ${currNacpTab == 'asset' && 'active'}`} onClick={() => { setCurrNacpTab('asset') }}>ASSET</div>
                </div>
            </div>

            <div className="wallet-nacp-content">
                {currNacpTab == 'ape' ? (
                    <div className="nacp-content-apes flex-align">
                        {nacpApes.map((ape, index) => {
                            return <ApeItem ape={ape} key={index}></ApeItem>;
                        })}
                    </div>
                ) : (
                    <div className="nacp-content-asset"></div>
                )}
            </div>
        </div>
    );
}
