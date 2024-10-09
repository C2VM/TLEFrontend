import { useContext } from 'react';
import styled from 'styled-components';

import { call } from 'cs2/api';

import { LocaleContext } from '@/context';
import { getString } from '@/localisations';

import Row from './row';
import MainPanelRange from './range';
import Divider from './divider';

import Tune from '@/components/common/icons/tune';
import ChevronUp from '@/components/common/icons/chevron-up';
import ChevronDown from '@/components/common/icons/chevron-down';
import Delete from '@/components/common/icons/delete';
import Check from '@/components/common/icons/check';

const Label = styled.div`
  color: var(--textColor);
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: auto;
  display: inline;
`;

const IconContainer = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: auto;
  flex-direction: row;
  display: flex;
  justify-content: flex-end;
`;

const IconStyle = {
  marginLeft: "10rem",
  color: "var(--textColorDim)",
  width: "24rem"
};

const IconStyleDisabled = {
  opacity: 0.3
};

const ActiveDot = () => <div style={{color: "#34bf42", marginLeft: "6rem"}}>•</div>;

export default function CustomPhase(props: { data: MainPanelItemCustomPhase }) {
  const locale = useContext(LocaleContext);
  const swap = (index1: number, index2: number) => {
    if (index1 < 0 || index2 < 0 || index1 >= props.data.length || index2 >= props.data.length) {
      return;
    }
    call("C2VM.TLE", "CallSwapCustomPhase", JSON.stringify({index1, index2}));
  };
  return (
    <>
      <Row>
        <Label>{getString(locale, "Phase") + " #" + (props.data.index + 1)}{props.data.activeIndex < 0 && props.data.index + 1 == props.data.currentSignalGroup && <ActiveDot />}</Label>
        <IconContainer>
          {props.data.activeIndex != props.data.index && <Tune style={IconStyle} onClick={() => call("C2VM.TLE", "CallSetActiveEditingCustomPhaseIndex", JSON.stringify({index: props.data.index}))} />}
          {props.data.activeIndex == props.data.index && <>
            <Delete style={IconStyle} onClick={() => call("C2VM.TLE", "CallRemoveCustomPhase", JSON.stringify({index: props.data.index}))} />
            <Check style={IconStyle} onClick={() => call("C2VM.TLE", "CallSetActiveEditingCustomPhaseIndex", JSON.stringify({index: -1}))} />
            <ChevronUp style={{...IconStyle, ...(props.data.activeIndex <= 0 && IconStyleDisabled)}} onClick={() => swap(props.data.activeIndex, props.data.activeIndex - 1)} />
            <ChevronDown style={{...IconStyle, ...(props.data.activeIndex >= (props.data.length - 1) && IconStyleDisabled)}} onClick={() => swap(props.data.activeIndex, props.data.activeIndex + 1)} />
          </>}
        </IconContainer>
      </Row>
      {props.data.activeIndex == props.data.index && <>
        <MainPanelRange data={{
            itemType: "range",
            key: "MinimumDurationMultiplier",
            label: "MinimumDurationMultiplier",
            value: props.data.minimumDurationMultiplier,
            valuePrefix: "",
            valueSuffix: "CustomPedestrianDurationMultiplierSuffix",
            min: 0.5,
            max: 10,
            step: 0.5,
            engineEventName: "C2VM.TLE.CallUpdateCustomPhaseData"
          }}
        />
      </>}
      <Divider />
    </>
  );
}