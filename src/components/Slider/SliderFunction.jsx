import React, {
  memo,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo
} from "react";
import debounce from "lodash.debounce";
import { SliderWrapper } from "./styles";
import SliderHandle from "../Handle";
import SliderTrack from "../Track";
import SliderMarker from "../Marker";
import {
  getInterpolatedValueWithPosition,
  getInterpolatedPosition,
  getCalculatedValue,
  updateElementStyle,
  computeSegments
} from "../../utils";

const Slider = (props) => {
  const {
    defaultValue,
    min,
    max,
    segments,
    showMarks,
    customMarkers,
    disabled,
    instantUpdate
  } = props;

  const [sliderRect, setSliderRect] = useState(); // hold slider boundary offset
  const sliderRef = useRef(null); // holds slider ref
  const sliderHandleRef = useRef(null); // holds slider handle ref
  const valueRef = useRef(
    getCalculatedValue({ value: defaultValue, min, max })
  ); // slider value holder ref

  useEffect(() => {
    /* setting sliderRect here to get updated slider bounding rectangle */
    const { left, right } = sliderRef.current.getBoundingClientRect();
    setSliderRect({ left, right });

    /* On unmount remove slider event handlers attached */
    return () => {
      onEnd();
      sliderRef.current.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  /** attach mousemove & mouseup event listeners to body for handling user drag & release action */
  const addEventListeners = () => {
    document.body.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseup", onEnd);
  };

  /** remove mousemove & mouseup event listeners from body once user releases the cursor */
  const removeEventListeners = () => {
    document.body.removeEventListener("mousemove", handleMouseMove);
    document.body.removeEventListener("mouseup", onEnd);
  };

  /** get slider current value based on the position of handle(knob) */
  const getCurrentValue = (currentPosition) => {
    if (sliderRect) {
      return getInterpolatedValueWithPosition({
        currentPosition,
        sliderRect,
        min,
        max
      });
    }
    return min;
  };

  /** get position of an element based on its value (for markers, handle, etc.) */
  const getPosition = useCallback(
    (val) => {
      if (sliderRect) {
        return getInterpolatedPosition({ val, sliderRect, min, max });
      }
      return 0;
    },
    [sliderRect, min, max]
  );

  /** calculate & update slider value & slider handle position */
  const updateValueAndStyle = (clientX) => {
    const { value, position } = getCurrentValue(clientX);

    valueRef.current = value;
    updateElementStyle(sliderHandleRef.current, position, value);

    if (instantUpdate) {
      props.onChange(value);
    }
  };

  /** do operations when mouse is clicked on the slider */
  const onMouseDown = (event) => {
    if (disabled) {
      return;
    }

    removeEventListeners();
    updateValueAndStyle(event.clientX);
    addEventListeners();
  };

  /** do operations when cursor/mouse is dragged */
  const handleMouseMove = debounce((event) => {
    updateValueAndStyle(event.clientX);
  }, 5);

  /** remove mouseMove & mouseUp event handler */
  const onEnd = () => {
    props.onChange(valueRef.current);
    removeEventListeners();
  };

  // compute segment data with its css
  const { segmentList, segmentBgCSS } = useMemo(
    () => computeSegments(segments, min, max),
    [segments, min, max]
  );

  /** render slider scale & slider markers when sliderRef is available */
  const renderSliderTrackWithMarkers = useMemo(
    () =>
      sliderRect && (
        <>
          <SliderTrack bgCSS={segmentBgCSS} />
          <SliderMarker
            min={min}
            max={max}
            segments={segmentList}
            showMarks={showMarks}
            customMarkers={customMarkers}
            getPosition={getPosition}
          />
        </>
      ),
    [
      sliderRect,
      min,
      max,
      getPosition,
      segmentList,
      segmentBgCSS,
      showMarks,
      customMarkers
    ]
  );

  /** render slider knob/handle when sliderRef is available. re-render only if slideRef or value changes */
  const renderSliderHandle = useMemo(
    () =>
      sliderRect && (
        <SliderHandle
          ref={sliderHandleRef}
          value={valueRef.current}
          getHandlePosition={getPosition}
        />
      ),
    [sliderRect, getPosition]
  );

  return (
    <SliderWrapper ref={sliderRef} onMouseDown={onMouseDown} className="slider">
      {renderSliderTrackWithMarkers}
      {renderSliderHandle}
    </SliderWrapper>
  );
};

Slider.defaultProps = {
  disabled: false,
  instantUpdate: false,
  linear: true,
  onChange: () => {}
};

export default memo(Slider);
