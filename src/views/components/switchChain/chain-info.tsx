import React from 'react';
import './chain-info.less';

export default function ChainInfo(props: any) {
    const { show, close } = props;

    return (
        <div className={`chain-info ${show && 'show'}`} onClick={close}>
            <div
                className="info-bg"
                onClick={e => {
                    e.stopPropagation();
                }}
            >
                <div className="info-content">
                    <div className="top">
                        You don’t have Godwoken Network in your wallet. Please follow instructions
                        on{' '}
                        <a
                            href="https://docs.godwoken.io/quickStart"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            https://docs.godwoken.io/quickStart
                        </a>{' '}
                        to add the network.
                    </div>
                </div>
            </div>
        </div>
    );
}
