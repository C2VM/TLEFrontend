import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import engine from 'cohtml/cohtml';
import { bindValue, useValue } from 'cs2/api';

import Content from './content';
import FloatingButton from '@/components/common/floating-button';
import Header from './header';

const defaultPanel = {
  title: "",
  image: "",
  showPanel: false,
  showFloatingButton: false,
  trafficLightsAssetEntityIndex: 0,
  trafficLightsAssetEntityVersion: 0,
  items: []
};

const useMainPanel = () => {
  const [panel, setPanel] = useState<MainPanel>(defaultPanel);

  const result = useValue(bindValue("C2VM.TLE", "GetMainPanel", "{}"));

  useEffect(() => {
    const newPanel = JSON.parse(result);
    setPanel({
      title: newPanel.title ?? defaultPanel.title,
      image: newPanel.image ?? defaultPanel.image,
      showPanel: newPanel.showPanel ?? defaultPanel.showPanel,
      showFloatingButton: newPanel.showFloatingButton ?? defaultPanel.showFloatingButton,
      trafficLightsAssetEntityIndex: newPanel.trafficLightsAssetEntityIndex ?? defaultPanel.trafficLightsAssetEntityIndex,
      trafficLightsAssetEntityVersion: newPanel.trafficLightsAssetEntityVersion ?? defaultPanel.trafficLightsAssetEntityVersion,
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
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const [top, setTop] = useState(-999);
  const [left, setLeft] = useState(-999);
  const [dragging, setDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const panel = useMainPanel();

  useEffect(() => {
    setShowPanel(panel.showPanel);
    setShowFloatingButton(panel.showFloatingButton);
  }, [panel, panel.showPanel, panel.showFloatingButton]);

  // Save everything when the panel is closed
  useEffect(() => {
    return () => {
      engine.call("C2VM.TLE.CallMainPanelSave", "{}");
    };
  }, []);

  const floatingButtonClickHandler = () => {
    if (panel.showPanel) {
      engine.trigger("toolbar.clearAssetSelection");
    } else {
      engine.trigger("toolbar.selectAsset", {
        index: panel.trafficLightsAssetEntityIndex,
        version: panel.trafficLightsAssetEntityVersion,
        __Type: "Unity.Entities.Entity"
      }, true);
    }
  };

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
    <>
      <FloatingButton
        show={showFloatingButton}
        src="Media/Game/Icons/TrafficLights.svg"
        onClick={floatingButtonClickHandler}
      />
      <Container
        ref={containerRef}
        style={style}
      >
        <Header onMouseDown={mouseDownHandler} {...panel} />
        <Content items={panel.items} />
      </Container>
    </>
  );
}