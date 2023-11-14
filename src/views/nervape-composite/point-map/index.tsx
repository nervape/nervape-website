import React, { TouchEventHandler, useContext, useEffect, useState } from "react";
import './index.less';
import { DataContext, isMobile, updateBodyOverflow } from "../../../utils/utils";
import { Tooltip } from "antd";
import { nervapeApi } from "../../../api/nervape-api";
import PointMapDetail from "./detail";
import useDebounce from "../../../hooks/useDebounce";
import UserInfo from "./user-info";
import { LoginWalletType, WALLET_CONNECT, clearJoyIDStorage, getJoyIDStorage, setJoyIDStorage } from "../../../utils/Wallet";
import { initConfig, connect } from "@joyid/ckb";
import NacpCreator from "../creator";
import HalloweenInfoPopup from "../creator/info";
import { getCKBCurrentEpochAndTipBlockNumber } from "../../../utils/api";
import EpochHeader from "./epoch-header";
import ClaimPointMap from "./claim";
import { useParams } from "react-router-dom";
import OperatePopup from "../../components/operate-popup";
import { useHalving } from "../../../hooks/useCkbHalving";
import { CONFIG } from "../../../utils/config";

initConfig({
    name: "Nervape",
    network: "mainnet",
    joyidAppURL: "https://app.joy.id",
    logo: "https://www.nervape.com/assets/logo_nervape-6fc05221.svg"
});

export class PointMapItem {
    point_x: number = 0;
    point_y: number = 0;
    address?: string;
    url?: string;
    epoch?: number;
    open?: boolean = false;
    nacp_id?: number;
}

export class TouchStore {
    pageX: any;
    pageY: any;
    pageX2: any;
    pageY2: any;
    originScale: any;
    scale: any;
}

const width = 3029;
const height = 3029;
const preOffset = 1; // 每个格子的间距

export default function PointMap(_props: any) {
    const { state, dispatch } = useContext(DataContext);
    const [points, setPoints] = useState<PointMapItem[][]>([]);
    const [nacps, setNacps] = useState<PointMapItem[]>([]);
    const [deltaY, setDeltaY] = useState(1);
    const [offset, setOffset] = useState([0, 0]);
    const [isPointerDown, setIsPointerDown] = useState(false);
    const [lastPointermove, setLastPointermove] = useState({ x: 0, y: 0 });
    const [minScale, setMinScale] = useState(1);
    const [maxScale, setMaxScale] = useState(1);
    const [epoch, setEpoch] = useState(0);
    const [mobile, setIsMobile] = useState(false);
    const [isMove, setIsMove] = useState(false);
    const [showNacpCreator, setShowNacpCreator] = useState(false);
    const [showPointDetail, setShowPointDetail] = useState(false);
    const [showHalloweenInfo, setShowHalloweenInfo] = useState(false);
    const [pointDetail, setPointDetail] = useState<PointMapItem>(new PointMapItem());
    const [loginInfo, setLoginInfo] = useState<WALLET_CONNECT | null>();
    const [apeInfo, setApeInfo] = useState<PointMapItem>();
    const [showClaimPointMap, setShowClaimPointMap] = useState(false);
    const [transitionActive, setTransitionActive] = useState(false);
    const [originPoint, setOriginPoint] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [showUpdateOperate, setShowUpdateOperate] = useState(false);
    const [hideEpochHeader, setHideEpochHeader] = useState(false);
    const [focusActive, setFocusActive] = useState(false);
    const [activityEnd, setActivityEnd] = useState(false);
    const [startPoint, setStartPoint] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

    const [store] = useState<TouchStore>(new TouchStore());

    const queryParams = new URLSearchParams(window.location.search);
    const nacp_id = queryParams.get("nacp_id");

    const initDebounce = useDebounce(async () => {
        initData();
        fetchEpoch();
        fnGetCkbHalfStatistics();
    }, 100);

    const setPointToCenter = (x: number, y: number) => {
        setFocusActive(true);
        setTransitionActive(true);
        setTimeout(() => {
            setTransitionActive(false);
        }, 300);

        setTimeout(() => {
            setFocusActive(false);
        }, 4500);
        setDeltaY(1);

        setOffset([
            -(100 * y + 50 + y * preOffset) + window.innerWidth / 2,
            -(100 * x + 50 + x * preOffset) + window.innerHeight / 2]);
    }

    const fnGetCkbHalfStatistics = async () => {
        const res = await nervapeApi.fnGetCkbHalfStatistics();
    }

    const initData = async () => {
        let _points: PointMapItem[][] = [];
        const _nacps: PointMapItem[] = await fnSnookyNacpList();

        for (let i = 0; i < 30; i++) {
            for (let j = 0; j < 30; j++) {
                if (!_points[i]) {
                    _points[i] = [];
                }
                const filters = _nacps.filter(nacp => {
                    return nacp.point_x == i && nacp.point_y == j;
                });

                _points[i][j] = {
                    point_x: i,
                    point_y: j,
                    epoch: filters.length ? filters[0].epoch : 0,
                    address: filters.length ? filters[0].address : '',
                    url: filters.length ? filters[0].url : '',
                    nacp_id: filters.length ? filters[0].nacp_id : 0
                }
            }
        }
        setPoints(_points);

        let _scale = 1;

        if (window.innerWidth > window.innerHeight) {
            _scale = (window.innerHeight - 76) / width;
        } else {
            _scale = (window.innerWidth - 76) / height;
        }

        setMinScale(_scale);
        updateBodyOverflow(false);
        setIsMobile(isMobile());

        if (nacp_id) {
            // 查询猴子信息
            const res = await nervapeApi.fnGetSpookyProfile(nacp_id as unknown as number);
            if (res && (res.point_x || res.point_x == 0)) {
                setPointToCenter(res.point_x, res.point_y);
            } else {
                setDeltaY(_scale);
                setOffset([
                    -(width - width * _scale) / 2 + (window.innerWidth - width * _scale) / 2,
                    -(height - height * _scale) / 2 + (window.innerHeight - height * _scale) / 2]);
            }
        } else {
            setDeltaY(_scale);
            setOffset([
                -(width - width * _scale) / 2 + (window.innerWidth - width * _scale) / 2,
                -(height - height * _scale) / 2 + (window.innerHeight - height * _scale) / 2]);
        }
    }

    const fetchEpoch = async () => {
        const { currentEpoch } = await getCKBCurrentEpochAndTipBlockNumber();
        setEpoch(currentEpoch);
    }

    const fnSnookyNacpList = async () => {
        let res = await nervapeApi.fnSnookyNacpList();
        setNacps(res);
        return res;
    }

    const fnGetAddressApe = async (address: string) => {
        const res = await nervapeApi.fnSnookyNacpByAddress(address);
        setApeInfo(res);
    }

    const onConnect = async () => {
        try {
            const authData = await connect();

            setJoyIDStorage({
                type: LoginWalletType.JOYID,
                address: authData.address
            });
            initLogin();
        } catch (error) {
            console.log(error);
        }
    }

    const disconnect = () => {
        setLoginInfo(null);
        clearJoyIDStorage();
    }

    async function initLogin() {
        const _storage = getJoyIDStorage();
        if (!_storage) {
            return;
        }

        const _storageJson: WALLET_CONNECT = JSON.parse(_storage);
        setLoginInfo({
            type: LoginWalletType.JOYID,
            address: _storageJson.address
        });
    }

    useEffect(() => {
        initLogin();
        initDebounce();
        setShowHalloweenInfo(true);

        document.addEventListener('gesturestart', function (event) {
            event.preventDefault();
        });

        return () => {
            document.removeEventListener('gesturestart', function (event) {
                event.preventDefault();
            });
        }
    }, []);

    useEffect(() => {
        if (!loginInfo?.address) return;

        fnGetAddressApe(loginInfo?.address);
    }, [loginInfo]);

    useEffect(() => {
        if (epoch >= 8760) {
            // 活动结束
            setActivityEnd(true);
        }
    }, [epoch]);

    const formatAddress = (address: string) => {
        const subLength = 5;
        const dotStr = '...';
        return `${address.substr(0, subLength)}${dotStr}${address.substr(address.length - subLength, subLength)}`;
    }
    useEffect(() => {
        if (!loginInfo?.address) return;


    }, [loginInfo?.address]);

    const handleScroll = (e: any) => {
        if (mobile) return;
        setIsMove(true);
        let ratio = e.deltaY / 1000;

        const _scale = deltaY * ratio + deltaY;

        if (_scale <= minScale) return;

        setDeltaY(_scale);

        const origin = {
            x: ratio * width * 0.5,
            y: ratio * height * 0.5
        };

        const pX = e.clientX - offset[0];
        const pY = e.clientY - offset[1];

        const ratioX = ratio * pX;
        const ratioY = ratio * pY;

        setOffset([offset[0] - ratioX + origin.x, offset[1] - ratioY + origin.y]);
        setTimeout(() => {
            setIsMove(false);
        }, 500);
    }

    const handlePointerDown = (e) => {
        setIsMove(true);
        if (mobile) return;
        setIsPointerDown(true);
        setLastPointermove({ x: e.clientX, y: e.clientY });
    }

    const handlePointItemDown = (e) => {
        setStartPoint({ x: e.clientX, y: e.clientY });
    }

    const handlePointerMove = (e) => {
        if (mobile) return;
        if (isPointerDown) {
            const current1 = { x: e.clientX, y: e.clientY };
            let diff = { x: 0, y: 0 };
            diff.x = current1.x - lastPointermove.x;
            diff.y = current1.y - lastPointermove.y;
            setLastPointermove({ x: current1.x, y: current1.y });

            setOffset([offset[0] + diff.x, offset[1] + diff.y]);
        }
    }
    const handlePointerUp = (e) => {
        setIsMove(false);
        if (mobile) return;
        if (isPointerDown) {
            setIsPointerDown(false);
        }
    }

    const handlePointItemUp = (e, item) => {
        if (startPoint.x == e.clientX && startPoint.y == e.clientY) {
            setPointDetail(item);
            setShowPointDetail(true);
        }
    }
    const handlePointerCancel = (e) => {
        setIsMove(false);
        if (mobile) return;
        if (isPointerDown) {
            setIsPointerDown(false);
        }
    }

    const handleTouchStart = (e) => {
        if (!mobile) return;

        const events1 = e.touches[0];
        const events2 = e.touches[1];

        if (e.touches.length == 2) {
            setIsPointerDown(true);
            store.pageX = events1.pageX;
            store.pageY = events1.pageY;

            if (events2) {
                store.pageX2 = events2.pageX;
                store.pageY2 = events2.pageY;
            }

            store.originScale = store.scale || 1;

            const pointOrigin = getOrigin(events1, events2);
            setOriginPoint(pointOrigin);
        } else if (e.touches.length == 1) {
            setIsPointerDown(true);
            setLastPointermove({ x: events1.pageX, y: events1.pageY });
        }
    }

    const handleTouchMove = (e) => {
        if (!mobile) return;

        const events1 = e.touches[0];
        const events2 = e.touches[1];

        console.log(events1, events2);

        if (e.touches.length == 2) {
            if (events2) {
                if (!store.pageX2) {
                    store.pageX2 = events2.pageX;
                }
                if (!store.pageY2) {
                    store.pageY2 = events2.pageY;
                }

                // 获取坐标之间的距离
                let getDistance = function (start, stop) {
                    //用到三角函数
                    return Math.hypot(stop.x - start.x,
                        stop.y - start.y);
                };
                // 双指缩放比例计算
                let zoom = getDistance({
                    x: events1.pageX,
                    y: events1.pageY
                }, {
                    x: events2.pageX,
                    y: events2.pageY
                }) / getDistance({
                    x: store.pageX,
                    y: store.pageY
                }, {
                    x: store.pageX2,
                    y: store.pageY2
                });
                // 应用在元素上的缩放比例
                let newScale = store.originScale * zoom;
                // 最大缩放比例限制
                if (newScale > 15) {
                    newScale = 15;
                } else if (newScale < minScale) {
                    newScale = minScale;
                }
                let ratio = 0.001;
                const _scale = newScale * ratio + newScale;

                // 记住使用的缩放值
                store.scale = _scale;

                setDeltaY(_scale);

                const origin = {
                    x: ratio * width * 0.5,
                    y: ratio * height * 0.5
                };

                const pX = originPoint.x - offset[0];
                const pY = originPoint.y - offset[1];

                const ratioX = ratio * pX;
                const ratioY = ratio * pY;

                setOffset([offset[0] - ratioX + origin.x, offset[1] - ratioY + origin.y]);
            }
        } else if (e.touches.length == 1) {
            if (isPointerDown) {
                const current1 = { x: events1.pageX, y: events1.pageY };
                let diff = { x: 0, y: 0 };
                diff.x = current1.x - lastPointermove.x;
                diff.y = current1.y - lastPointermove.y;
                setLastPointermove({ x: current1.x, y: current1.y });

                setOffset([offset[0] + diff.x, offset[1] + diff.y]);
            }
        }
    }

    const getOrigin = (first, second) => {
        return {
            x: (first.pageX + second.pageX) / 2,
            y: (first.pageY + second.pageY) / 2
        };
    }

    const handleTouchEnd = (e) => {
        if (!mobile) return;
        if (isPointerDown) {
            setIsPointerDown(false);
        }
    }

    const handleTouchCancel = (e) => {
        if (!mobile) return;
        if (isPointerDown) {
            setIsPointerDown(false);
        }
    }

    const { estimatedDate, hasHalved } = useHalving(1);

    const shareContent = () => {
        const share_link = `https://twitter.com/share?text=Halve Ape Blast creating a Halve Nervape to celebrate @NervosNetwork Halving Event! 🦧 Place it on @Nervapes collaborative canvas to win an NFT of the full canvas! 📷 → &url=${CONFIG.SPOOKY_SHARE_PATH}${apeInfo?.nacp_id}${encodeURIComponent('?v=' + new Date().getTime())}&hashtags=Nervos,NervosHalving,CKB,blockchain,HalveApeBlast,Nervape`;
        window.open(share_link);
    }

    if (activityEnd) return (
        <div className="point-map-container activity-end">
            <div className="activity-end-container">
                <img className="activity-end-image" src="https://nervape-storage.s3.ap-southeast-1.amazonaws.com/album-main/production/e322f946-7a0e-4faa-aafe-8d1b1f6f215d.png" alt="" />
                <div className="title">💀 Spooky Nervapes has met its frightening end.</div>
                <div className="desc">🎃 Hello fellow ghoul, goblin, zombie, Nervape…the Spooky Nervapes Halloween event is over. Don’t despair! We will be holding upcoming events that will let you build your own Nervape in even more terrifying, beautiful, and amazing ways.</div>
                <div>🌕 Please follow us on X <a href="https://twitter.com/nervapes" target="_blank">@Nervapes</a> to keep up to date. </div>
            </div>
        </div>
    )

    return (
        <div className="point-map-container" onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}>
            <div className={`point-map-content ${transitionActive && 'transition'}`}
                onWheel={(e) => handleScroll(e)}
                onPointerCancel={handlePointerCancel}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchCancel}
                style={{
                    transform: `translate(${offset[0]}px, ${offset[1]}px) scale(${deltaY})`,
                    transformOrigin: `50% 50%`
                }}>
                <div className="point-items flex-align">
                    {points.map((point, index) => {
                        return point.map((_p, _i) => {
                            if (_p.address) {
                                if (!mobile) {
                                    return (
                                        <Tooltip
                                            overlayClassName="hover-tooltip"
                                            key={`${index}-${_i}`}
                                            placement={'right'}
                                            open={_p.open && !isMove}
                                            showArrow={false}
                                            title={() => {
                                                return (
                                                    <div className="hover-popup transition">
                                                        <div className="flex-align">
                                                            <div>
                                                                <img src={_p.url} className="hover-image" alt="" />
                                                            </div>

                                                            <div className="hover-right">
                                                                <div className="position-text">{`(${_p.point_x}, ${_p.point_y})`}</div>
                                                                <div className="status" style={{
                                                                    background: loginInfo?.address == _p.address ? '#12A7E3' : '#F2B312'
                                                                }}>{loginInfo?.address == _p.address ? 'My Ape Lives Here' : 'occupied'}</div>

                                                                <div className="epoch-title">CKB Epoch</div>
                                                                <div className="epoch">{_p.epoch}</div>

                                                                <div className="owner-title">Block Owner</div>
                                                                <div className="owner">{formatAddress(_p.address || '')}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }}>
                                            <div onMouseEnter={(e: any) => {
                                                let _points = JSON.parse(JSON.stringify(points));
                                                _points.map((pt, pt_i) => {
                                                    pt.map((_pt, _pt_i) => {
                                                        _pt.open = e.target.dataset.id == `${pt_i}-${_pt_i}`;
                                                        return _pt;
                                                    });

                                                    return pt;
                                                })

                                                setPoints(_points);
                                            }}
                                                onMouseLeave={(e: any) => {
                                                    let _points = JSON.parse(JSON.stringify(points));
                                                    _points.map((pt, pt_i) => {
                                                        pt.map((_pt, _pt_i) => {
                                                            _pt.open = false;
                                                            return _pt;
                                                        });

                                                        return pt;
                                                    })

                                                    setPoints(_points);
                                                }}
                                                onPointerDown={handlePointItemDown}
                                                onPointerUp={(e) => {
                                                    handlePointItemUp(e, _p);
                                                }}
                                                data-id={`${index}-${_i}`}
                                                className={`point-item set transition ${(index + _i) % 2 == 0 && 'dark'}`} key={`${index}-${_i}`}>
                                                {/* 聚焦动画蒙层 */}
                                                {_p.address == apeInfo?.address && (
                                                    <div data-id={`${index}-${_i}`} className={`cover-anim ${focusActive && 'active'}`}></div>
                                                )}
                                                <img src={_p.url} className="cover-image" alt="" data-id={`${index}-${_i}`} />
                                            </div>
                                        </Tooltip>
                                    );
                                }
                                return (
                                    <div
                                        onClick={() => {
                                            setPointDetail(_p);
                                            setShowPointDetail(true);
                                        }}
                                        data-id={`${index}-${_i}`}
                                        className={`point-item set transition ${(index + _i) % 2 == 0 && 'dark'}`} key={`${index}-${_i}`}>
                                        <img src={_p.url} className="cover-image" alt="" data-id={`${index}-${_i}`} />
                                    </div>
                                );
                            }

                            return (
                                <div className={`point-item ${(index + _i) % 2 == 0 && 'dark'}`} data-id={`${index}-${_i}`} key={`${index}-${_i}`}>
                                    {_p.url && <img src={_p.url} data-id={`${index}-${_i}`} className="cover-image" alt="" />}
                                </div>
                            );
                        })
                    })}
                </div>
            </div>
            <UserInfo
                onConnect={onConnect}
                loginInfo={loginInfo as WALLET_CONNECT}
                createApe={() => {
                    setShowNacpCreator(true);
                }}
                formatAddress={formatAddress}
                apeInfo={apeInfo as PointMapItem}
                disconnect={disconnect}
                setPointToCenter={(x: number, y: number) => {
                    setPointToCenter(x, y);
                }}
                updateApe={() => {
                    setShowUpdateOperate(true);
                }}
                shareContent={shareContent}
                claimBlock={() => {
                    setShowClaimPointMap(true);
                }}></UserInfo>
            <PointMapDetail
                show={showPointDetail}
                point={pointDetail}
                loginInfo={loginInfo as WALLET_CONNECT}
                close={() => {
                    setShowPointDetail(false);
                }}
                updateApe={() => {
                    setShowPointDetail(false);
                    setShowUpdateOperate(true);
                }}></PointMapDetail>
            <NacpCreator
                show={showNacpCreator}
                loginInfo={loginInfo}
                setShowNacpCreator={setShowNacpCreator}
                skipStep={async () => {
                    loginInfo?.address && await fnGetAddressApe(loginInfo?.address);
                    await initData();
                    setShowNacpCreator(false);
                }}
                setShowClaimPointMap={(_nacp: PointMapItem) => {
                    setApeInfo(_nacp);
                    setShowNacpCreator(false);
                    setShowClaimPointMap(true);
                }}
                epoch={epoch}
                setHideEpochHeader={setHideEpochHeader}
                setShowHalloweenInfo={setShowHalloweenInfo}></NacpCreator>
            <HalloweenInfoPopup show={showHalloweenInfo} close={() => {
                setShowHalloweenInfo(false);
            }}></HalloweenInfoPopup>

            {!hideEpochHeader && (
                <EpochHeader
                    showNacpCreator={showNacpCreator}
                    epoch={epoch}
                    estimatedDate={estimatedDate as Date}
                    setShowHalloweenInfo={setShowHalloweenInfo}></EpochHeader>
            )}
            <ClaimPointMap
                show={showClaimPointMap}
                setShowClaimPointMap={setShowClaimPointMap}
                apeInfo={apeInfo}
                updateApe={async () => {
                    loginInfo?.address && await fnGetAddressApe(loginInfo?.address);
                    await initData();
                }}
                shareContent={shareContent}
                loginInfo={loginInfo}></ClaimPointMap>
            <OperatePopup
                show={showUpdateOperate}
                title="Updating Your Ape"
                cancelColor="#AB98F4"
                confirmColor="#00C080"
                closeText="Cancel"
                confirmText="New Halve Ape!"
                content="Updating your ape clears the designs of your current ape. Your serial number and block location remain unchanged."
                close={() => {
                    setShowUpdateOperate(false);
                }}
                confirm={async () => {
                    setShowUpdateOperate(false);
                    setShowNacpCreator(true);
                }}></OperatePopup>
        </div>
    );
}

