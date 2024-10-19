/**
 * Represents a hexagon in a hexagonal grid.
 * Uses the axial coordinate system.
 */
export class Hex {
    constructor(public q: number, public r: number) {}

    /**
     * The s coordinate can be inferred from q and r.
     */
    get s(): number {
        return -this.q - this.r;
    }

    hash(): string {
        return `${this.q},${this.r}`;
    }

    /**
     * Rounds the hexagon's coordinates to the nearest whole number.
     */
    round(): Hex {
        let q = Math.round(this.q);
        let r = Math.round(this.r);
        let s = Math.round(this.s);

        const q_diff = Math.abs(q - this.q);
        const r_diff = Math.abs(r - this.r);
        const s_diff = Math.abs(s - this.s);

        if (q_diff > r_diff && q_diff > s_diff) {
            q = -r - s;
        } else if (r_diff > s_diff) {
            r = -q - s;
        } else {
            s = -q - r;
        }

        this.q = q;
        this.r = r;

        return this;
    }
}