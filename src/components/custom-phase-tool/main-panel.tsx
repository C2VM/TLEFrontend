import { useContext } from 'react';
import styled from 'styled-components';

import { call } from 'cs2/api';

import { LocaleContext } from '@/context';
import { getString } from '@/localisations';

import Row from '@/components/main-panel/items/row';
import MainPanelRange from '@/components/main-panel/items/range';
import Divider from '@/components/main-panel/items/divider';
import Title from '@/components/main-panel/items/title';
import TitleDim from '@/components/main-panel/items/title-dim';

import Checkbox from '@/components/common/checkbox';
import Button from '@/components/common/button';

import Tune from '@/components/common/icons/tune';
import ChevronUp from '@/components/common/icons/chevron-up';
import ChevronDown from '@/components/common/icons/chevron-down';
import Delete from '@/components/common/icons/delete';
import Check from '@/components/common/icons/check';

const Container = styled.div`
  width: 660rem;
  display: flex;
  flex-direction: row;
`;

const MainPanelContainer = styled.div`
  width: 300rem;
  max-width: 300rem;
  background-color: var(--panelColorNormal);
  backdrop-filter: var(--panelBlur);
  color: var(--textColor);
  flex: 1;
  position: relative;
  padding: 6rem;
  overflow-y: scroll;
`;

const SubPanelContainer = styled.div`
  width: 360rem;
  max-width: 360rem;
  background-color: var(--sectionBackgroundColor);
  backdrop-filter: var(--panelBlur);
  flex: 1;
  position: relative;
  padding: 6rem;
  overflow-y: scroll;
`;

const Filler = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: auto;
`;

const Label = styled.div`
  color: var(--textColor);
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: auto;
  display: inline;
`;

const DimLabel = styled.div`
  color: var(--textColorDim);
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

const AddButton = () => {
  const data: MainPanelItemButton = {
    itemType: "button",
    type: "button",
    key: "add",
    value: "add",
    label: "Add",
    engineEventName: "C2VM.TLE.CallAddCustomPhase"
  };
  return (
    <Row data={data}><Button {...data} /></Row>
  );
};

const SaveButton = () => {
  const data: MainPanelItemButton = {
    itemType: "button",
    type: "button",
    key: "state",
    value: "2",
    label: "Save",
    engineEventName: "C2VM.TLE.CallSetMainPanelState"
  };
  return (
    <Row data={data}><Button {...data} /></Row>
  );
};

export default function MainPanel(props: { items: MainPanelItem[] }) {
  let activeIndex = -1;
  let activeItem = null;
  let currentItem = null;
  let currentSignalGroup = 0;
  let length = 0;
  if (props.items.length > 0 && props.items[0].itemType == "customPhase") {
    activeIndex = props.items[0].activeIndex;
    currentSignalGroup = props.items[0].currentSignalGroup;
    length = props.items[0].length;
  }
  if (activeIndex >= 0) {
    activeItem = props.items[activeIndex];
  }
  if (currentSignalGroup > 0 && currentSignalGroup - 1 < props.items.length) {
    currentItem = props.items[currentSignalGroup - 1];
  }
  return (
    <Container>
      <MainPanelContainer>
        {props.items.map(item => item.itemType == "customPhase" && <CustomPhaseItem data={item} />)}
        <Filler />
        {length > 0 && <Divider />}
        {length < 16 && <AddButton />}
        <SaveButton />
      </MainPanelContainer>
      <SubPanelContainer>
        {activeItem && <SubPanelContent data={activeItem.itemType == "customPhase" ? activeItem : null} />}
        {!activeItem && currentItem && <SubPanelContent data={currentItem.itemType == "customPhase" ? currentItem : null} statisticsOnly={true} />}
      </SubPanelContainer>
    </Container>
  );
}

const CustomPhaseItem = (props: { data: MainPanelItemCustomPhase }) => {
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
      {props.data.index + 1 < props.data.length && <Divider />}
    </>
  );
};

const ItemTitle = (props: { title: string, secondaryText?: string, dim?: boolean }) => {
  const item: MainPanelItemTitle = {
    itemType: "title",
    ...props
  };
  if (props.dim) {
    return <Row data={item}><TitleDim {...item} /></Row>;
  } else {
    return <Row data={item}><Title {...item} /></Row>;
  }
};

const SubPanelContent = (props: { data: MainPanelItemCustomPhase | null, statisticsOnly?: boolean }) => {
  const locale = useContext(LocaleContext);
  const data = props.data;

  if (!data) {
    return <></>;
  }

  return (
    <>
      {!props.statisticsOnly && <>
        <ItemTitle title="Options" />
        <Row data={{
            itemType: "checkbox",
            type: "",
            isChecked: data.prioritiseTrack,
            key: "PrioritiseTrack",
            value: "0",
            label: "",
            engineEventName: "C2VM.TLE.CallUpdateCustomPhaseData"
          }}
        >
          <Checkbox isChecked={data.prioritiseTrack} />
          <DimLabel>{getString(locale, "PrioritiseTrack")}</DimLabel>
        </Row>
        <Row data={{
            itemType: "checkbox",
            type: "",
            isChecked: data.prioritisePublicCar,
            key: "PrioritisePublicCar",
            value: "0",
            label: "",
            engineEventName: "C2VM.TLE.CallUpdateCustomPhaseData"
          }}
        >
          <Checkbox isChecked={data.prioritisePublicCar} />
          <DimLabel>{getString(locale, "PrioritisePublicCar")}</DimLabel>
        </Row>
        <Row data={{
            itemType: "checkbox",
            type: "",
            isChecked: data.prioritisePedestrian,
            key: "PrioritisePedestrian",
            value: "0",
            label: "",
            engineEventName: "C2VM.TLE.CallUpdateCustomPhaseData"
          }}
        >
          <Checkbox isChecked={data.prioritisePedestrian} />
          <DimLabel>{getString(locale, "PrioritisePedestrian")}</DimLabel>
        </Row>
        <Divider />
        <ItemTitle title="Adjustments" />
        <MainPanelRange data={{
            itemType: "range",
            key: "MinimumDuration",
            label: "MinimumDuration",
            value: data.minimumDuration,
            valuePrefix: "",
            valueSuffix: "s",
            min: 0,
            max: 30,
            step: 1,
            engineEventName: "C2VM.TLE.CallUpdateCustomPhaseData"
          }}
        />
        <MainPanelRange data={{
            itemType: "range",
            key: "TargetDurationMultiplier",
            label: "TargetDurationMultiplier",
            value: data.targetDurationMultiplier,
            valuePrefix: "",
            valueSuffix: "CustomPedestrianDurationMultiplierSuffix",
            min: 0.1,
            max: 10,
            step: 0.1,
            engineEventName: "C2VM.TLE.CallUpdateCustomPhaseData"
          }}
        />
        <MainPanelRange data={{
            itemType: "range",
            key: "LaneOccupiedMultiplier",
            label: "LaneOccupiedMultiplier",
            value: data.laneOccupiedMultiplier,
            valuePrefix: "",
            valueSuffix: "CustomPedestrianDurationMultiplierSuffix",
            min: 0.1,
            max: 10,
            step: 0.1,
            engineEventName: "C2VM.TLE.CallUpdateCustomPhaseData"
          }}
        />
        <MainPanelRange data={{
            itemType: "range",
            key: "IntervalExponent",
            label: "IntervalExponent",
            value: data.intervalExponent,
            valuePrefix: "",
            valueSuffix: "",
            min: 0.1,
            max: 10,
            step: 0.1,
            engineEventName: "C2VM.TLE.CallUpdateCustomPhaseData"
          }}
        />
        <Divider />
      </>}
      <ItemTitle title="Statistics" />
      <ItemTitle title="Timer" secondaryText={`${data.timer} / ${Round(Math.max(data.targetDuration, data.minimumDuration))}`} dim={true} />
      <ItemTitle title="Priority" secondaryText={`${data.priority}`} dim={true} />
      <ItemTitle title="LastRun" secondaryText={`${data.turnsSinceLastRun}`} dim={true} />
      <ItemTitle title="CarFlow" secondaryText={`${Round(data.carFlow)}`} dim={true} />
      <ItemTitle title="LanesOccupied" secondaryText={`${data.carLaneOccupied}, ${data.publicCarLaneOccupied}, ${data.trackLaneOccupied}, ${data.pedestrianLaneOccupied}`} dim={true} />
      <ItemTitle title="WeightedWaiting" secondaryText={`${Round(data.weightedWaiting)}`} dim={true} />
    </>
  );
};

function Round(num: number): number {
  return Math.round(num * 100) / 100;
}