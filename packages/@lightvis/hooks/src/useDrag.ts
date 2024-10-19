import { useRef, useState } from "react";
import { useSetRef } from "./useSetRef";
import { DragController, DragEvent, DragState, MouseClickEvent, MouseDownEvent, MouseUpEvent } from "./DragController";



export function useDrag(callbacks: {
    onMouseDown?: (event: MouseDownEvent) => void;
    onDrag?: (event: DragEvent) => void;
    onMouseUp?: (event: MouseUpEvent) => void;
    onClick?: (event: MouseClickEvent) => void;
    shouldSkip?: (event: MouseDownEvent) => boolean;
}) {
    const callbackRef = useRef(callbacks);
    callbackRef.current = callbacks;

    const [dragState, setDragState] = useState<DragState>('idle');

    const { ref, setRef } = useSetRef((element) => {
        if (element) {
            new DragController(element, {
                onMouseDown: (event) => {
                    setDragState('down');
                    callbackRef.current.onMouseDown?.(event);
                },
                onDrag: (event) => {
                    if (dragState !== 'dragging') {
                        setDragState('dragging');
                    }
                    callbackRef.current.onDrag?.(event);
                },
                onMouseUp: (event) => {
                    setDragState('idle');
                    callbackRef.current.onMouseUp?.(event);
                },
                onClick: (event) => {
                    callbackRef.current.onClick?.(event);
                },
                shouldSkip: (event) => {
                    return callbackRef.current.shouldSkip?.(event) ?? false;
                }
            });
        }
    });

    return {
        dragState,
        ref,
        setRef,
    }
}