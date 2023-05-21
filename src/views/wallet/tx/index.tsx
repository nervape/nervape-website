import React, { forwardRef, useContext, useEffect, useImperativeHandle, useState } from "react";
import './index.less';
import { NFT, NFT_TYPE_VALUE } from "../../../utils/nft-utils";
import { DataContext } from "../../../utils/utils";
import { LoginWalletType } from "../../../utils/Wallet";
import { getHistories, getUnipassCkbHistories, getUnipassHistories } from "../../../utils/api";
import LoadingModal from "../../components/loading/loading";
import { CONFIG } from "../../../utils/config";
import HistoryDetail from "../../components/history/detail";

export enum TransferType {
    BRIDGE = 'BRIDGE',
    MINT = 'MINT',
    TRANSFER = 'TRANSFER'
}

export enum TxStatus {
    PENDING = 'pending',
    COMMITTED = 'committed',
    FAILED = 'failed',
    COMPLETED = 'Completed',
    PROGRESS = 'In Progress',
    FAIL = 'Failed'
}

export class HISTORY_NFT {
    name!: string;

    from_chain_class_id!: number;

    from_chain_token_id!: number;

    to_chain_class_type!: string;

    from_chain_class_name!: string;

    to_chain_token_id!: number;

    _id!: string;
}

export class HISTORY {
    name!: string;

    txHash!: string;

    fromTxHash?: string;

    from!: string;

    to!: string;

    tokenId!: number;

    timestamp!: number;

    contract!: string;

    transferType!: TransferType;

    status!: TxStatus;

    submittedAt!: number;

    type!: string;

    nfts?: HISTORY_NFT[];

    amount?: string;
}

function SuccessIcon() {
    return (
        <svg
            width="14"
            height="12"
            viewBox="0 0 14 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M12.0187 0.632812L14 2.61408L5.17369 11.4404L0 6.59113L1.91614 4.5468L5.11054 7.54083L12.0187 0.632812Z" />
        </svg>
    );
}
function FailedIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.99955 4.52516L2.63698 0.162598L0.162109 2.63747L4.52467 7.00003L0.162109 11.3626L2.63698 13.8375L6.99955 9.47491L11.3621 13.8375L13.837 11.3626L9.47442 7.00003L13.837 2.63747L11.3621 0.162598L6.99955 4.52516Z"
            />
        </svg>
    );
}

function PendingIcon() {
    return (
        <svg
            width="13"
            height="14"
            viewBox="0 0 13 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <mask
                id="mask0_233_5943"
                style={{ maskType: 'alpha' }}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="13"
                height="14"
            >
                <path
                    d="M5.68956 11.2584L5.95591 11.3312C6.40269 11.4384 6.86256 11.4757 7.31816 11.4432L7.50097 13.9821L7.13218 13.9987C6.39395 14.0127 5.65356 13.9105 4.94074 13.6918L5.68956 11.2584ZM9.8092 10.4576L11.4145 12.4334L11.1152 12.664C10.5072 13.1069 9.84318 13.44 9.15088 13.6628L8.36799 11.2402L8.62294 11.1495C9.04403 10.9851 9.44485 10.7544 9.8092 10.4576ZM3.48437 9.73647L3.61616 9.89746C3.7069 10.0032 3.80339 10.1056 3.90562 10.2043C4.15549 10.4456 4.42631 10.6519 4.71199 10.8232L3.40517 13.0082L3.13856 12.8401C2.78703 12.6071 2.45167 12.3389 2.1374 12.0354C1.89635 11.8026 1.67562 11.5567 1.47524 11.2999L3.48437 9.73647ZM1.96463 2.1374C4.65017 -0.643564 9.08164 -0.720916 11.8626 1.96463L12.7503 1.04535L12.8299 4.65781L9.21685 4.70439L10.0944 3.79567L9.92546 3.6406C8.14952 2.09145 5.45125 2.19122 3.79567 3.90562C2.49484 5.25267 2.21269 7.20826 2.93257 8.8192L0.608913 9.86006L0.500966 9.60513C-0.491749 7.12447 -0.0117388 4.18398 1.96463 2.1374Z"
                    fill="white"
                />
            </mask>
            <g mask="url(#mask0_233_5943)">
                <path d="M5.68956 11.2584L5.95591 11.3312C6.40269 11.4384 6.86256 11.4757 7.31816 11.4432L7.50097 13.9821L7.13218 13.9987C6.39395 14.0127 5.65356 13.9105 4.94074 13.6918L5.68956 11.2584ZM9.8092 10.4576L11.4145 12.4334L11.1152 12.664C10.5072 13.1069 9.84318 13.44 9.15088 13.6628L8.36799 11.2402L8.62294 11.1495C9.04403 10.9851 9.44485 10.7544 9.8092 10.4576ZM3.48437 9.73647L3.61616 9.89746C3.7069 10.0032 3.80339 10.1056 3.90562 10.2043C4.15549 10.4456 4.42631 10.6519 4.71199 10.8232L3.40517 13.0082L3.13856 12.8401C2.78703 12.6071 2.45167 12.3389 2.1374 12.0354C1.89635 11.8026 1.67562 11.5567 1.47524 11.2999L3.48437 9.73647ZM1.96463 2.1374C4.65017 -0.643564 9.08164 -0.720916 11.8626 1.96463L12.7503 1.04535L12.8299 4.65781L9.21685 4.70439L10.0944 3.79567L9.92546 3.6406C8.14952 2.09145 5.45125 2.19122 3.79567 3.90562C2.49484 5.25267 2.21269 7.20826 2.93257 8.8192L0.608913 9.86006L0.500966 9.60513C-0.491749 7.12447 -0.0117388 4.18398 1.96463 2.1374Z" />
            </g>
        </svg>
    );
}

function HistoryItem(props: {
    showHistoryDetail: Function;
    history: HISTORY;
    loginWalletType: LoginWalletType;
    address: string;
    showTx: boolean;
}) {
    const { showHistoryDetail, history, loginWalletType, address, showTx } = props;

    function formatTime(time: number) {
        const date = new Date(time * 1000);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        return (
            <>
                <div>{`${year}/${month > 9 ? month : `0${month}`}/${day > 9 ? day : `0${day}`
                    }`}</div>
                <div>{`${hour > 9 ? hour : `0${hour}`}:${minute > 9 ? minute : `0${minute}`}:${second > 9 ? second : `0${second}`
                    }`}</div>
            </>
        );
    }

    function showType() {
        if (loginWalletType !== LoginWalletType.UNIPASS_V3) {
            if (history.transferType !== TransferType.TRANSFER)
                return history.transferType.toLowerCase();
            if (address === history.from) return 'send';
            return 'receive';
        }
        return history.type;
    }

    return (
        <div
            className="history transition flex-align"
            onClick={() => {
                showHistoryDetail(history);
            }}
        >
            {loginWalletType !== LoginWalletType.UNIPASS_V3 && (
                <div className="history-item index">{`#${history.tokenId}`}</div>
            )}
            <div className={`history-item type ${showType()}`}>
                <div className="span">{showType()}</div>
            </div>
            <div className="history-item date">{history.timestamp ? formatTime(history.timestamp) : '/'}</div>
            <div className={`history-item status ${history.status.toLowerCase()}`}>
                {history.status === TxStatus.PENDING || history.status === TxStatus.PROGRESS ? (
                    <PendingIcon></PendingIcon>
                ) : history.status === TxStatus.COMMITTED ||
                    history.status === TxStatus.COMPLETED ? (
                    <SuccessIcon></SuccessIcon>
                ) : (
                    <FailedIcon></FailedIcon>
                )}
            </div>
            {showTx && (
                <div className="history-item number">
                    <a
                        target="_blank"
                        onClick={e => {
                            e.stopPropagation();
                        }}
                        href={`${history.type && history.type.includes('CKB')
                            ? CONFIG.BRIDGE_L1_TX_ADDRESS
                            : `${CONFIG.BRIDGE_L2_TX_ADDRESS}tx`
                            }/${history.txHash}`}
                    >
                        view
                    </a>
                </div>
            )}
        </div>
    );
}

const WalletTx = (
    props: {
        setLoading: Function;
        updateBalance: Function;
        nftCoverImages: NFT[];
    },
    ref: React.Ref<unknown>
) => {
    const { setLoading, updateBalance, nftCoverImages } = props;

    const { state, dispatch } = useContext(DataContext);

    const [histories, setHistories] = useState([]);
    const [currHistory, setCurrHistory] = useState<HISTORY>(new HISTORY());
    const [showDetail, setShowDetail] = useState(false);
    const [timer, setTimer] = useState<any>();

    async function fnGetHistories(_address: string, showLoading = true) {
        if (showLoading) {
            setLoading(true);
        }

        getHistories(_address).then(res => {
            setLoading(false);
            // eslint-disable-next-line array-callback-return
            res.data.map((history: HISTORY) => {
                // eslint-disable-next-line radix
                const typeId = parseInt(history.tokenId.toString().substring(0, 1));
                // eslint-disable-next-line radix
                const classId = parseInt(history.tokenId.toString().substring(1, 4)) % 1000;
                const filters = nftCoverImages.filter(nft => {
                    return (
                        // eslint-disable-next-line radix
                        parseInt(nft.address) === classId &&
                        NFT_TYPE_VALUE[nft.type] === typeId.toString()
                    );
                });
                if (filters.length) {
                    // eslint-disable-next-line no-param-reassign
                    history.name = filters[0].name;
                }
                return history;
            });
            setHistories(res.data || []);
            const progress = res.data.filter((history: { status: TxStatus; }) => history.status === TxStatus.PENDING);
            if (progress.length) {
                const _timer = setTimeout(() => {
                    fnGetHistories(_address, false);
                }, 10000);
                setTimer(_timer);
            } else {
                clearTimeout(timer);
            }
        });
    }

    async function fnGetUnipassHistories(_address: string, showLoading = true) {
        if (showLoading) {
            setLoading(true);
        }

        const res = await getUnipassHistories(_address);
        const _histories = res.data.map((history: any) => {
            const _history: HISTORY = {
                type: 'NFT bridge',
                name: '',
                txHash: history.to_chain_tx_hash,
                fromTxHash: history.from_chain_tx_hash,
                from: history.from_chain_address,
                to: history.to_chain_address,
                tokenId: 0,
                timestamp: Math.round(history.completed_at / 1000),
                contract: '',
                transferType: TransferType.BRIDGE,
                status: history.status,
                submittedAt: Math.round(history.submitted_at / 1000),
                nfts: history.tokens
            };
            return _history;
        });
        const _res = await getUnipassCkbHistories(_address);
        const _historiesCkb = _res.data.map((history: any) => {
            const _history: HISTORY = {
                type: history.from === _address ? 'CKB send' : 'CKB receive',
                name: '',
                txHash: history.txHash,
                fromTxHash: '',
                from: history.from,
                to: history.to,
                tokenId: 0,
                timestamp: history.timestamp,
                contract: '',
                transferType: TransferType.TRANSFER,
                status: history.status,
                submittedAt: history.submittedAt,
                amount: history.amount
            };
            return _history;
        });
        setLoading(false);
        const historiesArr = _histories
            .concat(_historiesCkb)
            .sort((a: { submittedAt: number }, b: { submittedAt: number }) => {
                return b.submittedAt - a.submittedAt;
            });
        setHistories(historiesArr);
        const progress = historiesArr.filter((history: any) => history.status === 'In Progress');
        if (progress.length) {
            const _timer = setTimeout(() => {
                fnGetUnipassHistories(_address, false);
                updateBalance();
            }, 10000);
            setTimer(_timer);
        } else {
            clearTimeout(timer);
        }
    }

    useImperativeHandle(ref, () => {
        return {
            fnGetUnipassHistories,
            fnGetHistories
        };
    });

    useEffect(() => {
        if (!state.currentAddress || !state.loginWalletType) return;
        if (state.loginWalletType !== LoginWalletType.UNIPASS_V3) {
            fnGetHistories(state.currentAddress);
        } else {
            console.log('fnGetUnipassHistories');
            fnGetUnipassHistories(state.currentAddress);
        }
    }, [state.currentAddress, state.loginWalletType]);

    useEffect(() => {
        return () => {
            // eslint-disable-next-line no-unused-expressions
            timer && clearTimeout(timer);
        };
    });

    function showHistoryDetail(history: HISTORY) {
        setCurrHistory(history);
        document.body.style.overflow = 'hidden';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dom: any = document.getElementsByClassName('header-container').item(0);
        dom.style.zIndex = 0;
        setShowDetail(true);
    }

    return (
        <div className="wallet-tx-container">
            <div className="wallet-tx-header flex-align">
                <div className="tx-title">TRANSACTION RECORD</div>
            </div>

            <div className="wallet-tx-content">
                <div className="tx-tabs flex-align">
                    {state.loginWalletType !== LoginWalletType.UNIPASS_V3 && (
                        <div className="tx-tab index">NFT ID</div>
                    )}
                    <div className="tx-tab type">Type</div>
                    <div className="tx-tab date">Timestamp</div>
                    <div className="tx-tab status">Status</div>
                    {state.windowWidth !== 375 && <div className="tx-tab number">TX</div>}
                </div>
                <div className="tx-histories">
                    {histories.map((history, index) => (
                        <HistoryItem
                            key={histories.length - 1 - index}
                            address={state.currentAddress}
                            loginWalletType={state.loginWalletType as LoginWalletType}
                            history={history}
                            showHistoryDetail={showHistoryDetail}
                            showTx={state.windowWidth !== 375}
                        ></HistoryItem>
                    ))}
                </div>
            </div>
            <HistoryDetail
                show={showDetail}
                address={state.currentAddress}
                history={currHistory}
                loginWalletType={state.loginWalletType as LoginWalletType}
                close={() => {
                    setShowDetail(false);
                    document.body.style.overflow = 'auto';
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const dom: any = document.getElementsByClassName('header-container').item(0);
                    dom.style.zIndex = 99;
                }}
            ></HistoryDetail>
        </div>
    );
}

export default forwardRef(WalletTx);
