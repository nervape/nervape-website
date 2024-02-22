import React from "react";
import './index.less';

export default function TransferBonelist(props: any) {
    const { show } = props;

    return (
        <div className={`transfer-bonelist-container ${show && 'show'}`}>

        </div>
    );
}
