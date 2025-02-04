import React, { PureComponent } from "react";
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
  computeSegments,
} from "../../utils";

class Slider extends PureComponent {
  constructor(props) {
    super(props);
    const { defaultValue, min, max } = props;
    this.state = { sliderRect: null };
    this.valueRef = getCalculatedValue({ value: defaultValue, min, max });
  }

  componentDidMount() {
    /* setting sliderRect here to get updated slider bounding rectangle */
    const { left, right } = this.sliderRef.getBoundingClientRect();
    this.setState({ sliderRect: { left, right } });
  }

  componentWillUnmount() {
    /* On unmount remove slider event handlers attached */
    this.onEnd();
    this.sliderRef.removeEventListener("mousedown", this.onMouseDown);
  }

  setSliderRef = (slider) => {
    this.sliderRef = slider;
  };

  setSliderHandleRef = (handle) => {
    this.sliderHandleRef = handle;
  };

  /** attach mousemove & mouseup event listeners to body for handling user drag & release action */
  addEventListeners = () => {
    document.body.addEventListener("mousemove", this.handleMouseMove);
    document.body.addEventListener("mouseup", this.onEnd);
  };

  /** remove mousemove & mouseup event listeners from body once user releases the cursor */
  removeEventListeners = () => {
    document.body.removeEventListener("mousemove", this.handleMouseMove);
    document.body.removeEventListener("mouseup", this.onEnd);
  };

  /** get slider current value based on the position of handle(knob) */
  getCurrentValue = (currentPosition) => {
    const { min, max } = this.props;
    const { sliderRect } = this.state;

    if (this.sliderRef) {
      return getInterpolatedValueWithPosition({
        currentPosition,
        sliderRect,
        min,
        max,
      });
    }
  };

  /** get position of an element based on its value (for markers, handle, etc.) */
  getPosition = (val) => {
    const { min, max } = this.props;
    const { sliderRect } = this.state;

    if (this.sliderRef) {
      return getInterpolatedPosition({ val, sliderRect, min, max });
    }

    return 0;
  };

  /** calculate & update slider value & slider handle position */
  updateValueAndStyle = (clientX) => {
    const { instantUpdate, onChange } = this.props;

    const { value, position } = this.getCurrentValue(clientX);

    this.valueRef = value;
    updateElementStyle(this.sliderHandleRef, position, value);

    if (instantUpdate) {
      onChange(value);
    }
  };

  onMouseDown = (event) => {
    if (this.props.disabled) {
      return;
    }

    this.removeEventListeners();
    this.updateValueAndStyle(event.clientX);
    this.addEventListeners();
  };

  handleMouseMove = debounce((event) => {
    this.updateValueAndStyle(event.clientX);
  }, 5);

  /** remove mouseMove & mouseUp event handler */
  onEnd = () => {
    this.props.onChange(this.valueRef);
    this.removeEventListeners();
  };

  render() {
    const { segments, min, max, showMarks, customMarkers } = this.props;
    const { sliderRect } = this.state;
    const { segmentList, segmentBgCSS } = computeSegments(segments, min, max);

    return (
      <SliderWrapper
        ref={this.setSliderRef}
        onMouseDown={this.onMouseDown}
        className="slider"
      >
        {sliderRect && (
          <>
            <SliderTrack bgCSS={segmentBgCSS} />
            <SliderMarker
              min={min}
              max={max}
              segments={segmentList}
              showMarks={showMarks}
              customMarkers={customMarkers}
              getPosition={this.getPosition}
            />
            <SliderHandle
              value={this.valueRef}
              ref={this.setSliderHandleRef}
              getHandlePosition={this.getPosition}
            />
          </>
        )}
      </SliderWrapper>
    );
  }
}

Slider.defaultProps = {
  disabled: false,
  instantUpdate: false,
  linear: true,
  onChange: () => {},
};

export default Slider;
