import { useContext } from 'react';
import styled from 'styled-components';

import { LocaleContext } from '@/context';
import { getString } from '@/localisations';

import Title from './items/title';
import Message from './items/message';
import Divider from './items/divider';
import Range from './items/range';
import Row from './items/row';
import Notification from './items/notification';

import Button from '@/components/common/button';
import Radio from '@/components/common/radio';
import Checkbox from '@/components/common/checkbox';

const Container = styled.div`
  background-color: var(--panelColorNormal);
  backdrop-filter: var(--panelBlur);
  color: var(--textColor);
  border-radius: 0rem 0rem 4rem 4rem;
  flex: 1;
  position: relative;
  padding: 6rem;
`;

const Label = styled.span`
  color: var(--textColorDim);
  display: flex;
  flex: 1;
`;

export default function Content(props: {items: MainPanelItem[]}) {
  const locale = useContext(LocaleContext);
  return (
    <Container>
      {props.items.map((item) => {
        if (item.itemType == "title") {
          return <Row data={item}><Title {...item} /></Row>;
        }
        if (item.itemType == "message") {
          return <Row data={item}><Message {...item} /></Row>;
        }
        if (item.itemType == "divider") {
          return <Divider />;
        }
        if (item.itemType == "radio") {
          return (
            <Row data={item}>
              <Radio {...item} />
              <Label>{getString(locale, item.label)}</Label>
            </Row>
          );
        }
        if (item.itemType == "checkbox") {
          return (
            <Row data={item}>
              <Checkbox {...item} />
              <Label>{getString(locale, item.label)}</Label>
            </Row>
          );
        }
        if (item.itemType == "button") {
          return <Row data={item}><Button {...item} /></Row>;
        }
        if (item.itemType == "notification") {
          return <Notification data={item} />;
        }
        if (item.itemType == "range") {
          return <Range data={item} />;
        }
        return <></>;
      })}
    </Container>
  );
}