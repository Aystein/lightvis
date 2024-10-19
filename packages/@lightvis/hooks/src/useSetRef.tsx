import { useCallback, useRef } from "react";

export function useSetRef(callback?: (element: HTMLElement | null) => void) {
    const ref = useRef<HTMLElement | null>(null);

    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    const setRef = useCallback((newElement: HTMLElement | null) => {
        ref.current = newElement;

        callbackRef.current?.(newElement);
    }, []);

    return {
        ref,
        setRef,
    }
}