import { engineCall, translatePosition } from '@/engine';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const ButtonComponent = styled.div<{visible: boolean}>`
  padding: 3rem;
  border-radius: 3rem;
  background-color: var(--panelColorNormal);
  display: ${props => props.visible ? "block" : "none"};
  position: fixed;
  transition: left 0.1s linear, top 0.1s linear;
`;

const Image = styled.img`
  width: 28rem;
  height: 28rem;
`;

export default function Button(props: {data: LaneToolButton, onClick?: () => void}) {
  const [screenPosition, setScreenPosition] = useState<ScreenPoint>({left: -999, top: -999});

  useEffect(() => {
    const updatePosition = async () => {
      const translatedPosition = await translatePosition(props.data.position);
      setScreenPosition({left: translatedPosition.left - 17, top: translatedPosition.top - 17});
    };
    updatePosition();
    const intervalID = setInterval(updatePosition, 100);
    return () => clearInterval(intervalID);
  }, [props.data.position]);

  const clickHandler = () => {
    if (props.onClick) {
      props.onClick();
    }
    if (props.data.engineEventName.length > 0) {
      engineCall(props.data.engineEventName, JSON.stringify(props.data));
    }
  };

  return (
    <ButtonComponent onClick={clickHandler} visible={props.data.visible} style={screenPosition}>
      <Image src={props.data.image} />
    </ButtonComponent>
  );
}