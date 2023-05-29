import React from "react";
import './index.less';

export default function Logout(props: any) {
    const { close, show, logout } = props;
    return (
        <div className={`logout-container popup-container ${show && 'show'}`}>
            <div className="confirm-content">
                <div className="desc">
                    Would you like to sign out?
                </div>
                <div className="btn-groups">
                    <button className="cancel btn" onClick={close}>
                        NO
                    </button>
                    <button className="confirm btn" onClick={logout}>
                        YES
                    </button>
                </div>
            </div>
        </div>
    );
}
