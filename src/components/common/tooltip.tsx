import { CSSProperties, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

const Container = styled.div``;

const TooltipContainer = styled.div<{show: boolean}>`
  font-size: var(--fontSizeS);
  color: var(--textColorDim);
  background-color: var(--tooltipColor);
  filter: var(--tooltipFilter);
  border-radius: 4rem;
  padding: 0.5em 0.5em;
  margin: 0;
  position: fixed;
  display: ${props => props.show ? "block" : "none"};
  text-align: center;
  z-index: 100;
`;

const bottomStyle: CSSProperties = {
  marginTop: "0.25em",
  transform: "translate(-50%, 0)",
};

const bottomStartStyle: CSSProperties = {
  marginTop: "0.25em",
};

const rightStartStyle: CSSProperties = {
  marginLeft: "0.25em",
};

const rightStyle: CSSProperties = {
  marginLeft: "0.25em",
  transform: "translate(0, -50%)",
};

export default function Tooltip(props: {position: "bottom" | "bottom-start" | "right-start" | "right", tooltip: React.ReactNode, tooltipStyle?: CSSProperties, children?: React.ReactNode}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [tooltipStyle, setTooltipStyle] = useState<CSSProperties>({});
  const showTooltip = () => {
    if (containerRef.current) {
      const element = containerRef.current;
      const rect = element.getBoundingClientRect();
      if (props.position == "bottom") {
        setLeft(rect.left + rect.width / 2);
        setTop(rect.bottom);
        setTooltipStyle(bottomStyle);
      } else if (props.position == "bottom-start") {
        setLeft(rect.left);
        setTop(rect.bottom);
        setTooltipStyle(bottomStartStyle);
      } else if (props.position == "right-start") {
        setLeft(rect.right);
        setTop(rect.top);
        setTooltipStyle(rightStartStyle);
      } else if (props.position == "right") {
        setLeft(rect.right);
        setTop(rect.top + rect.height / 2);
        setTooltipStyle(rightStyle);
      }
      setShow(true);
    }
  };
  return (
    <>
      <Container ref={containerRef} onMouseEnter={showTooltip} onMouseLeave={() => setShow(false)}>
        {props.children}
      </Container>
      {show && createPortal(
        <TooltipContainer show={show} style={{left, top, ...tooltipStyle, ...props.tooltipStyle}}>
          {props.tooltip}
        </TooltipContainer>,
        document.body
      )}
    </>
  );
}