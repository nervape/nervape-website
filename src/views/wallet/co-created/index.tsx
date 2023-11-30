import React from "react";
import './index.less';

export default function WalletCoCreatedNFT(props: any) {
    const { isFold, setLoading } = props;

    return (
        <div className="wallet-co-created-nft-container">
            <div className="wallet-co-created-nft-header transition position-sticky flex-align">
                <div className="co-created-title">Co-Created NFT</div>
            </div>

            <div className="wallet-co-created-nft-content">
                
            </div>
        </div>
    );
}
