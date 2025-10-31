import styled from "styled-components";

export const Mark = styled.span`
  position: absolute;
  height: ${({ height = 8 }) => height}px;
  transform: translateX(${({ position, width = 2 }) => position - width / 2}px);
  border-left: ${({ width = 2, color = "#363d41" }) =>
    `${width}px dashed ${color}`};
  z-index: 1;
`;

export const Label = styled.span`
  position: absolute;
  transform: translate(
    ${({ position, width = 30 }) => position - width / 2}px,
    -40px
  );
  min-width: 30px;
  text-align: center;
`;
