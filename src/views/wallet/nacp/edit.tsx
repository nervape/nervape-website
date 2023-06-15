import React, { useEffect, useState } from "react";
import './edit.less';
import { nervapeApi } from "../../../api/nervape-api";
import { NacpPhase } from "../../../nervape/nacp";

export default function NacpEdit(props: any) {
    const [phases, setPhases] = useState<NacpPhase[]>([]);
    
    async function fnGetPhases() {
        const res = await nervapeApi.fnGetPhases();
        setPhases(res);
    }

    useEffect(() => {
        fnGetPhases();
    }, []);

    return (
        <div className="wallet-nacp-edit-container popup-container show">
            <div className="wallet-nacp-edit-content">
                <div className="edit-header flex-align">
                    <div className="title">NACP spot #01</div>
                    <div className="btn-groups flex-align">
                        <button className="cursor btn save-btn">Save</button>
                        <button className="cursor btn discard-btn">Discard</button>
                    </div>
                </div>
                <div className="edit-content flex-align">

                </div>
            </div>
        </div>
    );
}
