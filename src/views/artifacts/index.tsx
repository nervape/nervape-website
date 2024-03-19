import React from "react";

import './index.less';
import Footer from "../components/footer";

export default function ArtifactPage() {
    return (
        <>
            <div className="artifact-container">
                <img src="https://nervape-storage.s3.ap-southeast-1.amazonaws.com/album-main/production/d3f69884-4a83-44c0-a03c-20f2b90c63e9.png" alt="MaintenanceBg" />
                <div className="coming-soon">COMING SOON...</div>

                <Footer></Footer>
            </div>
        </>
    );
}
