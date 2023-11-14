import { useMemo } from 'react'
import { useObservableState } from 'observable-hooks'
// import { cacheService } from '../services/CacheService'

const THEORETICAL_EPOCH_TIME = 1000 * 60 * 60 * 4;
const EPOCHS_PER_HALVING = 8760;

export function useStatistics() {
    return {} as any;
}

export const useSingleHalving = (_halvingCount = 1) => {
    const halvingCount = Math.max(Math.floor(_halvingCount) || 1, 1) // halvingCount should be a positive integer greater than 1.
    const statistics = useStatistics()
    const celebrationSkipKey = `having-celebration-${halvingCount}`
    const celebrationSkipped =  false // cacheService.get<boolean>(celebrationSkipKey) ?? false
    function skipCelebration() {
        // cacheService.set(celebrationSkipKey, true)
    }

    const currentEpoch = Number(statistics.epochInfo.epochNumber)
    const targetEpoch = EPOCHS_PER_HALVING * halvingCount
    const currentEpochUsedTime =
        (Number(statistics.epochInfo.index) / Number(statistics.epochInfo.epochLength)) * THEORETICAL_EPOCH_TIME // 1000 * 60 * 60 * 4 4小时

    const estimatedTime = (targetEpoch - currentEpoch) * THEORETICAL_EPOCH_TIME - currentEpochUsedTime
    const estimatedDate = useMemo(() => new Date(new Date().getTime() + estimatedTime), [estimatedTime])

    const haveDone = currentEpoch >= targetEpoch
    const celebrationOverEpoch = targetEpoch + 30 * 6 // Every 6 epochs is theoretically 1 day.
    const inCelebration = haveDone && currentEpoch < celebrationOverEpoch && !celebrationSkipped

    return {
        isLoading: statistics.epochInfo.index === '0',
        halvingCount,
        currentEpoch,
        targetEpoch,
        inCelebration,
        skipCelebration,
        currentEpochUsedTime,
        estimatedDate,
    }
}

export const useHalving = () => {
    const statistics = useStatistics() // 获取 api 数据
    const currentEpoch = Number(statistics.epochInfo.epochNumber)
    const lastedHalvingCount = Math.ceil((currentEpoch + 1) / EPOCHS_PER_HALVING) // EPOCHS_PER_HALVING 常量 8760
    const lastedHalving = useSingleHalving(lastedHalvingCount)
    const previousHalving = useSingleHalving(lastedHalvingCount - 1)

    return previousHalving.inCelebration ? previousHalving : lastedHalving
}
