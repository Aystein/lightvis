import { Dispatch, SetStateAction } from "react";
import { MouseDownEvent } from "./DragController";
import { useDrag } from "./useDrag";
import { useUncontrolled } from "./useUncontrolled";

export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Lasso {
    boundingRect: Rect;
    controlPoints: { x: number, y: number }[];
}

function clampValue(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

export function useLasso({
    shouldSkip,
    value,
    setValue,
    onChangeEnd,
    clamp,
}: {
    shouldSkip?: (event: MouseDownEvent) => boolean;
    value?: Lasso;
    setValue?: Dispatch<SetStateAction<Lasso | undefined>>;
    onChangeEnd?: (value: Lasso | undefined) => void;
    clamp?: boolean;
}) {
    const [uncontrolledValue, uncontrolledSetValue] = useUncontrolled<Lasso | undefined>({
        value,
        onChange: setValue,
    })

    const { setRef, dragState } = useDrag({
        shouldSkip,
        onDrag (event) {
            // First drag
            uncontrolledSetValue((old) => {
                // Check if distance to last point is big enough
                const willAddPoint = !old || old.controlPoints.length === 0 || Math.hypot(event.x - old.controlPoints[old.controlPoints.length - 1].x, event.y - old.controlPoints[old.controlPoints.length - 1].y) > 10;

                if (willAddPoint) {
                    const newPoint = (clamp ?? true) ? { x: clampValue(event.x, 0, event.target.clientWidth), y: clampValue(event.y, 0, event.target.clientHeight) } : { x: event.x, y: event.y };

                    return {
                        controlPoints: old ? [
                            ...old.controlPoints,
                            newPoint
                        ] : [newPoint],
                        boundingRect: old ? {
                            x: Math.min(old.boundingRect.x, event.x),
                            y: Math.min(old.boundingRect.y, event.y),
                            width: Math.max(old.boundingRect.width, event.x - old.boundingRect.x),
                            height: Math.max(old.boundingRect.height, event.y - old.boundingRect.y),
                        } : {
                            x: event.x,
                            y: event.y,
                            width: 0,
                            height: 0,
                        }
                    }
                }

                return old;
            });
        },
        onMouseUp () {
            uncontrolledSetValue(undefined);

            onChangeEnd?.(uncontrolledValue);
        },
    });

    return {
        value: uncontrolledValue,
        setValue: uncontrolledSetValue,
        setRef,
        dragState,
    }
}