import React from "react";
// import useTerminal from "../states/useTerminal";
import {
  useControlsState,
  useControlsActions
} from "../contexts/ControlsContext";

function RenderSettings() {
  const { sound, repeat, dictation } = useControlsState();
  // const { toggleControls, state } = useTerminal();
  const handleChange = (e) => {
    onToggle(e.target.name);
  };

  const { onToggle } = useControlsActions();

  console.count("RenderSettings");

  return (
    <div>
      Sound
      <input
        onChange={handleChange}
        type="checkbox"
        id="sound"
        name="sound"
        value={sound}
      />
      Repeat
      <input
        onChange={handleChange}
        type="checkbox"
        id="repeat"
        name="repeat"
        value={repeat}
      />
      Dictation
      <input
        onChange={handleChange}
        type="checkbox"
        id="dictation"
        name="dictation"
        value={dictation}
      />
    </div>
  );
}

export default RenderSettings;
