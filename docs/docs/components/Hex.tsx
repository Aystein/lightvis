import { Hex, Layout } from "@lightvis/hexworld";
import { useMemo } from "react"

export function HexItem({ hovered, q, r, layout }: { hovered: boolean; q: number, r: number; layout: Layout }) {
    const points = useMemo(() => {
        return layout.orientation.createHexGeometry(layout.size).map((point) => `${point.x},${point.y}`).join(" ");
    }, [layout]);

    const hex = new Hex(q, r);
    const px = layout.hexToPixel(hex);

    return <g style={{ userSelect: 'none' }} transform={`translate(${px.x + layout.hexWidth()}, ${px.y + layout.hexHeight()})`}>
        <polygon fill={hovered ? 'red' : 'transparent'} points={points} stroke="black" />
        <text fontSize={12} x={0} y={0} textAnchor="middle" alignmentBaseline="middle">{q},{r}</text>
    </g>
}