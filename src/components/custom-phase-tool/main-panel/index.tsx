import styled from "styled-components";

import Button from "@/components/common/button";
import Divider from "@/components/main-panel/items/divider";
import Row from "@/components/main-panel/items/row";

import Item from "./item";
import SubPanel from "./sub-panel";

const Container = styled.div`
  width: 30em;
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: auto;
`;

const LeftPanelContainer = styled.div`
  width: 13.5em;
  max-width: 13.5em;
  background-color: var(--panelColorNormal);
  backdrop-filter: var(--panelBlur);
  color: var(--textColor);
  flex: 1;
  position: relative;
  padding: 0.25em;
`;

const RightPanelContainer = styled.div`
  width: 16.5em;
  max-width: 16.5em;
  background-color: var(--sectionBackgroundColor);
  backdrop-filter: var(--panelBlur);
  flex: 1;
  position: relative;
  padding: 0.25em;
  overflow-y: scroll;
`;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: auto;
  overflow-y: scroll;
`;

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

export default function MainPanel(props: {items: MainPanelItem[]}) {
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
      <LeftPanelContainer>
        <ItemContainer>
          {props.items.map(item => item.itemType == "customPhase" && <Item data={item} />)}
        </ItemContainer>
        {length > 0 && <Divider />}
        {length < 16 && <AddButton />}
        <SaveButton />
      </LeftPanelContainer>
      <RightPanelContainer>
        {activeItem && <SubPanel data={activeItem.itemType == "customPhase" ? activeItem : null} />}
        {!activeItem && currentItem && <SubPanel data={currentItem.itemType == "customPhase" ? currentItem : null} statisticsOnly={true} />}
      </RightPanelContainer>
    </Container>
  );
}