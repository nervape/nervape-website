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
                        <div className="cursor cancel btn" style={{background: cancelColor}} onClick={close}>
                            {closeText || 'NO'}
                        </div>
                    )}
                    {!hideConfirm && (
                        <div className="cursor confirm btn" style={{background: confirmColor}} onClick={confirm}>
                            {confirmText || 'YES'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
