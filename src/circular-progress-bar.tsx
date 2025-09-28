import PropTypes from "prop-types";

import { SVGIcon } from "./svg-icon";
import { FC } from "react";

const mapArcsToColor = {
  first: "#375EF9",
  second: "#c5bdb7",
  third: "#9c8a7b",
};

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

  const d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    arcSweep,
    0,
    end.x,
    end.y,
  ].join(" ");

  return d;
}

export type CircularProgressBarProps = {
  radius: number;
  // endAngle: number;
  className?: string;
  color?: string;
  fillColor?: string;
  fontSize?: string;
  viewBox?: string;
  height?: string;
  width?: string;
  firstArcEndAngle: number;
};

export const CircularProgressBar: FC<CircularProgressBarProps> = ({
  radius,
  width,
  height,
  firstArcEndAngle,
  ...others
}) => {
  const baseArc = describeArc(
    Number(width) / 2,
    Number(height) / 2,
    radius,
    0,
    359.9
  );
  const firstArc = describeArc(
    Number(width) / 2,
    Number(height) / 2,
    radius,
    0,
    firstArcEndAngle
  );

  return (
    <SVGIcon width={width} height={height} {...others}>
      <g fill="none" fillRule="evenodd">
        <g stroke="#FFF">
          <g>
            <path
              strokeWidth="4"
              stroke={mapArcsToColor.first}
              d={firstArc}
              transform="translate(-167 -147) translate(167 151)"
            />
          </g>
        </g>
      </g>
    </SVGIcon>
  );
};

CircularProgressBar.defaultProps = {
  width: "45",
  height: "48",
  viewBox: "0 0 45 48",
  radius: 24,
};

export default CircularProgressBar;
