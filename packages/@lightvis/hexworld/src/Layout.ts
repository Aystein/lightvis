import { Hex } from "./Hex";
import { Orientation } from "./Orientation";
import { Point } from "./Point";

export class Layout {
    orientation: Orientation;

    constructor(orientation: "pointy" | "flat", public size: number, public origin: Point = { x: 0, y: 0 }) {
        this.orientation = orientation === "pointy" ? Orientation.pointy : Orientation.flat;
    }

    hexToPixel(hex: Hex): Point {
        const x = (this.orientation.f0 * hex.q + this.orientation.f1 * hex.r) * this.size;
        const y = (this.orientation.f2 * hex.q + this.orientation.f3 * hex.r) * this.size;

        return { x: x + this.origin.x, y: y + this.origin.y };
    }

    pixelToHex(point: Point): Hex {
        const pt = { x: (point.x - this.origin.x) / this.size, y: (point.y - this.origin.y) / this.size };
        const q = this.orientation.b0 * pt.x + this.orientation.b1 * pt.y;
        const r = this.orientation.b2 * pt.x + this.orientation.b3 * pt.y;

        return new Hex(q, r).round();
    }

    hexWidth(): number {
        if (this.orientation === Orientation.flat) {
            return this.size * 2;
        } else {
            return Math.sqrt(3) * this.size;
        }
    }

    hexHeight(): number {
        if (this.orientation === Orientation.flat) {
            return Math.sqrt(3) * this.size;
        } else {
            return this.size * 2;
        }
    }
}