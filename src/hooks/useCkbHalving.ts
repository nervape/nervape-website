import { useMemo, useState, useEffect } from 'react'
import { getCKBCurrentEpochAndTipBlockNumber } from '../utils/api';
import useIntervalAsync from './useIntervalAsync'

const THEORETICAL_EPOCH_TIME = 1000 * 60 * 60 * 4;
const EPOCHS_PER_HALVING = 8760;

export const useHalving = (_halvingCount = 1) => {
    const [ isLoading, setIsLoading ] = useState(false)
    const [ currentEpochUsedTime, setCurrentEpochUsedTime ] = useState(0)
    const [ estimatedDate, setEstimatedDate ] = useState<Date>()
    const [ hasHalved, setHasHalved ] = useState(false)

    const calculate = async() => {
        setIsLoading(true)
        const { currentEpoch, epochIndex, epochLength, tipBlockNumber } = await getCKBCurrentEpochAndTipBlockNumber()
        const halvingCount = Math.max(Math.floor(_halvingCount) || 1, 1) // halvingCount should be a positive integer greater than 1.
        const targetEpoch = EPOCHS_PER_HALVING * halvingCount
        if(currentEpoch < targetEpoch) {
            const _currentEpochUsedTime = (epochIndex / epochLength) * THEORETICAL_EPOCH_TIME // 1000 * 60 * 60 * 4 =  4小时
            setCurrentEpochUsedTime(_currentEpochUsedTime)
            const estimatedTime = (targetEpoch - currentEpoch) * THEORETICAL_EPOCH_TIME - _currentEpochUsedTime
            const _estimatedDate = new Date(new Date().getTime() + estimatedTime)
            setEstimatedDate(_estimatedDate)
        } else {
            setHasHalved(true)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        calculate()
    }, [])

    useIntervalAsync(calculate, 10 * 1000)
    
    return {
        isLoading,
        currentEpochUsedTime,
        estimatedDate,
        hasHalved
    }
}
