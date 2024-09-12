interface MainPanel {
  title: string,
  image: string,
  showPanel: boolean,
  showFloatingButton: boolean,
  trafficLightsAssetEntityIndex: number,
  trafficLightsAssetEntityVersion: number,
  items: MainPanelItem[]
}

type MainPanelItem = MainPanelItemTitle | MainPanelItemMessage | MainPanelItemDivider | MainPanelItemRadio | MainPanelItemCheckbox | MainPanelItemButton | MainPanelItemNotification | MainPanelItemRange | MainPanelItemCustomPhase;

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

interface MainPanelItemCustomPhase {
  itemType: "customPhase",
  activeIndex: number,
  index: number,
  length: number,
  minimumDurationMultiplier: number
}

interface WorldPosition {
  x: number,
  y: number,
  z: number,
  key: string
}

interface ScreenPoint {
  left: number,
  top: number
}

interface ScreenPointMap {
  [key: string]: ScreenPoint
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

interface CityConfiguration {
  leftHandTraffic: boolean
}

interface CustomPhaseLane {
  type: CustomPhaseLaneType,
  left: CustomPhaseSignalState,
  straight: CustomPhaseSignalState,
  right: CustomPhaseSignalState,
  uTurn: CustomPhaseSignalState,
  all: CustomPhaseSignalState
}

type CustomPhaseLaneType = "carLane" | "publicCarLane" | "trackLane" | "pedestrianLaneStopLine" | "pedestrianLaneNonStopLine";

type CustomPhaseLaneDirection = "left" | "straight" | "right" | "uTurn" | "all";

type CustomPhaseSignalState = "stop" | "go" | "yield" | "none";

interface CustomPhaseSignal {
  m_GoGroupMask: number,
  m_YieldGroupMask: number
}

interface CustomPhaseTurn {
  m_Left: CustomPhaseSignal,
  m_Straight: CustomPhaseSignal,
  m_Right: CustomPhaseSignal,
  m_UTurn: CustomPhaseSignal
}

interface CustomPhaseGroupMask {
  m_Edge: Entity,
  m_EdgePosition: WorldPosition,
  m_Group: number,
  m_Car: CustomPhaseTurn,
  m_PublicCar: CustomPhaseTurn,
  m_Track: CustomPhaseTurn,
  m_PedestrianStopLine: CustomPhaseSignal,
  m_PedestrianNonStopLine: CustomPhaseSignal
}

interface EdgeInfo {
  m_Edge: Entity,
  m_Group: number,
  m_Position: WorldPosition,
  m_CarLaneLeftCount: number,
  m_CarLaneStraightCount: number,
  m_CarLaneRightCount: number,
  m_CarLaneUTurnCount: number,
  m_PublicCarLaneLeftCount: number,
  m_PublicCarLaneStraightCount: number,
  m_PublicCarLaneRightCount: number,
  m_PublicCarLaneUTurnCount: number,
  m_TrackLaneLeftCount: number,
  m_TrackLaneStraightCount: number,
  m_TrackLaneRightCount: number,
  m_PedestrianLaneStopLineCount: number,
  m_PedestrianLaneNonStopLineCount: number,
  m_CustomPhaseGroupMask: CustomPhaseGroupMask
}