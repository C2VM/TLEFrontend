import styled from 'styled-components';
import { engineCall } from '@/engine';

const Container = styled.div`
  padding: 3rem 8rem;
  width: 100%;
  display: flex;
`;

export default function Row(props: {data: MainPanelItem, children: React.ReactNode}) {
  const clickHandler = () => {
    if ("engineEventName" in props.data && props.data.engineEventName) {
      engineCall(props.data.engineEventName, JSON.stringify(props.data));
    }
  };

  return (
    <Container onClick={clickHandler}>
      {props.children}
    </Container>
  );
}