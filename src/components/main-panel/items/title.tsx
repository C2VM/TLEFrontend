import { useContext } from 'react';
import styled from 'styled-components';

import { LocaleContext } from '@/context';
import { getString } from '@/localisations';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TitleText = styled.div`
  color: var(--textColor);
`;

const SecondaryText = styled.div`
  color: var(--textColorDim);
  display: flex;
  flex: 1;
`;

export default function Title(props: MainPanelItemTitle) {
  const locale = useContext(LocaleContext);
  return (
    <Container>
      <TitleText>{getString(locale, props.title)}</TitleText>
      {props.secondaryText && <SecondaryText>{getString(locale, props.secondaryText)}</SecondaryText>}
    </Container>
  );
}