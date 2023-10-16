import React from 'react';
import './loading.less';
import Animation from './animation';
import LoadingGif from '../../../../assets/wallet/nacp/loading.json';

export default function LoadingAssetsModal(props: { show: boolean, progress: string }) {
    const { show, progress } = props;

    return (
        <div className={`loading-assets-modal popup-container ${show && 'show'}`}>
            <div className="loading-content">
                <Animation animationData={LoadingGif} className={undefined} style={undefined} onInit={undefined}/>
                <div className="text">{`Loading assets... ${progress}%`}</div>
            </div>
        </div>
    );
}
