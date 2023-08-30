import { useCallback, useEffect, useRef } from 'react';

const useIntervalAsync = <R = unknown>(callback: () => Promise<R>, ms: number) => {
    const latestCallback = useRef(() => {
    });

    useEffect(() => {
        latestCallback.current = callback;
    });

    useEffect(() => {
        const timer = setInterval(() => latestCallback.current(), ms);
        return () => clearInterval(timer);
    }, []);
};

export default useIntervalAsync;
