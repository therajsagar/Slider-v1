import styled from "styled-components";

export const SliderScale = styled.span`
  height: 6px;
  box-sizing: border-box;
  position: absolute;
  width: 100%;
  box-sizing: border-box;
  background: ${({ bgCSS }) => bgCSS};

  &::before {
    content: "";
    position: absolute;
    width: 100%;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    border-top: 2px dashed #d9d9d9;
    z-index: -1;
  }
`;
