import styled from 'styled-components';
import Radio from '@/components/common/radio';

const Label = styled.span`
  color: var(--textColorDim);
`;

export default function Pattern(props: MainPanelItemRadio) {
  return (
    <>
      <Radio isChecked={props.isChecked} />
      <Label>{props.label}</Label>
    </>
  );
}