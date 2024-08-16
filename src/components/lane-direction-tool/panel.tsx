import { translatePosition, engineCall } from '@/engine';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import Lane from './lane';
import Button from '@/components/common/button';

const Container = styled.div`
  position: fixed;
  transition: left 0.1s linear, top 0.1s linear;
`;

const Header = styled.div`
  border-radius: 4rem 4rem 0rem 0rem;
  background-color: var(--panelColorDark);
  backdrop-filter: var(--panelBlur);
  color: var(--accentColorNormal);
  font-size: 14rem;
  padding: 6rem 10rem;
  min-height: 36rem;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const HeaderImage = styled.img`
  width: 24rem;
  height: 24rem;
`;

const HeaderTitle = styled.div`
  text-transform: uppercase;
  flex: 1;
  text-align: center;
  overflow-x: hidden;
  overflow-y: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Content = styled.div`
  border-radius: 4rem;
  background-color: var(--panelColorNormal);
  backdrop-filter: var(--panelBlur);
  color: var(--textColor);
  flex: 1;
  position: relative;
  padding: 6rem;
`;

const LaneContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-content: center;
  margin: 0 0 6rem 0;
`;

const Row = styled.div`
  padding: 0;
  width: 100%;
  display: flex;
`;

const Column = styled.div`
  padding: 0rem;
  display: flex;
  flex: 0 1 auto;
`;

const Divider = styled.div`
  height: 100%;
  width: 0rem;
  border: 1rem solid rgba(255, 255, 255, 0.1);
  margin: 0 6rem;
`;

export default function Panel(props: {data: LaneDirectionToolPanel, onSave?: () => void}) {
  const [panel, setPanel] = useState(props.data.lanes);
  const [screenPosition, setScreenPosition] = useState<ScreenPosition>({left: -999, top: -999});

  useEffect(() => {
    setPanel(props.data.lanes);
  }, [props.data.lanes]);

  useEffect(() => {
    const updatePosition = async () => {
      setScreenPosition(await translatePosition(props.data.position));
    };
    updatePosition();
    const intervalID = setInterval(updatePosition, 100);
    return () => clearInterval(intervalID);
  }, [props.data.position]);

  const laneClickHandler = (index: number, eventName: "banLeft" | "banRight" | "banStraight" | "banUTurn") => {
    setPanel((state) => {
      return state.map((lane, i) => {
        if (i != index) {
          return lane;
        }
        lane[eventName] = !lane[eventName];
        return lane;
      });
    });
  };

  const buttonClickHandler = useCallback((engineEventName: string) => {
    if (props.onSave) {
      props.onSave();
    }
    engineCall(engineEventName, JSON.stringify(panel));
  }, [props, panel]);

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key == "S") {
        buttonClickHandler("C2VM.TLE.CallLaneDirectionToolPanelSave");
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => document.removeEventListener("keydown", keyDownHandler);
  }, [buttonClickHandler]);

  return (
    <Container style={screenPosition}>
      <Header style={{display: "none"}}>
          <HeaderImage src={props.data.image} />
          <HeaderTitle>{props.data.title}</HeaderTitle>
      </Header>
      <Content>
        <LaneContainer>
          {panel.map((lane, index) => {
            return (
              <>
                <Column>
                  <Lane
                    data={lane}
                    onClick={(eventName: "banLeft" | "banRight" | "banStraight" | "banUTurn") => laneClickHandler(index, eventName)}
                  />
                </Column>
                {index != panel.length - 1 && <Divider />}
              </>
            );
          })}
        </LaneContainer>
        {props.data.items.map((item) => {
          if (item.itemType == "button") {
            return (
              <Row>
                <Button {...item} onClick={() => buttonClickHandler(item.engineEventName)} />
              </Row>
            );
          }
        })}
      </Content>
    </Container>
  );
}