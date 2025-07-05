import { useContext } from 'react';
import styled from 'styled-components';

import { LocaleContext } from '@/context';
import { getString } from '@/localisations';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const TitleText = styled.div`
  color: var(--textColorDim);
`;

const SecondaryText = styled.div`
  color: var(--textColorDim);
`;

export default function TitleDim(props: MainPanelItemTitle) {
  const locale = useContext(LocaleContext);
  return (
    <Container>
      <TitleText>{getString(locale, props.title)}</TitleText>
      {props.secondaryText && <SecondaryText>{getString(locale, props.secondaryText)}</SecondaryText>}
    </Container>
  );
}