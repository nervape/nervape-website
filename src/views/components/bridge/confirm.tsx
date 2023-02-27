import React from 'react';
import './confirm.less';

export default function TransferConfirm(props: { useMaxAmount: any; close: any; show: boolean; }) {
    const { useMaxAmount, close, show } = props;
    return (
        <div className={`confirm-container ${show && 'show'}`}>
            <div className="confirm-content">
                <div className="desc">
                    Your remaining balance after the transaction will be smaller than 63 CKB, which
                    is insufficient for making another trasfer.
                </div>
                <div className="btn-groups">
                    <button className="cancel btn" onClick={close}>
                        CANCEL
                    </button>
                    <button className="confirm btn" onClick={useMaxAmount}>
                        USE MAX AMOUNT
                    </button>
                </div>
            </div>
        </div>
    );
}
