import React, { TouchEventHandler, useContext, useEffect, useState } from "react";
import './index.less';
import { DataContext, isMobile, updateBodyOverflow } from "../../../utils/utils";
import { Tooltip } from "antd";
import { nervapeApi } from "../../../api/nervape-api";
import PointMapDetail from "./detail";
import useDebounce from "../../../hooks/useDebounce";

export class PointMapItem {
    point_x: number = 0;
    point_y: number = 0;
    address?: string;
    url?: string;
    epoch?: number;
    open?: boolean = false;
}
const width = 3464;
const height = 3464;

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
    const [mobile, setIsMobile] = useState(false);
    const [isMove, setIsMove] = useState(false);
    const [showPointDetail, setShowPointDetail] = useState(false);
    const [pointDetail, setPointDetail] = useState<PointMapItem>(new PointMapItem());

    const initDebounce = useDebounce(async () => {
        initData();
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

    const fnSnookyNacpList = async () => {
        let res = await nervapeApi.fnSnookyNacpList();
        setNacps(res);
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
        <div className="point-map-container">
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
                                                                background: state.currentAddress.toLocaleLowerCase() == _p.address ? '#6FBA80' : '#C6A83D'
                                                            }}>{state.currentAddress.toLocaleLowerCase() == _p.address ? 'owned by me' : 'occupied'}</div>

                                                            <div className="epoch-title">Epoch</div>
                                                            <div className="epoch">{_p.epoch}</div>

                                                            <div className="owner-title">Block Owner</div>
                                                            <div className="owner">{_p.address}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }}>
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
                                                setPointDetail(_p);
                                                setShowPointDetail(true);
                                            }}
                                            className="point-item set transition" key={`${index}-${_i}`}>
                                            <img src={_p.url} className="cover-image" alt="" data-id={`${index}-${_i}`} />
                                        </div>
                                    </Tooltip>
                                );
                            }

                            return (
                                <div className="point-item" key={`${index}-${_i}`}>
                                    {_p.url && <img src={_p.url} className="cover-image" alt="" />}
                                </div>
                            );
                        })
                    })}
                </div>
            </div>

            <PointMapDetail
                show={showPointDetail}
                point={pointDetail}
                close={() => {
                    setShowPointDetail(false);
                }}></PointMapDetail>
        </div>
    );
}
