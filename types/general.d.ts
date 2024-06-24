interface MainPanel {
  title: string,
  image: string,
  showPanel: boolean,
  showFloatingButton: boolean,
  trafficLightsAssetEntityIndex: number,
  trafficLightsAssetEntityVersion: number,
  items: MainPanelItem[]
}

type MainPanelItem = MainPanelItemTitle | MainPanelItemMessage | MainPanelItemDivider | MainPanelItemRadio | MainPanelItemCheckbox | MainPanelItemButton | MainPanelItemNotification | MainPanelItemRange;

interface MainPanelItemTitle {
  itemType: "title",
  title: string,
  secondaryText?: string
}

interface MainPanelItemMessage {
  itemType: "message",
  message: string
}

interface MainPanelItemDivider {
  itemType: "divider"
}

interface MainPanelItemRadio {
  itemType: "radio",
  type: string,
  isChecked: boolean,
  key: string,
  value: string,
  label: string,
  engineEventName: string
}

interface MainPanelItemCheckbox {
  itemType: "checkbox",
  type: string,
  isChecked: boolean,
  key: string,
  value: string,
  label: string,
  engineEventName: string
}

interface MainPanelItemButton {
  itemType: "button",
  type: "button",
  key: string,
  value: string,
  label: string,
  engineEventName: string
}

interface MainPanelItemNotification {
  itemType: "notification",
  type: "notification",
  label: string,
  notificationType: "warning" | "notice",
  key?: string,
  value?: string,
  engineEventName?: string
}

interface MainPanelItemRange {
  itemType: "range",
  key: string,
  label: string,
  value: number,
  valuePrefix: string,
  valueSuffix: string,
  min: number,
  max: number,
  step: number,
  engineEventName: string
}

interface WorldPosition {
  x: number,
  y: number,
  z: number
}

interface ScreenPosition {
  left: number,
  top: number
}

interface LaneDirectionTool {
  buttons: LaneToolButton[],
  panels: LaneDirectionToolPanel[]
}

interface LaneToolButton {
  image: string,
  visible: boolean,
  position: WorldPosition,
  engineEventName: string
}

interface LaneDirectionToolPanel {
  title: string,
  image: string,
  visible: boolean,
  position: WorldPosition,
  lanes: LaneDirection[],
  items: MainPanelItemButton[]
}

interface LaneDirection {
  itemType: "lane",
  position: WorldPosition,
  leftHandTraffic: boolean,
  label: string,
  banLeft: boolean,
  banRight: boolean,
  banStraight: boolean,
  banUTurn: boolean
}