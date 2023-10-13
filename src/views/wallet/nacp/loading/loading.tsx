import React from 'react';
import './loading.less';

import LoadingGif from '../../../../assets/wallet/nacp/loading_assets.gif';

export default function LoadingAssetsModal(props: { show: boolean, progress: string }) {
    const { show, progress } = props;

    return (
        <div className={`loading-assets-modal popup-container ${show && 'show'}`}>
            <div className="loading-content">
                <img src={LoadingGif} alt="LoadingGif" />
                <div className="text">{`Loading assets... ${progress}%`}</div>
            </div>
        </div>
    );
}
