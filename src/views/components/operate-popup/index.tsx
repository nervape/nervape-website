import React from "react";
import './index.less';
import ShareIcon from '../../../assets/nacp/hallween/share_icon.svg';

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
        title,
        type,
        hideConfirm } = props;
    return (
        <div className={`operate-popup-container popup-container ${show && 'show'}`}>
            <div className="confirm-content">
                {title && (
                    <div className="title">{title}</div>
                )}
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
                            {type == 'share' && (
                                <img src={ShareIcon} alt="ShareIcon" />
                            )}
                            {confirmText || 'YES'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
