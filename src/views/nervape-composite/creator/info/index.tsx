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
        if (!epoch) return;

        if (epoch >= MaxEpochValue) {
            setInfoImages({
                w: 'https://nervape-storage.s3.ap-southeast-1.amazonaws.com/album-main/production/1addac20-7471-4c60-8fd9-de538d6b6e11.png',
                m: 'https://nervape-storage.s3.ap-southeast-1.amazonaws.com/album-main/production/7cd24bf5-3f12-4e5c-aea0-38d07efe954c.png'
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
                {epoch && <img className="cover" src={state.windowWidth > 600 ? infoImages.w : infoImages.m } alt="" />}
                
                <img onClick={() => {
                    close && close();
                }} src={CloseIcon} className="close-btn cursor" alt="" />
            </div>
        </div>
    );
}
