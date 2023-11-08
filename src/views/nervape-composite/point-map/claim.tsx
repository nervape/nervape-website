import React, { useEffect, useState } from "react";
import './claim.less';
import { isMobile, showErrorNotification, updateBodyOverflow } from "../../../utils/utils";
import { Tooltip, message } from "antd";
import { nervapeApi } from "../../../api/nervape-api";
import useDebounce from "../../../hooks/useDebounce";
import { LoginWalletType, WALLET_CONNECT, getJoyIDStorage, setJoyIDStorage } from "../../../utils/Wallet";
import { getCKBCurrentEpoch } from "../../../utils/api";
import EpochHeader from "./epoch-header";
import ClaimOperate from "./claim-operate";

export class PointMapItem {
    point_x: number = 0;
    point_y: number = 0;
    address?: string;
    url?: string;
    epoch?: number;
    open?: boolean = false;
    nacp_id?: number;
}
const width = 3029;
const height = 3029;

export default function ClaimPointMap(props: any) {
    const { show, updateApe, apeInfo, setShowClaimPointMap } = props;

    const [points, setPoints] = useState<PointMapItem[][]>([]);
    const [deltaY, setDeltaY] = useState(1);
    const [offset, setOffset] = useState([0, 0]);
    const [isPointerDown, setIsPointerDown] = useState(false);
    const [lastPointermove, setLastPointermove] = useState({ x: 0, y: 0 });
    const [minScale, setMinScale] = useState(1);
    const [maxScale, setMaxScale] = useState(1);
    const [epoch, setEpoch] = useState(0);
    const [mobile, setIsMobile] = useState(false);
    const [isMove, setIsMove] = useState(false);
    const [selectPoint, setSelectPoint] = useState<{ x: number; y: number; }>();

    const initDebounce = useDebounce(async () => {
        initData();
        fetchEpoch();
    }, 100);

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
                    url: filters.length ? filters[0].url : ''
                }
            }
        }
        console.log(_points);
        setPoints(_points);

        let _scale = 1;

        if (window.innerWidth > window.innerHeight) {
            _scale = (window.innerHeight - 76) / width;
        } else {
            _scale = (window.innerWidth - 76) / height;
        }

        setMinScale(_scale);

        setDeltaY(_scale);
        setOffset([
            -(width - width * _scale) / 2 + (window.innerWidth - width * _scale) / 2,
            -(height - height * _scale) / 2 + (window.innerHeight - height * _scale) / 2]);

        updateBodyOverflow(false);
        setIsMobile(isMobile());
    }

    const fetchEpoch = async () => {
        const _epoch = await getCKBCurrentEpoch();
        console.log("epoch = ", _epoch);
        setEpoch(_epoch);
    }

    const fnSnookyNacpList = async () => {
        let res = await nervapeApi.fnSnookyNacpList();
        console.log(res);
        return res;
    }

    useEffect(() => {
        initDebounce();
    }, []);

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
    const handlePointerCancel = (e) => {
        setIsMove(false);
        if (mobile) return;
        if (isPointerDown) {
            setIsPointerDown(false);
        }
    }

    const handleTouchStart = (e) => {
        if (!mobile) return;

        if (e.touches.length == 2) {

        } else if (e.touches.length == 1) {

        }
    }

    const handleTouchMove = (e) => {
        if (!mobile) return;
    }

    const handleTouchEnd = (e) => {
        if (!mobile) return;
    }

    const handleTouchCancel = (e) => {
        if (!mobile) return;
    }

    return (
        <div className={`claim-point-map-container ${show && 'show'}`}>
            <div className="point-map-content"
                onWheel={(e) => handleScroll(e)}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
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
                            if (_p.address && !mobile) {
                                return (
                                    <div onMouseEnter={(e: any) => {
                                        console.log(e.target.dataset)
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
                                        onClick={() => {
                                        }}
                                        className="point-item set transition" key={`${index}-${_i}`}>
                                        <img src={_p.url} className="cover-image" alt="" data-id={`${index}-${_i}`} />
                                    </div>
                                );
                            }

                            return (
                                <div className="point-item" key={`${index}-${_i}`} onClick={() => {
                                    // 选择空白坐标
                                    console.log(`(${index}, ${_i})`);
                                    setSelectPoint({ x: index, y: _i });
                                }} >
                                    {(selectPoint?.x == index && selectPoint.y == _i) && <img src={apeInfo.url} className="cover-image" alt="" />}
                                </div>
                            );
                        })
                    })}
                </div>
            </div>

            <EpochHeader epoch={epoch}></EpochHeader>
            <ClaimOperate
                close={() => {
                    setShowClaimPointMap(false);
                }}
                confirm={async () => {
                    // 确认选择坐标
                    const res = await nervapeApi.fnSnookyNacpUpdate({ ...apeInfo, point_x: selectPoint?.x, point_y: selectPoint?.y });
                    if (res.code != 0) {
                        showErrorNotification({
                            message: 'Request Error',
                            description: res.message
                        });
                    } else {
                        await updateApe();
                        setShowClaimPointMap(false);
                    }
                }}
                disabled={!selectPoint}></ClaimOperate>
        </div>
    );
}

