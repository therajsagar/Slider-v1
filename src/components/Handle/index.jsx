import React, { forwardRef, memo } from "react";
import { HandleWrapper } from "./styles";

const Handle = forwardRef(({ value, getHandlePosition }, ref) => {
  return (
    <HandleWrapper
      ref={ref}
      className="slider-handle"
      position={getHandlePosition(value)}
      data-tooltip-label={value}
    />
  );
});

export default memo(Handle);
