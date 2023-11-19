import React, { useContext, useEffect, useState } from "react";
import './index.less';
import Halloween750 from '../../../../assets/nacp/hallween/halloween_750.svg';
import Halloween375 from '../../../../assets/nacp/hallween/halloween_375.svg';
import HalloweenOver750 from '../../../../assets/nacp/hallween/halloween_over_750.svg';
import HalloweenOver375 from '../../../../assets/nacp/hallween/halloween_over_375.svg';
import CloseIcon from '../../../../assets/nacp/hallween/close.svg';
import { DataContext } from "../../../../utils/utils";
import { MaxEpochValue } from "../../point-map";

export default function HalloweenInfoPopup(props: any) {
    const { show, close, epoch } = props;
    const { state, dispatch } = useContext(DataContext);
    const [infoImages, setInfoImages] = useState({w: '', m: ''});

    useEffect(() => {
        if (epoch >= MaxEpochValue) {
            setInfoImages({
                w: HalloweenOver750,
                m: HalloweenOver375
            });
        } else {
            setInfoImages({
                w: Halloween750,
                m: Halloween375
            });
        }
    }, [epoch]);
    return (
        <div className={`halloween-info-container ${show && 'show'}`}>
            <div className="halloween-info-content">
                <img className="cover" src={state.windowWidth > 600 ? infoImages.w : infoImages.m } alt="" />
                <img onClick={() => {
                    close && close();
                }} src={CloseIcon} className="close-btn cursor" alt="" />
            </div>
        </div>
    );
}
