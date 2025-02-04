import React, { memo } from "react";
import { SliderScale } from "./styles";

const Track = (props) => (
  <SliderScale className="slider-scale" bgCSS={props.bgCSS} />
);

export default memo(Track);
