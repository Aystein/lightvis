import { useMemo } from "react";
import { Lasso } from "./useLasso";

export function lassoToSvgPath(lasso: Lasso) {
    return lasso.controlPoints
          .map((point, index) => {
            if (index === 0) {
              return `M ${point.x} ${point.y}`;
            }
            return `L ${point.x} ${point.y}`;
          })
          .join(' ');
  }

export function SVGLasso({
    value,
    props,
}: {
    value: Lasso,
    props?: React.SVGProps<SVGPathElement>,
}) {
    const mergedProps: React.SVGProps<SVGPathElement> = {
        fill: 'none',
        stroke: 'black',
        strokeDasharray: '4',
        strokeWidth: 2,
        ...(props ?? {}),
    };

    const lassoPath = useMemo(() => lassoToSvgPath(value), [value]);

    return <path d={lassoPath} {...mergedProps} />
}