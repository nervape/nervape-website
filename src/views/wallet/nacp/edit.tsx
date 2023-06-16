import React, { useContext, useEffect, useState } from "react";
import './edit.less';
import { nervapeApi } from "../../../api/nervape-api";
import { NacpAsset, NacpCategory, NacpPhase } from "../../../nervape/nacp";
import { NacpCategoryIcons, NacpPhaseLockedIcon, NacpPhaseOpenIcon } from "../../../nervape/svg";
import { DataContext } from "../../../utils/utils";

export default function NacpEdit(props: any) {
    const { state, dispatch } = useContext(DataContext);

    const [phases, setPhases] = useState<NacpPhase[]>([]);
    const [selectPhase, setSelectPhase] = useState(0);
    const [selectCategory, setSelectCategory] = useState('');
    const [currCategory, setCurrCategory] = useState<NacpCategory>();
    const [assets, setAssets] = useState<NacpAsset[]>([]);
    const [assetsHistoryStack, setAssetsHistoryStack] = useState<NacpAsset[]>([]);
    const [selectedAssets, setSelectedAssets] = useState<NacpAsset[]>([]);

    async function fnGetPhases() {
        const res = await nervapeApi.fnGetPhases();
        // 处理 categories
        setPhases(res);
    }

    async function fnGetAssets(category: string) {
        const res = await nervapeApi.fnGetAssets(category, state.currentAddress);
        setAssets(res);
    }

    async function chooseAsset(asset: NacpAsset) {
        if (!currCategory) return;

        // 更新 selectedAssets
        let _selectedAssets: NacpAsset[] = JSON.parse(JSON.stringify(selectedAssets));
        _selectedAssets = _selectedAssets.filter(_asset => {
            // 检查 asset.excludes
            if (asset.excludes && asset.excludes.length) {
                const filters = asset.excludes.filter(e => e._id == _asset._id);
                if (filters.length > 0) return false;
            }
            // 检查 所属分类的 excludes
            if (asset.category?.excludes && asset.category?.excludes.length) {
                const filters = asset.category.excludes.filter(e => e._id == _asset.category?._id);
                if (filters.length > 0) return false;
            }

            // 特殊约定 1. mask_only/headwear
            if ((asset.is_mask_only && _asset.category?.name == 'Headwear')
                || (asset.category?.name == 'Headwear' && _asset.is_mask_only)) {
                return false;
            }

            // 特殊约定 2. headwear -- front/back
            return true;
        });

        const selectedAssetsIds = _selectedAssets.map(s => s._id);

        const _phases = JSON.parse(JSON.stringify(phases));

        _phases.map((phase: NacpPhase) => {
            phase.categories.map(_category => {
                if (_category._id == currCategory._id) {
                    _category.selected = asset;
                    setCurrCategory(_category);
                } else {
                    if (!selectedAssetsIds.includes(_category.selected?._id || '')) {
                        _category.selected = undefined;
                    }
                }
                return _category;
            })
            return phase;
        });

        setPhases(_phases);
    }

    async function openOrCloseCollection(asset: NacpAsset) {
        const _assets: NacpAsset[] = JSON.parse(JSON.stringify(assets));
        _assets.map(s => {
            if (asset.is_collection && s._id == asset._id) {
                s.show_collection = !s.show_collection;
            } else {
                s.show_collection = false;
            }

            return s;
        })

        setAssets(_assets);
    }

    useEffect(() => {
        fnGetPhases();
    }, []);

    useEffect(() => {
        if (!currCategory?._id) return;
        fnGetAssets(currCategory._id);
    }, [currCategory?._id]);

    useEffect(() => {
        if (!phases) return;

        let _selectedAssets: NacpAsset[] = [];
        phases.map(phase => {
            phase.categories.map(category => {
                if (category.selected) {
                    _selectedAssets.push(category.selected);
                }
            })
        })
        setSelectedAssets(_selectedAssets);
    }, [phases]);

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
                    <div className="left-content">
                        <div className="content-container">
                            <div className="phases-tabs flex-align">
                                {phases.map((phase, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={`cursor transation phase-tab ${index == selectPhase && 'selected'}`}
                                            onClick={() => {
                                                if (index == selectPhase) return;
                                                setSelectPhase(index);
                                                setSelectCategory('');
                                                setCurrCategory(undefined);
                                            }}>
                                            {phase.status !== 1 ? <NacpPhaseLockedIcon></NacpPhaseLockedIcon> : <NacpPhaseOpenIcon></NacpPhaseOpenIcon>}
                                            <div className="transation name">{phase.name}</div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="nacp-camera-content">
                                {selectedAssets.length > 0 ? (
                                    <div className="nacp-assets">
                                        {selectedAssets.map((asset, index) => {
                                            return (
                                                <div key={index} className="nacp-asset" style={{ zIndex: asset.category?.level }}>
                                                    <img src={asset.url} alt="" />
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </div>

                            <div className="phase-name-operate flex-align">
                                <div className="name">{phases[selectPhase]?.name}</div>
                                <div className="btn-groups flex-align">
                                    <button className="cursor btn randomize-btn">Randomize</button>
                                    <button className="cursor btn undo-btn">Undo</button>
                                    <button className="cursor btn redo-btn">Redo</button>
                                </div>
                            </div>
                            <div className="phase-categories flex-align">
                                {phases[selectPhase]?.categories.map((category, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={`cursor transation phase-category ${selectCategory == category._id && 'selected'}`}
                                            onClick={() => {
                                                setSelectCategory(category._id);
                                                setCurrCategory(category);
                                            }}>
                                            {NacpCategoryIcons.get(category.name)}
                                            <div className="select-asset-img">
                                                {category.selected && (
                                                    <img src={category.selected.thumb_url} />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="right-content">
                        {currCategory && (
                            <>
                                <div className="curr-category flex-align">
                                    {NacpCategoryIcons.get(currCategory?.name)}
                                    <div className="category-name">{currCategory?.name}</div>
                                </div>

                                <div className="assets flex-align">
                                    {assets.map((asset, index) => {
                                        let devStyle = {}
                                        let filters: NacpAsset[] = [];
                                        let selected: boolean = asset._id == currCategory.selected?._id;

                                        if (asset.is_collection) {
                                            // 是否选中集合中的asset
                                            filters = asset.includes?.filter(a => a._id == currCategory.selected?._id) || [];
                                            selected = selected || filters.length > 0;
                                            const i = index % 4;
                                            const offsetPx = 12 * i;
                                            const extraPx = selected ? `${6 * i + 4}px` : '1px';

                                            devStyle = { left: `calc(-100% * ${i} - ${extraPx} - ${offsetPx}px)` }
                                        }
                                        return (
                                            <div
                                                key={index}
                                                className={`cursor transation asset-item ${selected && 'selected'}`}
                                                onClick={() => {
                                                    // 使用 asset 逻辑
                                                    if (!asset.is_collection) {
                                                        chooseAsset(asset);
                                                    }

                                                    openOrCloseCollection(asset);
                                                }}>
                                                <img src={filters.length ? filters[0].thumb_url : asset.thumb_url} alt="AssetImg" className="asset-img" />
                                                {asset.is_collection && asset.show_collection && (
                                                    <div
                                                        className={`asset-collection ${selected && 'selected'}`}
                                                        style={devStyle}
                                                        onClick={() => {
                                                            openOrCloseCollection(asset);
                                                        }}>
                                                        <div className="collection-imgs flex-align">
                                                            {asset.includes?.map((_asset, _index) => {
                                                                return (
                                                                    <div
                                                                        className={`cursor transation collection-item ${_asset._id == currCategory.selected?._id && 'selected'}`}
                                                                        key={_index}
                                                                        onClick={e => {
                                                                            chooseAsset(_asset);
                                                                            e.stopPropagation();
                                                                        }}>
                                                                        <img src={_asset.thumb_url} alt="CollectionImg" className="collection-img" />
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
