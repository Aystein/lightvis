import { Dispatch, SetStateAction, useCallback, useState } from "react";

/**
 * Hook that allows controlled and uncontrolled usage of a value.
 * Supports react.dispatch type of onChange.
 */
export function useUncontrolled<T>({
    value,
    defaultValue,
    onChange,
}: {
    value?: T;
    defaultValue?: T;
    onChange?: Dispatch<SetStateAction<T>>;
}): [T, Dispatch<SetStateAction<T>>] {
    const [uncontrolled, setUncontrolled] = useState(defaultValue);

    const handleChange = useCallback((action: SetStateAction<T>) => {
        // Store uncontrolled version
        setUncontrolled(action as SetStateAction<T | undefined>);

        // Call controlled version
        onChange?.(action);
    }, [onChange]);

    if (value !== undefined && onChange !== undefined) {
        return [value as T, onChange];
    }

    return [uncontrolled as T, handleChange];
}