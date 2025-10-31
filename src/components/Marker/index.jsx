import React, { Fragment, memo } from "react";
import { Label, Mark } from "./styles";
import { getMarkerFromSegment } from "../../utils";

const Marker = (props) => {
  const {
    min,
    max,
    segments,
    getPosition,
    showMarks = false,
    customMarkers = [],
  } = props;

  const markerList = getMarkerFromSegment(segments, min, max);

  const customMarkerList = customMarkers.filter(
    (mark) => mark >= min && mark <= max
  );

  return (
    <>
      {markerList.map((value, idx) => {
        const position = getPosition(value);

        return (
          <Fragment key={value + idx}>
            <Label position={position} className="slider-label">
              {value}
            </Label>
            {showMarks && <Mark position={position} className="slider-mark" />}
          </Fragment>
        );
      })}

      {customMarkerList.map((value, idx) => {
        const position = getPosition(value);

        return (
          <Fragment key={value + idx}>
            <Label position={position} className="slider-label">
              {value}
            </Label>
            <Mark
              position={position}
              color="#FFD339"
              width={6}
              height={48}
              className="slider-custom-mark"
            />
          </Fragment>
        );
      })}
    </>
  );
};

export default memo(Marker);
