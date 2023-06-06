import React from "react";
import './index.less';

export default function CompleteChallenge(props: any) {
    const { close, show, confirm } = props;
    return (
        <div className={`complete-challenge-container popup-container ${show && 'show'}`} onClick={close}>
            <div className="confirm-content" onClick={(e) => { e.stopPropagation() }}>
                <div className="title">Complete challenge</div>
                <div className="desc">
                    You have passed this quiz.
                    Sign to complete the challenge.
                </div>
                <div className="btn-groups">
                    <button className="confirm btn" onClick={confirm}>
                        COMPLETE CHALLENGE
                    </button>
                </div>
            </div>
        </div>
    );
}
