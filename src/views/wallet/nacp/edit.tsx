import React, { useContext, useEffect, useRef, useState } from "react";
import './edit.less';
import { nervapeApi } from "../../../api/nervape-api";
import { NacpAsset, NacpCategory, NacpMetadata, NacpPhase, NacpPhaseConfig, PhaseLeft, UpdateMetadataForm } from "../../../nervape/nacp";
import { NacpAssetSelected, NacpCategoryIcons, NacpPhaseLeftTime, NacpPhaseLockedIcon, NacpPhaseOpenIcon, NacpSpecialAssetIcons } from "../../../nervape/svg";
import { DataContext, ownerOf, preloadImage, showErrorNotification, updateBodyOverflow } from "../../../utils/utils";
import { toPng } from 'html-to-image';
import DiscardPopup from "./discard";
import { Types } from "../../../utils/reducers";
import { SiweMessage } from "siwe";
import { useSignMessage } from "wagmi";
import { godWoken } from "../../../utils/Chain";
import { v4 as uuidv4 } from 'uuid';
import DiscardIcon from '../../../assets/wallet/nacp/edit/discard.svg';
import FoldIcon from '../../../assets/wallet/nacp/fold_icon.svg';
import SpecialIcon from '../../../assets/wallet/nacp/special.svg';
import BodyViewScaleIcon from '../../../assets/wallet/nacp/body.svg';
import HeadViewScaleIcon from '../../../assets/wallet/nacp/head.svg';
import CategoryLocked from '../../../assets/wallet/nacp/locked.svg';
import lodash from 'lodash';
import useIntervalAsync from "../../../hooks/useIntervalAsync";
import OperatePopup from "../../components/operate-popup";
import RandomIcon from '../../../assets/wallet/nacp/edit/randomize.svg';
import RedoIcon from '../../../assets/wallet/nacp/edit/redo.svg';
import UndoIcon from '../../../assets/wallet/nacp/edit/undo.svg';
import ResetIcon from '../../../assets/wallet/nacp/edit/reset.svg';
import ClearIcon from '../../../assets/wallet/nacp/edit/clear.svg';
import { Tooltip } from "antd";

let touchYStart = 0;

export default function NacpEdit(props: { show: boolean; setShowNacpEdit: Function; setShowSaveSuccess: Function; nacp: NacpMetadata; setLoadingAssets: Function; setProgress: Function; }) {
    const { show, setShowNacpEdit, setShowSaveSuccess, nacp, setLoadingAssets, setProgress } = props;

    const { state, dispatch } = useContext(DataContext);

    const setLoading = (flag: boolean) => {
        dispatch({
            type: flag ? Types.ShowLoading : Types.HideLoading
        })
    }

    const elementRef = useRef(null);
    const cameraContentRef = useRef(null);
    const coverElementRef = useRef(null);
    const assetsRef = useRef(null);
    const rightRef = useRef(null);

    const [phases, setPhases] = useState<NacpPhase[]>([]);
    const [phaseConfig, setPhaseConfig] = useState<NacpPhaseConfig[]>([]);
    const [selectPhase, setSelectPhase] = useState(0);
    const [maxStep, setMaxStep] = useState(15);
    const [selectCategory, setSelectCategory] = useState('');
    const [currCategory, setCurrCategory] = useState<NacpCategory>(new NacpCategory());
    const [assets, setAssets] = useState<NacpAsset[]>([]);
    const [assetsHistoryStack, setAssetsHistoryStack] = useState<NacpAsset[][]>([]);
    const [phaseHistoryStack, setPhaseHistoryStack] = useState<NacpPhase[][]>([]);
    const [assetsHistoryJson, setAssetsHistoryJson] = useState<NacpAsset[]>([]);
    const [phaseHistoryJson, setPhaseHistoryJson] = useState<NacpPhase[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [selectedAssets, setSelectedAssets] = useState<NacpAsset[]>([]);
    const [showDiscardPopup, setShowDiscardPopup] = useState(false);
    const [isCollectionOpen, setIsCollectionOpen] = useState(false);
    const [isFold, setIsFold] = useState(false);
    const [isUploadCount, setIsUploadCount] = useState(2);
    const [isLoadingEnded, setIsLoadingEnded] = useState(false);
    const [isSaveVerify, setIsSaveVerify] = useState(false);
    const [canReset, setCanReset] = useState(false);
    const [showPhaseEndTip, setShowPhaseEndTip] = useState(false);
    const [updateMetadataForm, setUpdateMetadataForm] = useState<UpdateMetadataForm>(new UpdateMetadataForm());
    const [activePhase, setActivePhase] = useState(-1);

    const [viewScale, setViewScale] = useState(false);
    const [mCollectionAsset, setMCollectionAsset] = useState<NacpAsset>();
    const [phaseLefts, setPhaseLefts] = useState<PhaseLeft[]>([]);

    useIntervalAsync(updateNacpStatus, 1000);

    async function updateNacpStatus() {
        if (!phases.length) return;
        const now = new Date().getTime();

        let _phaseLefts: PhaseLeft[] = JSON.parse(JSON.stringify(phaseLefts));

        phases.map((p, i) => {
            if (p.status == 1) {
                setActivePhase(i);

                _phaseLefts[i].countdown = p.end_date - now;
                if (p.end_date - now <= 0) {
                    // 提示弹窗
                    show && setShowPhaseEndTip(true);
                } else {
                    const { text, color } = formatCountdown(p.end_date - now);
                    _phaseLefts[i].countdownStr = text;
                    _phaseLefts[i].countdownColor = color;
                }
            } else {
                _phaseLefts[i].countdown = 0;
                _phaseLefts[i].countdownStr = '';
            }

            return p;
        });

        setPhaseLefts(_phaseLefts);
    }

    function formatCountdown(_countdown: number) {
        if (_countdown < 24 * 60 * 60 * 1000) {
            // 按时分秒格式化
            const hour = Math.floor((_countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minute = Math.floor((_countdown % (1000 * 60 * 60)) / (1000 * 60));
            const second = Math.floor((_countdown % (1000 * 60)) / 1000);

            return {
                text: `${hour < 10 ? ('0' + hour) : hour}:${minute < 10 ? ('0' + minute) : minute}:${second < 10 ? ('0' + second) : second}`,
                color: '#FF5151'
            };
        } else {
            // 按天格式化
            return {
                text: `${Math.ceil(_countdown / (24 * 60 * 60 * 1000))} days`,
                color: '#3BD46F'
            };
        }
    }

    async function fnGetPhases() {
        console.log('fnGetPhases');
        setProgress('0');
        setLoadingAssets(true);
        const res = await nervapeApi.fnGetPhases(state.currentAddress);
        // 初始化 history
        initAssetData();

        const _phases = await initNacpAsset(res);
        setPhases(_phases);

        // 预加载图片
        assetsPreload(_phases);

        const activeIndex = fnGetActivePhaseIndex(_phases);

        initPhaseLefts(_phases);

        setSelectPhase(activeIndex);
        document.body.style.setProperty('--phase-tab-color', phaseConfig[activeIndex].extra_color);
        document.body.style.setProperty('--phase-color', phaseConfig[activeIndex].color);
        const activePhase = _phases[activeIndex];

        // 处理 categories
        if (state.windowWidth > 750) {
            setCurrCategory(activePhase.categories[0]);
            setSelectCategory(activePhase.categories[0]._id);

            if (activePhase.status == 1) {
                fnGetAssets(activePhase.categories[0]._id);
            }
        }
    }

    function initPhaseLefts(_phases: NacpPhase[]) {
        let _lefts: PhaseLeft[] = [];
        _phases.forEach(p => {
            _lefts.push({
                countdown: 0,
                countdownStr: '',
                countdownColor: ''
            });
        });

        setPhaseLefts(_lefts);
    }

    function initAssetData() {
        setAssetsHistoryStack([]);
        setPhaseHistoryStack([]);
        setHistoryIndex(-1);
        setPhases([]);
    }

    function fnGetActivePhaseIndex(_phases: NacpPhase[]) {
        let index = 0;
        let flag = false;

        _phases.forEach((p, i) => {
            if (p.status == 1 && !flag) {
                index = i;
                flag = true;
            }
        });

        return index;
    }

    async function assetsPreload(_phases: NacpPhase[]) {
        let totalLength = 0;
        let currLength = 0;
        let urls: string[] = [];
        _phases.forEach(async _p => {
            _p.categories.forEach(_c => {
                _c.assets.forEach(_a => {
                    urls.push(_a.thumb_url);
                    urls.push(`${_a.url}?v=3`);
                });
            });
        });

        totalLength = urls.length;

        if (currLength == totalLength) {
            setIsLoadingEnded(true);
            setLoadingAssets(false);
        }

        urls.forEach(url => {
            preloadImage(url, () => {
                currLength++;
                setProgress((currLength / totalLength * 100).toFixed(0));
                if (currLength == totalLength) {
                    setIsLoadingEnded(true);
                    setLoadingAssets(false);
                }
            })
        })
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

                            _c.assets.map(a => {
                                if (c.asset?.access_type == "Special" && c.asset._id == a._id) {
                                    a.can_use = true;
                                    a.count = 1;
                                }

                                return a;
                            })
                        }

                        return _c;
                    });

                    return p;
                })
            }
        })
        setSelectedAssets(nacpAssets);
        updateHistoryStack(nacpAssets, _phases);

        return _phases;
    }

    async function fnGetAssets(category: string) {
        if (phases[selectPhase]?.status !== 1) return;
        setIsCollectionOpen(false);

        let _category = phases[selectPhase].categories.filter(c => c._id == category);

        if (!_category.length) return;
        const _assets = lodash.orderBy(_category[0].assets, ['can_use', 'access_type', 'count'], ['desc', 'asc', 'desc']);
        setAssets(_assets);
    }

    async function chooseAsset(asset: NacpAsset | undefined) {
        if (!currCategory) return;

        setCanReset(true);
        // 更新 selectedAssets
        let _selectedAssets: NacpAsset[] = JSON.parse(JSON.stringify(selectedAssets));
        if (asset) {
            _selectedAssets = _selectedAssets.filter(_asset => {
                // 检查 asset.excludes
                if (asset.excludes && asset.excludes.length) {
                    const filters = asset.excludes.filter(e => e._id == _asset._id);
                    if (filters.length) return false;
                }
                // 检查 asset.excludes_categories
                if (asset.excludes_categories && asset.excludes_categories.length) {
                    const filters = asset.excludes_categories.filter(c => c._id == _asset.category?._id);
                    if (filters.length) return false;
                }
                // 检查 所属分类的 excludes
                if (asset.category?.excludes && asset.category?.excludes.length) {
                    const filters = asset.category.excludes.filter(e => e._id == _asset.category?._id);
                    if (filters.length) return false;
                }
                // 检查所属分类的 excludes_assets
                if (asset.category?.excludes_assets && asset.category.excludes_assets.length) {
                    const filters = asset.category.excludes_assets.filter(e => e._id == _asset._id);
                    if (filters.length) return false;
                }
                // 特殊约定 1. mask_only/headwear
                if ((asset.is_mask_only && _asset.category?.name == 'Headwear')
                    || (asset.category?.name == 'Headwear' && _asset.is_mask_only)) {
                    return false;
                }

                // 特殊约定 2. headwear -- front/back
                // 特殊约定 3. eyewear as mask
                if (asset.category?.name == 'Eyewear' && asset.eyewear_as_mask && asset.category?.eyewear_as_mask_excludes && asset.category?.eyewear_as_mask_excludes?.length) {
                    const filters = asset.category?.eyewear_as_mask_excludes.filter(e => e._id == _asset.category?._id);
                    if (filters.length) return false;
                }

                if (asset.category?.excludes_eyewear_as_mask) {
                    if (_asset.category?.name == 'Eyewear' && _asset.eyewear_as_mask) return false;
                }

                return true;
            });
        }

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

        // 最大 maxStep
        if (a.length >= maxStep) {
            a.shift();
            p.shift();
        }

        // 修改 asset 发生在 undo/redo 时
        if (historyIndex + 1 !== a.length) {
            a.splice(historyIndex + 1, a.length - historyIndex);
            a.push(_assets);
            setHistoryIndex(a.length - 1);
            setAssetsHistoryStack(a);

            p.splice(historyIndex + 1, p.length - historyIndex);
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
        setCanReset(true);
        setSelectedAssets(assetsHistoryStack[historyIndex - 1]);
        setHistoryIndex(historyIndex - 1);
        setPhases(phaseHistoryStack[historyIndex - 1]);
        fnUpdateCurrCategory(phaseHistoryStack[historyIndex - 1]);
    }

    async function fnOperateNext() {
        setCanReset(true);
        setSelectedAssets(assetsHistoryStack[historyIndex + 1]);
        setHistoryIndex(historyIndex + 1);
        setPhases(phaseHistoryStack[historyIndex + 1]);
        fnUpdateCurrCategory(phaseHistoryStack[historyIndex + 1]);
    }

    async function fnRandomizeAssets() {
        setCanReset(true);
        let _phases = JSON.parse(JSON.stringify(phases));
        let _assets: NacpAsset[] = [];
        const _categories: NacpCategory[] = JSON.parse(JSON.stringify(phases[selectPhase].categories));
        const _categoryIds = _categories.map(_c => _c._id);

        let _selectedAssets = JSON.parse(JSON.stringify(selectedAssets));
        // 过滤当前已选择的asset是否是当前category
        _selectedAssets = _selectedAssets.filter((_s: NacpAsset) => {
            return !_categoryIds.includes(_s.category?._id || '');
        })
        _assets = _assets.concat(_selectedAssets);
        // 1. 随机排序当前 Phase category
        _categories.sort(() => { return Math.random() - 0.5 });
        // 2.按顺序随机当前category asset
        await Promise.all(
            _categories.map(async category => {
                let _category = phases[selectPhase].categories.filter(c => c._id == category._id);
                const __assets = _category[0].assets.filter(a => a.can_use);

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
                            if (filters.length) is_right = false;
                        }
                        // 检查 所属分类的 excludes
                        if (asset.category?.excludes && asset.category?.excludes.length) {
                            const filters = asset.category.excludes.filter(e => e._id == randomAsset.category?._id);
                            if (filters.length) is_right = false;
                        }

                        // 检查 asset.excludes_categories
                        if (asset.excludes_categories && asset.excludes_categories.length) {
                            const filters = asset.excludes_categories.filter(c => c._id == randomAsset.category?._id);
                            if (filters.length) is_right = false;
                        }

                        // 检查所属分类的 excludes_assets
                        if (asset.category?.excludes_assets && asset.category.excludes_assets.length) {
                            const filters = asset.category.excludes_assets.filter(e => e._id == randomAsset._id);
                            if (filters.length) is_right = false;
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
                            if (filters.length) is_right = false;
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

    async function fnReset() {
        // 清除当前可编辑Phase的assets
        const _phases: NacpPhase[] = JSON.parse(JSON.stringify(phases));
        const canEditPhaseIds = _phases.filter(p => p.status == 1).map(p => p._id);

        const _selectedAssets = JSON.parse(JSON.stringify(selectedAssets));
        _selectedAssets.filter((a: NacpAsset) => {
            if (a.category_name != 'Skin') return true;
            return !canEditPhaseIds.includes(a.category?.phase || '');
        });

        _phases.map(p => {
            p.categories.map(c => {
                if (c.name != 'Skin' && canEditPhaseIds.includes(c.phase || '')) c.selected = undefined;

                return c;
            });

            return p;
        })
        setCanReset(false);
        setSelectedAssets(_selectedAssets);
        setPhases(_phases);
        updateHistoryStack(_selectedAssets, _phases);
        fnUpdateCurrCategory(_phases);
    }

    useEffect(() => {
        if (!phases) return;

        let _assets: NacpAsset[] = [];
        phases.map(p => {
            p.categories.map(c => {
                if (c.selected) {
                    _assets.push(c.selected);
                }
            })
        })

        setSelectedAssets(_assets);

        if (_assets.length == 1) {
            setCanReset(false);
        }

        if (phaseHistoryJson.length <= 0) {
            setAssetsHistoryJson(_assets);
            setPhaseHistoryJson(phases);
        }
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
        // nacp 持有者验证
        setLoading(true);

        if (!await ownerOf(nacp.id, state.currentAddress)) {
            setLoading(false);

            showErrorNotification({
                message: 'Request Error',
                description: 'Sorry! Looks like you’re not the holder of this NACP. You won’t be able to edit or save this NACP.'
            });

            return;
        }

        try {
            const { message, url, thumb_url } = await createSiweMessage(state.currentAddress, 'Sign in to update your NACP metadata.');

            const signature = await signMessageAsync({ message });

            const _metadata = JSON.parse(JSON.stringify(updateMetadataForm));
            _metadata.url = url;
            _metadata.thumb_url = thumb_url;
            _metadata.attributes = selectedAssets.map(s => {
                return {
                    asset_id: s._id
                }
            });

            await nervapeApi.fnSendForVerify(message, signature, _metadata);

            setIsSaveVerify(true);
        } catch {
            setLoading(false);
        }
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

        nervapeApi.NacpFileUpload(signData.url, formData).then(res => {
            setIsUploadCount(isUploadCount => {
                return isUploadCount - 1;
            });
        });
    }

    useEffect(() => {
        console.log(isSaveVerify, isUploadCount)
        if (isSaveVerify && isUploadCount <= 0) {
            setLoading(false);
            setIsSaveVerify(false);
            setShowSaveSuccess();
            initAssetData();
            setIsUploadCount(2);
        }
    }, [isSaveVerify, isUploadCount]);

    useEffect(() => {
        if (!nacp || !show) return;
        setIsLoadingEnded(false);

        fnGetPhases();

        setUpdateMetadataForm({
            tokenId: nacp.id,
            url: '',
            thumb_url: '',
            attributes: []
        });
    }, [nacp, show]);

    useEffect(() => {
        if (nacp && nacp.attributes.length > 1) setCanReset(true);
        else setCanReset(false);
    }, [nacp]);

    useEffect(() => {
        if (!currCategory?._id) return;

        if (currCategory.name == 'Suit' || currCategory.name == 'Mask') {
            document.body.style.setProperty('--nacp-asset-min-height', '83px');
            document.body.style.setProperty('--nacp-asset-offset', '37px');
        } else {
            document.body.style.setProperty('--nacp-asset-min-height', '120px');
            document.body.style.setProperty('--nacp-asset-offset', '0px');
        }

        (rightRef.current as unknown as HTMLElement).scroll({ top: 0, behavior: "smooth" });

        fnGetAssets(currCategory._id);
    }, [currCategory?._id]);

    useEffect(() => {
        setViewScale(selectPhase == 1);
        document.body.style.setProperty('--extra-phase-color', phaseConfig[selectPhase]?.extra_color);
        document.body.style.setProperty('--phase-color', phaseConfig[selectPhase]?.color);
    }, [selectPhase]);

    useEffect(() => {
        if (show && state.windowWidth <= 750) updateBodyOverflow(false);
    }, [show, state.windowWidth]);

    useEffect(() => {
        setPhaseConfig([{
            color: '#EFC100',
            extra_color: '#AF7604'
        }, {
            color: '#11C864',
            extra_color: '#04843E'
        }, {
            color: '#8F8BF7',
            extra_color: '#4434E2'
        }]);
    }, []);

    const cameraContentResize = new ResizeObserver((entries) => {
        let entry = entries[0];
        let cr = entry.contentRect;
        let target = entry.target;

        document.body.style.setProperty('--camera-content-height', cr.height + 2 + 'px');
    })

    useEffect(() => {
        if (cameraContentRef.current && state.windowWidth <= 750) {
            cameraContentResize.observe(cameraContentRef.current);
        }
    }, [cameraContentRef, isFold]);

    if (!phases || !phases.length) return <></>;

    return (
        <div className={`wallet-nacp-edit-container popup-container ${(show && isLoadingEnded) && 'show'}`}>
            <div
                className={`wallet-nacp-edit-content transition ${isFold && 'fold'}`}
                onTouchStart={e => {
                    if (state.windowWidth <= 750) {
                        touchYStart = e.changedTouches[0].clientY;
                    }
                }}
                onTouchEnd={e => {
                    if (state.windowWidth <= 750) {
                        const end = e.changedTouches[0].clientY;
                        if (end - touchYStart > 100) {
                            setIsFold(false);
                        }
                    }
                }}>
                <div className="edit-header flex-align">
                    <div className="title">{nacp.name}</div>
                    <div className="btn-groups flex-align">
                        {phases.filter(p => p.status == 1).length > 0 && (
                            <button className="cursor btn save-btn" style={{ background: phaseConfig[selectPhase].color }} onClick={() => {
                                signInWithEthereum();
                            }}>Save</button>
                        )}
                        <button className="cursor btn discard-btn" onClick={() => {
                            setShowDiscardPopup(true);
                        }}>
                            <img src={DiscardIcon} alt="DiscardIcon" />
                        </button>
                    </div>
                </div>
                <div className={`edit-content ${state.windowWidth > 750 && 'flex-align'}`}>
                    <div className="left-content">
                        <div className="content-container">
                            <div className="phases-tabs flex-align">
                                {phases.map((phase, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={`cursor transition phase-tab ${index == selectPhase && 'selected'} ${phase.status !== 1 && 'locked'}`}
                                            style={{ border: `1px solid ${phaseConfig[index].color}`, boxShadow: `3px 3px 0px 0px ${phaseConfig[index].color}` }}
                                            onTouchStart={() => {
                                                document.body.style.setProperty('--phase-tab-color', phaseConfig[index].extra_color);
                                            }}
                                            onMouseDown={() => {
                                                document.body.style.setProperty('--phase-tab-color', phaseConfig[index].extra_color);
                                            }}
                                            onClick={() => {
                                                if (index == selectPhase) return;
                                                setSelectPhase(index);
                                                setSelectCategory(phases[index].categories[0]._id);
                                                setCurrCategory(phases[index].categories[0]);
                                            }}>
                                            <div className="transition name" style={{ color: phaseConfig[index].color }}>{phase.name}</div>
                                            {phase.status !== 1 ? (
                                                <div className="status-tag locked-tag">Locked</div>
                                            ) : (
                                                <div
                                                    className="status-tag left-tag flex-center"
                                                    style={{ background: phaseConfig[index].color }}>
                                                    {NacpPhaseLeftTime()}
                                                    {phaseLefts[index]?.countdownStr}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div ref={cameraContentRef} id="nacp-camera-content" className={`nacp-camera-content transition ${isFold && 'fold'}`}>
                                {selectedAssets.length > 0 ? (
                                    <div className={`nacp-assets transition ${(selectPhase == 1 && viewScale) && 'scale'}`}>
                                        {selectedAssets.map((asset, index) => {
                                            return (
                                                <div
                                                    key={index}
                                                    className="nacp-asset"
                                                    style={{
                                                        zIndex: asset.level
                                                            ? asset.level
                                                            : (asset.is_headwear_back
                                                                ? asset.category?.headwear_back_level
                                                                : (asset.is_eyewear_back ? asset.category?.eyewear_back_level : asset.category?.level))
                                                    }}>
                                                    <img src={`${asset.url}?v=3`} alt="" />
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <></>
                                )}
                                {selectPhase == 1 && (
                                    <div className="view-scale cursor" onClick={() => {
                                        setViewScale(!viewScale);
                                    }}>
                                        <img className="transition" src={viewScale ? BodyViewScaleIcon : HeadViewScaleIcon} alt="" />
                                    </div>
                                )}
                                {selectedAssets.length > 0 ? (
                                    <div className={`nacp-assets-save transition`} style={{ width: '1000px', height: '1000px' }} ref={elementRef}>
                                        {selectedAssets.map((asset, index) => {
                                            return (
                                                <div
                                                    key={index}
                                                    className="nacp-asset"
                                                    style={{
                                                        zIndex: asset.level
                                                            ? asset.level
                                                            : (asset.is_headwear_back
                                                                ? asset.category?.headwear_back_level
                                                                : (asset.is_eyewear_back ? asset.category?.eyewear_back_level : asset.category?.level))
                                                    }}>
                                                    <img crossOrigin="anonymous" src={`${asset.url}?v=4`} alt="" />
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
                                                <div
                                                    key={index}
                                                    className="nacp-asset"
                                                    style={{
                                                        zIndex: asset.level
                                                            ? asset.level
                                                            : (asset.is_headwear_back
                                                                ? asset.category?.headwear_back_level
                                                                : (asset.is_eyewear_back ? asset.category?.eyewear_back_level : asset.category?.level))
                                                    }}>
                                                    <img crossOrigin="anonymous" src={`${asset.url}?v=4`} alt="" />
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
                                        disabled={phases[selectPhase].status !== 1 || !canReset}
                                        className="cursor btn randomize-btn flex-center"
                                        style={{ background: phaseConfig[selectPhase].color, boxShadow: `3px 3px 0 ${phaseConfig[selectPhase].extra_color}` }}
                                        onClick={() => {
                                            fnReset();
                                        }}>
                                        <img src={ResetIcon} alt="ResetIcon" />
                                    </button>
                                    <button
                                        disabled={phases[selectPhase].status !== 1}
                                        className="cursor btn randomize-btn flex-center"
                                        style={{ background: phaseConfig[selectPhase].color, boxShadow: `3px 3px 0 ${phaseConfig[selectPhase].extra_color}` }}
                                        onClick={() => {
                                            fnRandomizeAssets();
                                        }}>
                                        <img src={RandomIcon} alt="RandomIcon" />
                                    </button>
                                    <button
                                        disabled={phases[selectPhase].status !== 1 || (assetsHistoryStack.length <= 1 || historyIndex == 0)}
                                        className={`cursor btn undo-btn flex-center`}
                                        style={{ background: phaseConfig[selectPhase].color, boxShadow: `3px 3px 0 ${phaseConfig[selectPhase].extra_color}` }}
                                        onClick={() => {
                                            fnOperateBack();
                                        }}>
                                        <img src={UndoIcon} alt="UndoIcon" />
                                    </button>
                                    <button
                                        disabled={phases[selectPhase].status !== 1 || (!assetsHistoryStack.length || historyIndex == assetsHistoryStack.length - 1)}
                                        className={`cursor btn redo-btn flex-center`}
                                        style={{ background: phaseConfig[selectPhase].color, boxShadow: `3px 3px 0 ${phaseConfig[selectPhase].extra_color}` }}
                                        onClick={() => {
                                            fnOperateNext();
                                        }}>
                                        <img src={RedoIcon} alt="RedoIcon" />
                                    </button>
                                </div>
                            </div>
                            <div className={`phase-categories ${isFold && 'fold'}`}>
                                <div className="flex-align phase-category-c">
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
                                                    {phases[selectPhase].status != 1 && (
                                                        <img className="category-locked" src={CategoryLocked} alt="" />
                                                    )}
                                                    {phases[selectPhase].status == 1 && category.selected && (
                                                        <img className="category-selected" src={category.selected.thumb_url} />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {state.windowWidth <= 750 && isFold && (
                                    (currCategory.name == 'Mask' || currCategory.name == 'Suit') && (
                                        <div className="mask-suit-tip flex-align">
                                            {NacpCategoryIcons.get(currCategory?.name)}
                                            <div className="text">
                                                {currCategory.name == 'Mask'
                                                    ? 'Some masks may cover the whole head. When selected, all head assets except for the mask will be removed.'
                                                    : 'Suits and costumes will replace both upper body and lower body assets.'}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                    <div
                        className={`right-content ${!isFold && 'hide'} ${phases[selectPhase].status !== 1 && 'locked'}`}
                        ref={rightRef}
                        onTouchStart={e => e.stopPropagation()}
                        onTouchEnd={e => e.stopPropagation()}>
                        {phases[selectPhase].status !== 1 ? (
                            <div className="locked-content">
                                <NacpPhaseLockedIcon></NacpPhaseLockedIcon>
                                <div className="locked">Locked!</div>
                                <div className="locked-tip">
                                    {phases[selectPhase].status == 0
                                        ? 'Sorry my fellow ape, the phase for this asset type has not started yet.'
                                        : 'Sorry my fellow ape, the phase for this asset type is expired.'}
                                </div>
                            </div>
                        ) : (
                            <>
                                {state.windowWidth > 750 && (
                                    <div className={`curr-category-top ${!(state.windowWidth == 1000 || state.windowWidth == 1440) && 'flex-align'}`}>
                                        <div className="curr-category flex-align">
                                            {NacpCategoryIcons.get(currCategory?.name)}
                                            <div className="category-name">{currCategory?.name}</div>
                                        </div>
                                        {(currCategory.name == 'Mask' || currCategory.name == 'Suit') && (
                                            <div className="mask-suit-tip flex-align">
                                                {NacpCategoryIcons.get(currCategory?.name)}
                                                <div className="text">
                                                    {currCategory.name == 'Mask'
                                                        ? 'Some masks may cover the whole head. When selected, all head assets except for the mask will be removed.'
                                                        : 'Suits and costumes will replace both upper body and lower body assets.'}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="assets flex-align" ref={assetsRef}>
                                    {currCategory.name !== 'Skin' && (
                                        <div
                                            className={`asset-item cursor flex-center ${isCollectionOpen && 'opacity'}`}
                                            onClick={() => {
                                                if (isCollectionOpen) {
                                                    mCollectionAsset && openOrCloseCollection(mCollectionAsset);
                                                    return;
                                                }
                                                // 取消当前选择
                                                chooseAsset(undefined);
                                            }}>
                                            <img src={ClearIcon} alt="ClearIcon" />
                                        </div>
                                    )}
                                    {assets.map((asset, index) => {
                                        let devStyle = {}
                                        let filters: NacpAsset[] = [];
                                        let selected: boolean = asset._id == currCategory.selected?._id;
                                        let preNumber = 4;

                                        if (state.windowWidth == 1000 || state.windowWidth == 1440) {
                                            preNumber = 3;
                                        }

                                        if (!assetsRef.current) return <></>;

                                        const assetsWidth = (assetsRef.current as unknown as HTMLElement).offsetWidth;
                                        const preWidth = (assetsWidth - (preNumber - 1) * 10) / preNumber;

                                        if (asset.is_collection) {
                                            // 是否选中集合中的asset
                                            filters = asset.includes?.filter(a => a._id == currCategory.selected?._id) || [];
                                            selected = selected || filters.length > 0;

                                            const j = Math.floor((index + 1) / preNumber) + 1;
                                            const offsetTopPx = 10;

                                            devStyle = { width: assetsWidth + 'px', top: ((preWidth + offsetTopPx) * j + 16) + 'px' };
                                        }
                                        return (
                                            <div
                                                key={index}
                                                className={`cursor asset-item ${selected && 'selected'} ${!asset.can_use && 'cant-use'} ${(isCollectionOpen && !asset.show_collection) && 'opacity'}`}
                                                onClick={() => {
                                                    if (isCollectionOpen && !asset.show_collection) {
                                                        mCollectionAsset && openOrCloseCollection(mCollectionAsset);
                                                        return;
                                                    }

                                                    // 使用 asset 逻辑
                                                    if (!asset.is_collection) {
                                                        if (!asset.can_use) return;
                                                        if (selected) return;
                                                        chooseAsset(asset);
                                                    }

                                                    openOrCloseCollection(asset);
                                                }}>

                                                {asset.can_use ? (
                                                    // <NacpCategoryAssetItem filters={filters} asset={asset} selected={selected}></NacpCategoryAssetItem>
                                                    <div className="asset-img-cover">
                                                        <img src={filters.length ? filters[0].thumb_url : asset.thumb_url} alt="AssetImg" className="asset-img transition" />
                                                        {selected && (
                                                            <div className="equip-selected">
                                                                {NacpAssetSelected(phaseConfig[selectPhase].color)}
                                                            </div>
                                                        )}
                                                        {asset.access_type == 'Special' && (
                                                            <div className="special-asset-count flex-align" style={{ color: `${NacpSpecialAssetIcons.get(asset.task_type || '')?.backgroundColor}` }}>
                                                                {NacpSpecialAssetIcons.get(asset.task_type || '')?.url}
                                                                {state.windowWidth > 1000 && (
                                                                    <div className="special-text">{`${NacpSpecialAssetIcons.get(asset.task_type || '')?.text}`}</div>
                                                                )}
                                                                <div className="text">{`x${selected ? (asset.count || 0) - 1 : asset.count}`}</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <Tooltip
                                                        overlayClassName="nacp-category-asset-tooltip"
                                                        color="#506077"
                                                        placement="top"
                                                        title="You don’t have this SagaOnly asset, or all of this SagaOnly asset are being used by other NACPs"
                                                        mouseLeaveDelay={3}
                                                        trigger={['hover', 'click']}
                                                    >
                                                        {/* <NacpCategoryAssetItem filters={filters} asset={asset} selected={selected}></NacpCategoryAssetItem> */}
                                                        <div className="asset-img-cover">
                                                            <img src={filters.length ? filters[0].thumb_url : asset.thumb_url} alt="AssetImg" className="asset-img" />
                                                            {selected && (
                                                                <div className="equip-selected">
                                                                    {NacpAssetSelected(phaseConfig[selectPhase].color)}
                                                                </div>
                                                            )}
                                                            {asset.access_type == 'Special' && (
                                                                <div className="special-asset-count flex-align" style={{ color: `${NacpSpecialAssetIcons.get(asset.task_type || '')?.backgroundColor}` }}>
                                                                    {NacpSpecialAssetIcons.get(asset.task_type || '')?.url}
                                                                    {state.windowWidth > 1000 && (
                                                                        <div className="special-text">{`${NacpSpecialAssetIcons.get(asset.task_type || '')?.text}`}</div>
                                                                    )}
                                                                    <div className="text">{`x${selected ? (asset.count || 0) - 1 : asset.count}`}</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Tooltip>
                                                )}

                                                {asset.is_collection && asset.show_collection && state.windowWidth > 750 && (
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
                                                                        className={`cursor collection-item ${!_asset.can_use && 'cant-use'} ${_asset._id == currCategory.selected?._id && 'selected'}`}
                                                                        key={_index}
                                                                        onClick={e => {
                                                                            if (!_asset.can_use) return;
                                                                            if (_asset._id == currCategory.selected?._id) return;
                                                                            chooseAsset(_asset);
                                                                            e.stopPropagation();
                                                                        }}>
                                                                        <div className="collection-img-cover">
                                                                            <img src={_asset.thumb_url} alt="CollectionImg" className="collection-img transition" />
                                                                            {_asset._id == currCategory.selected?._id && (
                                                                                <div className="equip-selected">
                                                                                    {NacpAssetSelected(phaseConfig[selectPhase].color)}
                                                                                </div>
                                                                            )}
                                                                            {_asset.access_type == 'Special' && (
                                                                                <img src={SpecialIcon} className="special-icon" alt="SpecialIcon" />
                                                                            )}
                                                                        </div>

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

            <div className={`popup-container m-collection-assets-content ${state.windowWidth <= 750 && isCollectionOpen && 'show'}`} onClick={() => {
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
                    initAssetData();
                }}></DiscardPopup>
            <OperatePopup
                show={showPhaseEndTip}
                closeText="OKAY"
                hideConfirm={true}
                confirmText={`GO TO PHASE ${activePhase + 2} EDITOR`}
                content={`Phase ${activePhase + 1} has ended.`}
                close={() => {
                    setShowNacpEdit(false);
                    setShowPhaseEndTip(false);
                }}
                confirm={() => {
                    setShowPhaseEndTip(false);
                    setShowNacpEdit(false);
                    initAssetData();

                    setTimeout(() => {
                        setShowNacpEdit(true);
                    }, 500);
                }}></OperatePopup>
            {state.windowWidth <= 750 && (
                <div className={`transition fold-icon ${isFold && 'show'}`} onClick={() => {
                    setIsFold(false);
                }}>
                    <img src={FoldIcon} alt="FoldIcon" />
                </div>
            )}
        </div>
    );
}
