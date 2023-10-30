import React, { useContext, useEffect } from "react";
import './index.less';
import Halloween750 from '../../../../assets/nacp/hallween/halloween_750.svg';
import Halloween375 from '../../../../assets/nacp/hallween/halloween_375.svg';
import CloseIcon from '../../../../assets/nacp/hallween/close.svg';
import { DataContext } from "../../../../utils/utils";

export default function HalloweenInfoPopup(props: any) {
    const { show, close } = props;
    const { state, dispatch } = useContext(DataContext);

    return (
        <div className={`halloween-info-container ${show && 'show'}`}>
            <div className="halloween-info-content">
                <img className="cover" src={state.windowWidth > 600 ? Halloween750 : Halloween375 } alt="" />
                <img onClick={() => {
                    close && close();
                }} src={CloseIcon} className="close-btn cursor" alt="" />
            </div>
        </div>
    );
}
