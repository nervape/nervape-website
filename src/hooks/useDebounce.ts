import { useCallback, useEffect, useRef } from "react";

export default function useDebounce(fn: Function, delay: number, dep = []) {
    const { current } = useRef({ fn, timer: 0 });
    useEffect(function () {
        current.fn = fn;
    }, [fn]);

    return useCallback(function f(...args) {
        if (current.timer) {
            window.clearTimeout(current.timer);
        }
        current.timer = window.setTimeout(() => {
            current.fn(...args);
        }, delay);
    }, dep)
}
