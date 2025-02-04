import styled, { css } from "styled-components";

const commonStyle = css`
  position: absolute;
  opacity: 0;
  visibility: hidden;
  z-index: 1;
  transition: opacity 0.3s;
`;

export const HandleWrapper = styled.div`
  position: absolute;
  background-color: #363d41;
  border: 1px solid #fff;
  border-radius: 50%;
  height: ${({ size = 16 }) => size}px;
  width: ${({ size = 16 }) => size}px;
  will-change: transform;
  transform: translateX(
    ${({ position, size = 16 }) => position - size / 2 - 1}px
  );
  z-index: 2;

  /* constructing tool-tip for the slider handle */
  &::before {
    ${commonStyle}
    content: attr(data-tooltip-label);
    background-color: #363d41;
    border-radius: 4px;
    bottom: 150%;
    box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.1);
    color: #fff;
    min-width: ${({ width = 43 }) => width}px;
    padding: 7px 0;
    text-align: center;
    transform: translateX(-50%);
    z-index: 1;
  }

  &::after {
    ${commonStyle}
    content: "";
    border-color: #363d41 transparent transparent transparent;
    border-style: solid;
    border-width: 5px;
    margin-left: -5px;
    left: 50%;
    bottom: 90%;
  }

  /* on hover/click/drag of knob show tooltip with value*/
  &:hover,
  &:active {
    &::before,
    &::after {
      opacity: 1;
      visibility: visible;
    }
  }
`;
