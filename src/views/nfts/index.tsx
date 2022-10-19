import React, { useEffect, useState } from "react";
import { nervapeApi } from "../../api/nervape-api";
import { NFT_BANNER } from "../../nervape/nft";
import "./index.less";

export default function NFT() {
    const [banners, setBanners] = useState<NFT_BANNER[]>();

    useEffect(() => {
        nervapeApi.fnGetNFTBanners().then(res => {
            console.log(res);
        })
    }, []);
    return (
        <div className="nft-container main-container"></div>
    );
}
