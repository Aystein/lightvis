import { Point } from "./Point";

export class Orientation {
    constructor(public f0: number, public f1: number, public f2: number, public f3: number, public b0: number, public b1: number, public b2: number, public b3: number, public startAngle: number) {}

    /**
     * Pointy orientation.
     */
    static pointy = new Orientation(Math.sqrt(3.0), Math.sqrt(3.0) / 2.0, 0.0, 3.0 / 2.0, Math.sqrt(3.0) / 3.0, -1.0 / 3.0, 0.0, 2.0 / 3.0, 0.5);

    /**
     * Flat orientation.
     */
    static flat = new Orientation(3.0 / 2.0, 0.0, Math.sqrt(3.0) / 2.0, Math.sqrt(3.0), 2.0 / 3.0, 0.0, -1.0 / 3.0, Math.sqrt(3.0) / 3.0, 0.0);

    /**
     * Creates a hexagon geometry with the given radius and orientation.
     */
    createHexGeometry(radius: number): Point[] {
        const corners: Point[] = [];

        for (let i = 0; i < 6; i++) {
            const angle = 2.0 * Math.PI * (i + this.startAngle) / 6;
            corners.push({ x: radius * Math.cos(angle), y: radius * Math.sin(angle) });
        }

        return corners;
    }
}