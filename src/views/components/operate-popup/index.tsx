import React from "react";
import './index.less';

export default function OperatePopup(props: any) {
    const { close, show, confirm, hideClose, content, closeText, confirmText } = props;
    return (
        <div className={`operate-popup-container popup-container ${show && 'show'}`}>
            <div className="confirm-content">
                <div className="desc">
                    {content}
                </div>
                <div className="btn-groups">
                    {!hideClose && (
                        <button className="cancel btn" onClick={close}>
                            {closeText || 'NO'}
                        </button>
                    )}
                    <button className="confirm btn" onClick={confirm}>
                        {confirmText || 'YES'}
                    </button>
                </div>
            </div>
        </div>
    );
}
