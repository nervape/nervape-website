import React from 'react';
import './loading.less';
import LoadingGif from '../../../assets/images/loading.gif';

export default function LoadingModal(props: { show: boolean }) {
    const { show } = props;
    return (
        <div className={`loading-modal ${show && 'show'}`}>
            <div className="loading-content">
                <img src={LoadingGif} alt="LoadingGif" />
                <div className="text">Loading, please wait...</div>
            </div>
        </div>
    );
}
