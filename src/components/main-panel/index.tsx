import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import engine from 'cohtml/cohtml';
import { bindValue, useValue } from 'cs2/api';

import { MainPanelState } from '@/constants';

import Header from './header';
import Content from './content';

import FloatingButton from '@/components/common/floating-button';
import CustomPhaseMainPanel from '@/components/custom-phase-tool/main-panel';

const defaultPanel = {
  title: "",
  image: "",
  position: {top: -999999, left: -999999},
  showPanel: false,
  showFloatingButton: false,
  state: 0,
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
      position: newPanel.position ?? defaultPanel.position,
      showPanel: newPanel.showPanel ?? defaultPanel.showPanel,
      showFloatingButton: newPanel.showFloatingButton ?? defaultPanel.showFloatingButton,
      state: newPanel.state ?? defaultPanel.state,
      items: newPanel.items ?? defaultPanel.items
    });
  }, [result]);

  return panel;
};

const Container = styled.div`
  position: absolute;
  top: calc(10rem + var(--floatingToggleSize));
  left: 0rem;
  border-radius: 4rem;
  overflow: hidden;
`;

export default function MainPanel() {
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const [top, setTop] = useState(-999999);
  const [left, setLeft] = useState(-999999);
  const [dragging, setDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [toolLayout, setToolLayout] = useState<Element | null>(null);

  const panel = useMainPanel();

  useEffect(() => {
    setShowPanel(panel.showPanel);
    setShowFloatingButton(panel.showFloatingButton);
    if (!dragging) {
      setTop(panel.position.top);
      setLeft(panel.position.left);
    }
  }, [panel, panel.showPanel, panel.showFloatingButton, panel.position.top, panel.position.left, dragging]);

  // Save everything when the panel is closed
  useEffect(() => {
    const elements = window.document.getElementsByClassName("tool-layout_SqM");
    setToolLayout(elements.length > 0 ? elements[0] : null);
    return () => {
      engine.call("C2VM.TLE.CallMainPanelSave", "{}");
    };
  }, []);

  const floatingButtonClickHandler = () => {
    if (panel.showPanel) {
      engine.call("C2VM.TLE.CallSetMainPanelState", JSON.stringify({value: "0"}));
    } else {
      engine.call("C2VM.TLE.CallSetMainPanelState", JSON.stringify({value: "1"}));
    }
  };

  const mouseDownHandler = (_event: React.MouseEvent<HTMLElement>) => {
    if (containerRef.current && toolLayout) {
      const rect = containerRef.current.getBoundingClientRect();
      const tlRect = toolLayout.getBoundingClientRect();
      setTop(rect.top - tlRect.top);
      setLeft(rect.left - tlRect.left);
      setDragging(true);
    }
  };
  const mouseUpHandler = useCallback((_event: MouseEvent) => {
    if (dragging && containerRef.current && toolLayout) {
      const rect = containerRef.current.getBoundingClientRect();
      const tlRect = toolLayout.getBoundingClientRect();
      engine.call("C2VM.TLE.CallMainPanelUpdatePosition", JSON.stringify({top: Math.floor(rect.top - tlRect.top), left: Math.floor(rect.left - tlRect.left)}));
    }
    setDragging(false);
  }, [dragging, toolLayout]);
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
  }, [dragging, mouseUpHandler]);

  const style: React.CSSProperties = useMemo(
    () => {
      const result: React.CSSProperties = {
        display: showPanel ? "block" : "none"
      };
      if (toolLayout && toolLayout.clientHeight > 0) {
        let panelTop = top;
        if (panelTop < 0 && containerRef.current) {
          panelTop = containerRef.current.offsetTop;
        }
        result.maxHeight = toolLayout.clientHeight - panelTop;
        if (result.maxHeight < 200) {
          result.maxHeight = 200;
        }
      }
      if (top > -999999 && left > -999999) {
        result.top = top >= 0 ? top : 0;
        result.left = left >= 0 ? left : 0;
        if (toolLayout && toolLayout.clientWidth > 0 && toolLayout.clientHeight > 0 && containerRef && containerRef.current && containerRef.current.clientWidth > 0 && containerRef.current.clientHeight > 0) {
          result.top = result.top > toolLayout.clientHeight - containerRef.current.clientHeight ? toolLayout.clientHeight - containerRef.current.clientHeight : result.top;
          result.left = result.left > toolLayout.clientWidth - containerRef.current.clientWidth ? toolLayout.clientWidth - containerRef.current.clientWidth : result.left;
        }
      }
      return result;
    }, [showPanel, top, left, toolLayout, containerRef, panel]
  );

  return (
    <>
      <FloatingButton
        show={showFloatingButton}
        src="Media/Game/Icons/TrafficLights.svg"
        tooltip={panel.title}
        onClick={floatingButtonClickHandler}
      />
      <Container
        ref={containerRef}
        style={style}
      >
        <Header title={panel.title} image={panel.image} onMouseDown={mouseDownHandler} />
        {panel.state != MainPanelState.CustomPhase && <Content items={panel.items} />}
        {panel.state == MainPanelState.CustomPhase && <CustomPhaseMainPanel items={panel.items} />}
      </Container>
    </>
  );
}