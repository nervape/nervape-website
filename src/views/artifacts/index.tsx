import React from "react";

import './index.less';
import MaintenanceBg from '../../assets/maintenance/maintenance_bg.png';
import Footer from "../components/footer";

export default function ArtifactPage() {
    return (
        <>
            <div className="artifact-container">
                <img src={MaintenanceBg} alt="MaintenanceBg" />
                <div className="text">Nervape.com is currently down for maintenance</div>

                <Footer></Footer>
            </div>
        </>
    );
}
