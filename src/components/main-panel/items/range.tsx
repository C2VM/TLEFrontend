import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { LocaleContext } from '@/context';
import { engineCall } from '@/engine';
import { getString } from '@/localisations';

import Range from '@/components/common/range';
import TitleDim from './title-dim';

const Container = styled.div`
  padding: 4rem 8rem;
`;

const Gap = styled.div`
  height: 6rem;
`;

export default function MainPanelRange(props: {data: MainPanelItemRange}) {
  const locale = useContext(LocaleContext);
  const [value, setValue] = useState(0);
  const changeHandler = (value: number) => {
    if ("engineEventName" in props.data) {
      engineCall(props.data.engineEventName, JSON.stringify({key: props.data.key, value}));
    }
  };
  const updateHandler = (value: number) => {
    setValue(value);
  };
  useEffect(() => {
    setValue(props.data.value);
  }, [props.data.value]);
  return (
    <Container>
      <TitleDim itemType="title" title={props.data.label} secondaryText={getString(locale, props.data.valuePrefix) + `${Math.round(value * 100) / 100}` + getString(locale, props.data.valueSuffix)} />
      <Gap />
      <Range data={props.data} onChange={changeHandler} onUpdate={updateHandler} />
    </Container>
  );
}