import React from "react";
import './index.less';

export default function OperatePopup(props: any) {
    const { 
        close, 
        show, 
        confirm, 
        hideClose, 
        content, 
        closeText, 
        confirmText,
        cancelColor,
        confirmColor,
        hideConfirm } = props;
    return (
        <div className={`operate-popup-container popup-container ${show && 'show'}`}>
            <div className="confirm-content">
                <div className="desc">
                    {content}
                </div>
                <div className="btn-groups">
                    {!hideClose && (
                        <button className="cancel btn" style={{background: cancelColor}} onClick={close}>
                            {closeText || 'NO'}
                        </button>
                    )}
                    {!hideConfirm && (
                        <button className="confirm btn" style={{background: confirmColor}} onClick={confirm}>
                            {confirmText || 'YES'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
