import { useEffect, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useUnipassBalance(callback: any, timeout = 1000) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const latestCallback = useRef(() => {});

    useEffect(() => {
        latestCallback.current = callback;
    });

    useEffect(() => {
        const timer = setInterval(() => latestCallback.current(), timeout);
        return () => clearInterval(timer);
    }, []);
}
