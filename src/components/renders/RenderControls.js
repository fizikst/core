import React from "react";

import {
  useControlsState,
  useControlsActions
} from "../contexts/ControlsContext";

function RenderControls(props) {
  const { onStart, onStop, onCheck, onChange } = props;

  const { success, failure, start, value } = useControlsState();

  // const handleChange = (event) => {
  //   const { value: nextValue } = event.target;

  //   // if (onChangeInputValue) {
  //   //   onChangeInputValue(nextValue);
  //   // } else {
  //   onChange("value", nextValue);
  //   // }
  // };

  // console.log({ state });

  console.count("RenderControls");

  return (
    <div>
      <p>
        <input type="text" name="value" value={value} onChange={onChange} />
        <button onClick={onCheck}>check</button>
      </p>
      <p>
        {start ? (
          <button onClick={onStop}>stop</button>
        ) : (
          <button onClick={onStart}>play</button>
        )}
        <span>{success}</span>
        <span>{failure}</span>
      </p>
    </div>
  );
}

export default RenderControls;
