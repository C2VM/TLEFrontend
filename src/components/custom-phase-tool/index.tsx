import { useEffect } from "react";

import { bindValue, call, useValue } from "cs2/api";

import { useScreenPoint } from "@/engine";

import Panel from "./panel";

export default function CustomPhaseTool() {
  const activeEditingCustomPhaseIndex = useValue(bindValue("C2VM.TLE", "GetActiveEditingCustomPhaseIndex", -1));
  const edgeInfoJson = useValue(bindValue("C2VM.TLE", "GetEdgeInfo", "[]"));
  const edgeInfoList: EdgeInfo[] = JSON.parse(edgeInfoJson);

  useEffect(() => {
    const posArray = JSON.stringify(edgeInfoList.map(item => item.m_Position));
    call("C2VM.TLE", "CallAddWorldPosition", posArray);
    return () => {
      call("C2VM.TLE", "CallRemoveWorldPosition", posArray);
    };
  }, [edgeInfoList]);

  const screenPointMap = useScreenPoint();

  return (
    <>
      {activeEditingCustomPhaseIndex >= 0 && edgeInfoList.map(edge => <Panel data={edge} index={activeEditingCustomPhaseIndex} position={screenPointMap[edge.m_Position.key]} />)}
    </>
  );
}