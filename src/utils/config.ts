export const CONFIG = {
    CKB_NODE_RPC_URL: import.meta.env.VITE_CKB_NODE_RPC_URL,
    CKB_INDEXER_RPC_URL: import.meta.env.VITE_CKB_INDEXER_RPC_URL,

    MNFT_ISSUER_TYPE_CODE_HASH: import.meta.env.VITE_MNFT_ISSUER_TYPE_CODE_HASH,
    MNFT_ISSUER_TYPE_ARGS: import.meta.env.VITE_MNFT_ISSUER_TYPE_ARGS,
    MNFT_CLASS_TYPE_CODE_HASH: import.meta.env.VITE_MNFT_CLASS_TYPE_CODE_HASH,
    MNFT_TYPE_CODE_HASH: import.meta.env.VITE_MNFT_TYPE_CODE_HASH,

    UNIPASS_V2_CODE_HASH: import.meta.env.VITE_UNIPASS_V2_CODE_HASH,

    LAYER_ONE_BRIDGE_CKB_ADDRESS: import.meta.env.VITE_LAYER_ONE_BRIDGE_CKB_ADDRESS,
    // ckb 0 ckb_testnet 1 ckb_dev 2
    // eslint-disable-next-line radix
    PW_CORE_CHAIN_ID: parseInt(import.meta.env.VITE_PW_CORE_CHAIN_ID),
    // eslint-disable-next-line radix
    GODWOKEN_CHAIN_ID: parseInt(import.meta.env.VITE_GODWOKEN_CHAIN_ID),

    UNIPASS_URL: import.meta.env.VITE_UNIPASS_URL,
    UNIPASS_ASSET_LOCK_CODE_HASH: import.meta.env.VITE_UNIPASS_ASSET_LOCK_CODE_HASH,
    UNIPASS_AGGREGATOR_URL: import.meta.env.VITE_UNIPASS_AGGREGATOR_URL,
    WEBSITE_HOST: import.meta.env.VITE_HOST,
    API_HOST: import.meta.env.VITE_API_HOST,

    NERVAPE_MNFT_ISSUER_ID: import.meta.env.VITE_NERVAPE_MNFT_ISSUER_ID,
    BRIDGE_STORAGE_ADDRESS_CKB: 110,
    // eslint-disable-next-line radix
    BRIDGE_FEE_CKB: parseInt(import.meta.env.VITE_BRIDGE_FEE_CKB) || 18,
    BRIDGE_L1_TX_ADDRESS: import.meta.env.VITE_BRIDGE_L1_TX_ADDRESS,
    BRIDGE_L2_TX_ADDRESS: import.meta.env.VITE_BRIDGE_L2_TX_ADDRESS,

    // Layer 2 contract address
    L2_CHARACTER_ADDRESS: import.meta.env.VITE_LAYER_TWO_NERVAPE_CHARACTER_ADDRESS,
    L2_SCENE_ADDRESS: import.meta.env.VITE_LAYER_TWO_NERVAPE_SCENE_ADDRESS,
    L2_ITEM_ADDRESS: import.meta.env.VITE_LAYER_TWO_NERVAPE_ITEM_ADDRESS,
    L2_SPECIAL_ADDRESS: import.meta.env.VITE_LAYER_TWO_NERVAPE_SPECIAL_ADDRESS,

    NACP_ADDRESS: import.meta.env.VITE_NACP_ADDRESS,
    // POAP
    POAP_API_URL: import.meta.env.VITE_POAP_API_URL,

    // Yokai
    YOKAI_URL: import.meta.env.VITE_YOKAI_URL,

    // metamask app url
    METAMASK_APP_URL: import.meta.env.VITE_METAMASK_URL,

    // metadata api host
    METADATA_API_HOST: import.meta.env.VITE_METADATA_API_HOST
}
