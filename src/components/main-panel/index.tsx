import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import Header from './header';
import Content from './content';
import { engineCall, useEngineOn } from '@/engine';

const defaultPanel = {
  title: "",
  image: "",
  shouldShowPanel: false,
  items: []
};

const useMainPanel = () => {
  const [panel, setPanel] = useState<MainPanel>(defaultPanel);

  const result = useEngineOn("C2VM-TLE-Event-UpdateMainPanel", "{}");

  useEffect(() => {
    const newPanel = JSON.parse(result);
    setPanel({
      title: newPanel.title ?? defaultPanel.title,
      image: newPanel.image ?? defaultPanel.image,
      shouldShowPanel: newPanel.shouldShowPanel ?? defaultPanel.shouldShowPanel,
      items: newPanel.items ?? defaultPanel.items
    });
  }, [result]);

  return panel;
};

const Container = styled.div`
  width: 330rem;
  position: absolute;
  top: calc(10rem + var(--floatingToggleSize));
  left: 0rem;
`;

export default function MainPanel() {
  const [showPanel, setShowPanel] = useState(false);

  const [top, setTop] = useState(-999);
  const [left, setLeft] = useState(-999);
  const [dragging, setDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const panel = useMainPanel();

  useEffect(() => {
    if (panel.title.length == 0) {
      engineCall("C2VM-TLE-Call-MainPanel-Update");
    }
    setShowPanel(panel.shouldShowPanel);
  }, [panel, panel.shouldShowPanel]);

  // Save everything when the panel is closed
  useEffect(() => {
    return () => {
      engineCall("C2VM-TLE-Call-MainPanel-Save", "{}");
    };
  }, []);

  const mouseDownHandler = (_event: React.MouseEvent<HTMLElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTop(rect.top);
      setLeft(rect.left);
      setDragging(true);
    }
  };
  const mouseUpHandler = (_event: MouseEvent) => {
    setDragging(false);
  };
  const mouseMoveHandler = (event: MouseEvent) => {
    setTop((prev) => prev + event.movementY);
    setLeft((prev) => prev + event.movementX);
  };

  useEffect(() => {
    if (dragging) {
      document.body.addEventListener("mouseup", mouseUpHandler);
      document.body.addEventListener("mousemove", mouseMoveHandler);
      return () => {
        document.body.removeEventListener("mouseup", mouseUpHandler);
        document.body.removeEventListener("mousemove", mouseMoveHandler);
      };
    }
  }, [dragging]);

  const style: React.CSSProperties = {
    display: showPanel ? "block" : "none"
  };
  if (top >= -200 && left >= -200) {
    style.top = top;
    style.left = left;
  }

  return (
    <Container
      ref={containerRef}
      style={style}
    >
      <Header onMouseDown={mouseDownHandler} {...panel} />
      <Content items={panel.items} />
    </Container>
  );
}