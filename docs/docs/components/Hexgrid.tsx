import { Layout, Orientation, Hex } from "@lightvis/hexworld";
import { HexItem } from "./Hex";
import { useMemo, useState } from "react";

export function Hexgrid({ orientation }: { orientation: "pointy" | "flat" }) {
    const [hover, setHover] = useState<Hex | null>(null);
    const layout = useMemo(() => new Layout(orientation, 20), [orientation]); 

    // Hexagon grid
    return <svg
        onMouseMove={(e) => {
            setHover(layout.pixelToHex(e.nativeEvent.offsetX - layout.hexWidth(), e.nativeEvent.offsetY - layout.hexHeight()));
        }}
        width={layout.hexWidth() * (orientation === "pointy" ? 5 : 3.5)}
        height={layout.hexHeight() * (orientation === "pointy" ? 3.5 : 5)}>
        {Array.from({ length: 3 }).map((_, q) => {
            return Array.from({ length: 3 }).map((_, r) => {
                return <HexItem hovered={hover?.q === q && hover?.r === r} key={`${q}-${r}`} q={q} r={r} layout={layout} />
            });
        })}
    </svg>
}