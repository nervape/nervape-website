import React, { useContext, useEffect, useRef, useState } from "react";
import './edit.less';
import { nervapeApi } from "../../../api/nervape-api";
import { NacpAsset, NacpCategory, NacpMetadata, NacpPhase, UpdateMetadataForm } from "../../../nervape/nacp";
import { NacpCategoryIcons, NacpPhaseLockedIcon, NacpPhaseOpenIcon } from "../../../nervape/svg";
import { DataContext, updateBodyOverflow } from "../../../utils/utils";
import { toPng } from 'html-to-image';
import DiscardPopup from "./discard";
import { Types } from "../../../utils/reducers";
import { SiweMessage } from "siwe";
import { useSignMessage } from "wagmi";
import { godWoken } from "../../../utils/Chain";
import { v4 as uuidv4 } from 'uuid';

let touchYStart = 0;

export default function NacpEdit(props: { show: boolean; setShowNacpEdit: Function; setShowSaveSuccess: Function; nacp: NacpMetadata; }) {
    const { show, setShowNacpEdit, setShowSaveSuccess, nacp } = props;

    const { state, dispatch } = useContext(DataContext);

    const setLoading = (flag: boolean) => {
        dispatch({
            type: flag ? Types.ShowLoading : Types.HideLoading
        })
    }

    const elementRef = useRef(null);
    const coverElementRef = useRef(null);

    const [phases, setPhases] = useState<NacpPhase[]>([]);
    const [selectPhase, setSelectPhase] = useState(0);
    const [selectCategory, setSelectCategory] = useState('');
    const [currCategory, setCurrCategory] = useState<NacpCategory>(new NacpCategory());
    const [assets, setAssets] = useState<NacpAsset[]>([]);
    const [assetsHistoryStack, setAssetsHistoryStack] = useState<NacpAsset[][]>([]);
    const [phaseHistoryStack, setPhaseHistoryStack] = useState<NacpPhase[][]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [selectedAssets, setSelectedAssets] = useState<NacpAsset[]>([]);
    const [showDiscardPopup, setShowDiscardPopup] = useState(false);
    const [isCollectionOpen, setIsCollectionOpen] = useState(false);
    const [isFold, setIsFold] = useState(false);
    const [updateMetadataForm, setUpdateMetadataForm] = useState<UpdateMetadataForm>(new UpdateMetadataForm());

    const [mShowCollection, setMShowCollection] = useState(false);
    const [mCollectionAsset, setMCollectionAsset] = useState<NacpAsset>();

    async function fnGetPhases() {
        const res = await nervapeApi.fnGetPhases();
        // 初始化 history
        setAssetsHistoryStack([]);
        setPhaseHistoryStack([]);
        setHistoryIndex(-1);
        // 处理 categories
        if (state.windowWidth > 375) {
            setCurrCategory(res[0].categories[0]);
            setSelectCategory(res[0].categories[0]._id);
        }

        const _phases = await initNacpAsset(res);
        setPhases(_phases);
    }

    async function initNacpAsset(_phases: NacpPhase[]) {
        let nacpAssets: NacpAsset[] = [];

        nacp?.categories?.forEach(async c => {
            if (c.asset) {
                nacpAssets.push(c.asset);

                _phases.map(p => {
                    p.categories.map(_c => {
                        if (_c._id == c._id) {
                            _c.selected = c.asset;
                        }

                        return _c;
                    });

                    return p;
                })
            }
        })
        console.log('nacpAssets', nacpAssets);
        setSelectedAssets(nacpAssets);
        return _phases;
    }

    async function fnGetAssets(category: string) {
        if (phases[selectPhase]?.status !== 1) return;
        setIsCollectionOpen(false);

        const res = await nervapeApi.fnGetAssets(category, state.currentAddress);
        setAssets(res);
    }

    async function chooseAsset(asset: NacpAsset) {
        if (!currCategory) return;
        console.log(asset);

        // 更新 selectedAssets
        let _selectedAssets: NacpAsset[] = JSON.parse(JSON.stringify(selectedAssets));
        console.log('_selectedAssets', _selectedAssets);
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
            // 特殊约定 3. eyewear as mask
            if (asset.eyewear_as_mask && asset.category?.eyewear_as_mask_excludes && asset.category?.eyewear_as_mask_excludes?.length) {
                const filters = asset.category?.eyewear_as_mask_excludes.filter(e => e._id == _asset.category?._id);
                if (filters.length > 0) return false;
            }

            if (asset.category?.excludes_eyewear_as_mask) {
                if (_asset.eyewear_as_mask) return false;
            }

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

        let __selectedAssets: NacpAsset[] = [];
        _phases.map(phase => {
            phase.categories.map(category => {
                if (category.selected) {
                    __selectedAssets.push(category.selected);
                }
            })
        });

        updateHistoryStack(__selectedAssets, _phases);

        setSelectedAssets(__selectedAssets);

        setPhases(_phases);
    }

    async function fnUpdateCurrCategory(_phases: NacpPhase[]) {
        if (!currCategory) return;

        let _curr = JSON.parse(JSON.stringify(currCategory));

        _phases.map((phase: NacpPhase) => {
            phase.categories.map(_category => {
                if (_category._id == currCategory._id) {
                    _curr.selected = _category.selected;
                    setCurrCategory(_curr);
                }
                return _category;
            })
            return phase;
        });
    }

    async function openOrCloseCollection(asset: NacpAsset) {
        const _assets: NacpAsset[] = JSON.parse(JSON.stringify(assets));
        let is_open = false;
        _assets.map(s => {
            if (asset.is_collection && s._id == asset._id) {
                s.show_collection = !s.show_collection;
            } else {
                s.show_collection = false;
            }

            if (s.show_collection) is_open = true;

            return s;
        })

        setMCollectionAsset(asset);
        setIsCollectionOpen(is_open);
        setAssets(_assets);
    }

    async function updateHistoryStack(_assets: NacpAsset[], _phases: NacpPhase[]) {
        if (!_assets.length) return;

        let a = JSON.parse(JSON.stringify(assetsHistoryStack));
        let p = JSON.parse(JSON.stringify(phaseHistoryStack));

        // 修改 asset 发生在 undo/redo 时
        if (historyIndex + 1 !== assetsHistoryStack.length) {
            a.splice(historyIndex + 1, assetsHistoryStack.length - historyIndex);
            a.push(_assets);
            setHistoryIndex(a.length - 1);
            setAssetsHistoryStack(a);

            p.splice(historyIndex + 1, phaseHistoryStack.length - historyIndex);
            p.push(_phases);
            setPhaseHistoryStack(p);
        } else {
            a.push(_assets);
            setHistoryIndex(a.length - 1);
            setAssetsHistoryStack(a);

            p.push(_phases);
            setPhaseHistoryStack(p);
        }
    }

    async function fnOperateBack() {
        setSelectedAssets(assetsHistoryStack[historyIndex - 1]);
        setHistoryIndex(historyIndex - 1);
        setPhases(phaseHistoryStack[historyIndex - 1]);
        fnUpdateCurrCategory(phaseHistoryStack[historyIndex - 1]);

        console.log('assetsHistoryStack', assetsHistoryStack);
    }

    async function fnOperateNext() {
        setSelectedAssets(assetsHistoryStack[historyIndex + 1]);
        setHistoryIndex(historyIndex + 1);
        setPhases(phaseHistoryStack[historyIndex + 1]);
        fnUpdateCurrCategory(phaseHistoryStack[historyIndex + 1]);

        console.log('assetsHistoryStack', assetsHistoryStack);
    }

    async function fnRandomizeAssets() {
        let _phases = JSON.parse(JSON.stringify(phases));
        let _assets: NacpAsset[] = [];

        const _selectedAssets = JSON.parse(JSON.stringify(selectedAssets));
        _assets = _assets.concat(_selectedAssets);
        // 1. 随机排序当前 Phase category
        const _categories = JSON.parse(JSON.stringify(phases[selectPhase].categories));
        _categories.sort(() => { return Math.random() - 0.5 });
        // 2.按顺序随机当前category asset
        await Promise.all(
            _categories.map(async category => {
                const __assets = await nervapeApi.fnGetAssets(category._id, state.currentAddress);
                if (!__assets.length) return;

                const randomAsset: NacpAsset = __assets[Math.floor((Math.random() * __assets.length))];

                if (!_assets.length) {
                    _assets.push(randomAsset);

                    _phases = await fnUpdatePhaseCategorySelected(_assets, _phases, randomAsset);
                } else {
                    // 3.顺序判断其他asset是否可选
                    // 检查 asset.excludes
                    let is_right = true;

                    _assets.forEach(asset => {
                        if (asset.excludes && asset.excludes.length) {
                            const filters = asset.excludes.filter(e => e._id == randomAsset._id);
                            if (filters.length > 0) is_right = false;
                        }
                        // 检查 所属分类的 excludes
                        if (asset.category?.excludes && asset.category?.excludes.length) {
                            const filters = asset.category.excludes.filter(e => e._id == randomAsset.category?._id);
                            if (filters.length > 0) is_right = false;
                        }

                        // 特殊约定 1. mask_only/headwear
                        if ((asset.is_mask_only && randomAsset.category?.name == 'Headwear')
                            || (asset.category?.name == 'Headwear' && randomAsset.is_mask_only)) {
                            return is_right = false;
                        }

                        // 特殊约定 2. headwear -- front/back
                        // 特殊约定 3. eyewear as mask
                        if (asset.eyewear_as_mask && asset.category?.eyewear_as_mask_excludes && asset.category?.eyewear_as_mask_excludes?.length) {
                            const filters = asset.category?.eyewear_as_mask_excludes.filter(e => e._id == randomAsset.category?._id);
                            if (filters.length > 0) is_right = false;
                        }

                        if (asset.category?.excludes_eyewear_as_mask) {
                            if (randomAsset.eyewear_as_mask) is_right = false;
                        }
                    });

                    if (is_right) {
                        _assets.push(randomAsset);

                        _phases = await fnUpdatePhaseCategorySelected(_assets, _phases, randomAsset);
                    }
                }
            })
        )

        updateHistoryStack(_assets, _phases);
        setPhases(_phases);
        // 得到最终随机assets
    }

    useEffect(() => {
        let _assets: NacpAsset[] = [];
        phases.map(p => {
            p.categories.map(c => {
                if (c.selected) {
                    _assets.push(c.selected);
                }
            })
        })

        setSelectedAssets(_assets);
    }, [phases]);

    async function fnUpdatePhaseCategorySelected(_assets: NacpAsset[], _phases: NacpPhase[], asset: NacpAsset) {
        const selectedAssetsIds = _assets.map(s => s._id);
        _phases.map((phase: NacpPhase) => {
            phase.categories.map(_category => {
                if (_category._id == asset.category?._id) {
                    _category.selected = asset;
                } else {
                    if (!selectedAssetsIds.includes(_category.selected?._id || '')) {
                        _category.selected = undefined;
                    }
                }

                if (_category._id == currCategory._id) {
                    setCurrCategory(_category);
                }
                return _category;
            })
            return phase;
        });

        return _phases;
    }

    const domain = window.location.host;
    const origin = window.location.origin;

    const { signMessageAsync, error } = useSignMessage();

    const createSiweMessage = async (_address: string, statement: string) => {
        const res = await nervapeApi.fnGetNonce();

        const filename = res.fields.key + uuidv4();
        res.fields.key = filename + '-test.png';
        res.fields.thumb_key = filename + '-thumb-test.png';
        res.fields.success_action_status = "200";

        const url = res.fields.host + res.fields.key;
        const thumb_url = res.fields.host + res.fields.thumb_key;

        await htmlToImageConvert(res, elementRef, 'key');
        await htmlToImageConvert(res, coverElementRef, 'thumb_key');

        const message = new SiweMessage({
            domain,
            address: _address,
            statement,
            uri: origin,
            version: '1',
            chainId: godWoken.id,
            nonce: res.nonce
        });

        return {
            message: message.prepareMessage(),
            url,
            thumb_url
        };
    }

    const signInWithEthereum = async () => {
        setLoading(true);

        const { message, url, thumb_url } = await createSiweMessage(state.currentAddress, 'Sign in to update Nacp Metadata.');

        const signature = await signMessageAsync({ message });

        const _metadata = JSON.parse(JSON.stringify(updateMetadataForm));
        _metadata.url = url;
        _metadata.thumb_url = thumb_url;
        _metadata.attributes = selectedAssets.map(s => {
            return {
                asset_id: s._id
            }
        });

        const res = await nervapeApi.fnSendForVerify(message, signature, _metadata);

        setLoading(false);

        setShowSaveSuccess();
    }

    function dataURItoBlob(dataURI: string) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        //New Code
        return new Blob([ab], { type: mimeString });
    }

    // 生成文件并上传
    const htmlToImageConvert = async (signData: { fields: any; url: string; }, ref: any, key: string) => {
        delete signData.fields.host;

        await toPng(ref.current as unknown as HTMLElement, { cacheBust: false, fontEmbedCSS: '', style: { top: '0px' } });
        await toPng(ref.current as unknown as HTMLElement, { cacheBust: false, fontEmbedCSS: '', style: { top: '0px' } });
        await toPng(ref.current as unknown as HTMLElement, { cacheBust: false, fontEmbedCSS: '', style: { top: '0px' } });

        const dataUrl = await toPng(ref.current as unknown as HTMLElement, { cacheBust: false, fontEmbedCSS: '', style: { top: '0px' } });

        const formData = new FormData();
        formData.append('bucket', signData.fields.bucket);
        formData.append('X-Amz-Algorithm', signData.fields['X-Amz-Algorithm']);
        formData.append('X-Amz-Credential', signData.fields['X-Amz-Credential']);
        formData.append('X-Amz-Date', signData.fields['X-Amz-Date']);
        formData.append('X-Amz-Security-Token', signData.fields['X-Amz-Security-Token']);
        formData.append('Policy', signData.fields['Policy']);
        formData.append('X-Amz-Signature', signData.fields['X-Amz-Signature']);
        formData.append('key', signData.fields[key]);
        formData.append('success_action_status', signData.fields['success_action_status']);
        formData.append('file', dataURItoBlob(dataUrl));

        nervapeApi.NacpFileUpload(signData.url, formData);
    }

    useEffect(() => {
        if (!nacp) return;

        fnGetPhases();

        setUpdateMetadataForm({
            tokenId: nacp.id,
            url: '',
            thumb_url: '',
            attributes: []
        });
    }, [nacp]);

    useEffect(() => {
        if (!currCategory?._id) return;
        fnGetAssets(currCategory._id);
    }, [currCategory?._id]);

    if (!phases || !phases.length) return <></>;

    return (
        <div className={`wallet-nacp-edit-container popup-container ${show && 'show'}`}>
            <div
                className={`wallet-nacp-edit-content transition ${isFold && 'fold'}`}
                onTouchStart={e => {
                    if (state.windowWidth <= 375) {
                        touchYStart = e.changedTouches[0].clientY;
                    }
                }}
                onTouchEnd={e => {
                    if (state.windowWidth <= 375) {
                        const end = e.changedTouches[0].clientY;
                        if (end - touchYStart > 100) {
                            setIsFold(false);
                        }
                    }
                }}>
                <div className="edit-header flex-align">
                    <div className="title">{nacp.name}</div>
                    <div className="btn-groups flex-align">
                        <button className="cursor btn save-btn" onClick={signInWithEthereum}>Save</button>
                        <button className="cursor btn discard-btn" onClick={() => {
                            setShowDiscardPopup(true);
                        }}>Discard</button>
                    </div>
                </div>
                <div className={`edit-content ${state.windowWidth > 375 && 'flex-align'}`}>
                    <div className="left-content">
                        <div className="content-container">
                            <div className="phases-tabs flex-align">
                                {phases.map((phase, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={`cursor transition phase-tab ${index == selectPhase && 'selected'}`}
                                            onClick={() => {
                                                if (index == selectPhase) return;
                                                setSelectPhase(index);
                                                setSelectCategory(phases[index].categories[0]._id);
                                                setCurrCategory(phases[index].categories[0]);
                                            }}>
                                            {phase.status !== 1 ? <NacpPhaseLockedIcon></NacpPhaseLockedIcon> : <NacpPhaseOpenIcon></NacpPhaseOpenIcon>}
                                            <div className="transition name">{phase.name}</div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className={`nacp-camera-content transition ${isFold && 'fold'}`}>
                                {selectedAssets.length > 0 ? (
                                    <div className={`nacp-assets transition ${selectPhase == 1 && 'scale'}`}>
                                        {selectedAssets.map((asset, index) => {
                                            return (
                                                <div key={index} className="nacp-asset" style={{ zIndex: asset.is_headwear_back ? asset.category?.headwear_back_level : asset.category?.level }}>
                                                    <img crossOrigin="anonymous" src={asset.url} alt="" />
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <></>
                                )}

                                {selectedAssets.length > 0 ? (
                                    <div className={`nacp-assets-save transition`} style={{ width: '500px', height: '500px' }} ref={elementRef}>
                                        {selectedAssets.map((asset, index) => {
                                            return (
                                                <div key={index} className="nacp-asset" style={{ zIndex: asset.is_headwear_back ? asset.category?.headwear_back_level : asset.category?.level }}>
                                                    <img crossOrigin="anonymous" src={asset.url} alt="" />
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <></>
                                )}

                                {selectedAssets.length > 0 ? (
                                    <div className={`nacp-assets-save scale transition`} ref={coverElementRef}>
                                        {selectedAssets.map((asset, index) => {
                                            return (
                                                <div key={index} className="nacp-asset" style={{ zIndex: asset.is_headwear_back ? asset.category?.headwear_back_level : asset.category?.level }}>
                                                    <img crossOrigin="anonymous" src={asset.url} alt="" />
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
                                    <button
                                        disabled={phases[selectPhase].status !== 1}
                                        className="cursor btn randomize-btn"
                                        onClick={() => {
                                            fnRandomizeAssets();
                                        }}>Randomize</button>
                                    <button
                                        disabled={assetsHistoryStack.length <= 1 || historyIndex == 0}
                                        className={`cursor btn undo-btn`}
                                        onClick={() => {
                                            fnOperateBack();
                                        }}>Undo</button>
                                    <button
                                        disabled={!assetsHistoryStack.length || historyIndex == assetsHistoryStack.length - 1}
                                        className={`cursor btn redo-btn`}
                                        onClick={() => {
                                            fnOperateNext();
                                        }}>Redo</button>
                                </div>
                            </div>
                            <div className={`phase-categories flex-align ${isFold && 'fold'}`}>
                                {phases[selectPhase]?.categories.map((category, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={`cursor transition phase-category ${selectCategory == category._id && 'selected'}`}
                                            onClick={() => {
                                                setSelectCategory(category._id);
                                                setCurrCategory(category);
                                                if (!isFold) setIsFold(true);
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
                    <div
                        className={`right-content ${!isFold && 'hide'}`}
                        onTouchStart={e => e.stopPropagation()}
                        onTouchEnd={e => e.stopPropagation()}>
                        {phases[selectPhase].status !== 1 ? (
                            <div className="locked-content">
                                <NacpPhaseLockedIcon></NacpPhaseLockedIcon>
                                <div className="locked">Locked</div>
                                <div className="locked-tip">The phase for this asset type is expired.</div>
                            </div>
                        ) : (
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
                                                className={`cursor transition asset-item ${selected && 'selected'} ${(isCollectionOpen && !asset.show_collection) && 'opacity'}`}
                                                onClick={() => {
                                                    if (isCollectionOpen && !asset.show_collection) return;

                                                    // 使用 asset 逻辑
                                                    if (!asset.is_collection) {
                                                        if (selected) return;
                                                        chooseAsset(asset);
                                                    }

                                                    openOrCloseCollection(asset);
                                                }}>
                                                <img src={filters.length ? filters[0].thumb_url : asset.thumb_url} alt="AssetImg" className="asset-img" />
                                                {asset.is_collection && asset.show_collection && state.windowWidth > 375 && (
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
                                                                        className={`cursor transition collection-item ${_asset._id == currCategory.selected?._id && 'selected'}`}
                                                                        key={_index}
                                                                        onClick={e => {
                                                                            if (_asset._id == currCategory.selected?._id) return;
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

            <div className={`popup-container m-collection-assets-content ${state.windowWidth <= 375 && isCollectionOpen && 'show'}`} onClick={() => {
                if (mCollectionAsset)
                    openOrCloseCollection(mCollectionAsset);
            }}>
                <div className={`m-collection-assets transition`}>
                    <div className="collection-imgs flex-align">
                        {mCollectionAsset?.includes?.map((_asset, _index) => {
                            return (
                                <div
                                    className={`cursor transition collection-item ${_asset._id == currCategory.selected?._id && 'selected'}`}
                                    key={_index}
                                    onClick={e => {
                                        if (_asset._id == currCategory.selected?._id) return;
                                        chooseAsset(_asset);
                                        e.stopPropagation();
                                    }}>
                                    <img src={_asset.thumb_url} alt="CollectionImg" className="collection-img" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <DiscardPopup
                close={() => {
                    setShowDiscardPopup(false);
                }}
                show={showDiscardPopup}
                confirm={() => {
                    setShowNacpEdit(false);
                    setShowDiscardPopup(false);
                    updateBodyOverflow(true);
                }}></DiscardPopup>
        </div>
    );
}
