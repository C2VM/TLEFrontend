import styled from 'styled-components';

import TrafficSignButton from '../common/traffic-sign-button';

const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  align-items: center;
  margin: 0 0 -6rem 0;
`;

const Box = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  align-items: center;
  margin: 0 0 6rem 0;
`;

export default function Lane(props: {data: LaneDirection, onClick: (eventName: "banLeft" | "banRight" | "banStraight" | "banUTurn") => void}) {
  const opacity = (allow: boolean) => allow ? 1 : 0.25;
  return (
    <>
      {/* <Box style={{flex: "0 0 60rem", justifyContent: "flex-start"}}>{props.data.label}</Box> */}
      <Container>
        <Box>
          <TrafficSignButton
            allow={!props.data.banLeft}
            variant="sign"
            sign="←"
            state="stop"
            onClick={() => props.onClick("banLeft")}
            style={{opacity: opacity(!props.data.banLeft)}}
          />
        </Box>
        <Box>
          <TrafficSignButton
            allow={!props.data.banStraight}
            variant="sign"
            sign="↑"
            state="stop"
            onClick={() => props.onClick("banStraight")}
            style={{opacity: opacity(!props.data.banStraight)}}
          />
        </Box>
        <Box>
          <TrafficSignButton
            allow={!props.data.banRight}
            variant="sign"
            sign="→"
            state="stop"
            onClick={() => props.onClick("banRight")}
            style={{opacity: opacity(!props.data.banRight)}}
          />
        </Box>
        {props.data.leftHandTraffic && (
        <Box>
          <TrafficSignButton
            allow={!props.data.banUTurn}
            variant="sign"
            sign="↷"
            state="stop"
            onClick={() => props.onClick("banUTurn")}
            style={{opacity: opacity(!props.data.banUTurn)}}
          />
        </Box>)}
        {!props.data.leftHandTraffic && (
        <Box>
          <TrafficSignButton
            allow={!props.data.banUTurn}
            variant="sign"
            sign="↶"
            state="stop"
            onClick={() => props.onClick("banUTurn")}
            style={{opacity: opacity(!props.data.banUTurn)}}
          />
        </Box>)}
      </Container>
    </>
  );
}