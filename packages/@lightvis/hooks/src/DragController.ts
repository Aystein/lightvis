export function offsetPosition(element: HTMLElement, event: MouseEvent) {
    const boundingRect = element.getBoundingClientRect();

    return {
        x: event.clientX - boundingRect.left - element.clientLeft,
        y: event.clientY - boundingRect.top - element.clientTop,
    };
}

export function distance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export interface MouseClickEvent {
    target: HTMLElement;

    x: number;
    y: number;

    clientX: number;
    clientY: number;
}

export interface DragEvent {
    target: HTMLElement;

    x: number;
    y: number;

    initialX: number;
    initialY: number;

    targetInitialX: number;
    targetInitialY: number;

    clientX: number;
    clientY: number;

    movementX: number;
    movementY: number;

    index: number;
}

export interface MouseDownEvent {
    target: HTMLElement;

    x: number;
    y: number;
    
    targetX: number;
    targetY: number;

    clientX: number;
    clientY: number;
}

export interface MouseUpEvent {
    target: HTMLElement;

    x: number;
    y: number;

    clientX: number;
    clientY: number;
}

export type DragState = 'idle' | 'down' | 'dragging';

export class DragController {
    initialX: number = 0;
    initialY: number = 0;

    targetInitialX: number = 0;
    targetInitialY: number = 0;

    previousX: number = 0;
    previousY: number = 0;

    animationFrame?: number;

    target: HTMLElement | null = null;

    dragIndex: number = 0;

    state: DragState = 'idle';

    constructor(private element: HTMLElement, private callbacks: {
        // General events
        onMouseDown?: (event: MouseDownEvent) => void;
        onDrag?: (event: DragEvent) => void;
        onMouseUp?: (event: MouseUpEvent) => void;
        onClick?: (event: MouseClickEvent) => void;

        // Function to skip some interactions
        shouldSkip?: (event: MouseDownEvent) => boolean;
    }) {
        // Bind all methods to the instance
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.mouseDown = this.mouseDown.bind(this);

        element.addEventListener('mousedown', this.mouseDown);
    }

    mouseDown(event: MouseEvent) {
        const { x, y } = offsetPosition(this.element, event);
        const { x: targetInitialX, y: targetInitialY } = offsetPosition(event.target as HTMLElement, event);

        this.target = event.currentTarget as HTMLElement;

        const mouseDownEvent: MouseDownEvent = {
            target: this.target,
            x,
            y,
            targetX: targetInitialX,
            targetY: targetInitialY,
            clientX: event.clientX,
            clientY: event.clientY,
        };

        if (this.callbacks.shouldSkip?.(mouseDownEvent)) {
            return;
        }

        this.initialX = x;
        this.initialY = y;

        this.targetInitialX = targetInitialX;
        this.targetInitialY = targetInitialY;

        this.previousX = x;
        this.previousY = y;

        this.state = 'down';

        this.callbacks.onMouseDown?.(mouseDownEvent);

        window.addEventListener('mousemove', this.mouseMove);
        window.addEventListener('mouseup', this.mouseUp);
    }

    mouseMove(event: MouseEvent) {
        if (this.animationFrame !== undefined) {
            cancelAnimationFrame(this.animationFrame);
        }

        this.animationFrame = requestAnimationFrame(() => {
            const { x, y } = offsetPosition(this.element, event);

            if (this.state === 'down' && distance(this.targetInitialX, this.targetInitialY, x, y) > 2) {
                this.state = 'dragging';

                // First drag
                this.callbacks.onDrag?.({
                    target: this.target!,
                    x,
                    y,
                    initialX: this.initialX,
                    initialY: this.initialY,
                    targetInitialX: this.targetInitialX,
                    targetInitialY: this.targetInitialY,
                    clientX: event.clientX,
                    clientY: event.clientY,
                    movementX: x - this.previousX,
                    movementY: y - this.previousY,
                    index: this.dragIndex,
                });

                this.dragIndex++;
                this.previousX = x;
                this.previousY = y;
            } else if (this.state === 'dragging') {
                this.callbacks.onDrag?.({
                    target: this.target!,
                    x,
                    y,
                    initialX: this.initialX,
                    initialY: this.initialY,
                    targetInitialX: this.targetInitialX,
                    targetInitialY: this.targetInitialY,
                    clientX: event.clientX,
                    clientY: event.clientY,
                    movementX: x - this.previousX,
                    movementY: y - this.previousY,
                    index: this.dragIndex,
                });

                this.dragIndex++;
                this.previousX = x;
                this.previousY = y;
            }

            // Invalidate frame
            this.animationFrame = undefined;
        });
    }

    mouseUp(event: MouseEvent) {
        // Case when we have another animation frame
        if (this.animationFrame !== undefined) {
            cancelAnimationFrame(this.animationFrame);
        }

        const { x, y } = offsetPosition(this.element, event);

        // Throw last drag event
        if (this.state === 'dragging') {
            this.callbacks.onDrag?.({
                target: this.target!,
                x,
                y,
                initialX: this.initialX,
                initialY: this.initialY,
                targetInitialX: this.targetInitialX,
                targetInitialY: this.targetInitialY,
                clientX: event.clientX,
                clientY: event.clientY,
                movementX: x - this.previousX,
                movementY: y - this.previousY,
                index: -1,
            });
        }

        this.callbacks.onMouseUp?.({
            target: this.target!,
            x,
            y,
            clientX: event.clientX,
            clientY: event.clientY,
        });

        if (this.state === 'down') {
            this.callbacks.onClick?.({
                target: this.target!,
                x,
                y,
                clientX: event.clientX,
                clientY: event.clientY
            });
        }

        window.removeEventListener('mousemove', this.mouseMove);
        window.removeEventListener('mouseup', this.mouseUp);

        this.state = 'idle';
        this.dragIndex = 0;
    }

    dispose() {
        this.element.removeEventListener('mousedown', this.mouseDown);
        window.removeEventListener('mousemove', this.mouseMove);
        window.removeEventListener('mouseup', this.mouseUp);
    }
}
