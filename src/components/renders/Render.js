import React from "react";
import { useControlsState } from "../contexts/ControlsContext";
// import { useParamsState } from "../contexts/ParamsContext";
function Render({ render }) {
  // const { start, stop, repeat, onChangeInputValue } = useControlsState();
  // const { steps } = useParamsState();
  // console.count("------ RENDER");
  return <>{render()}</>;
}

export default Render;
