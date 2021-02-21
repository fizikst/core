import React from "react";

import { useParamsState, useParamsActions } from "../contexts/ParamsContext";

const stepsList = [1, 2, 3, 4, 5];
const generateKey = (pre) => {
  return `${pre}_${new Date().getTime()}`;
};
function RenderParams() {
  const { steps } = useParamsState();
  const { change } = useParamsActions();

  function handleChange(e) {
    change(e.target.name, e.target.value);
  }

  console.count("RenderParams");
  return (
    <select value={steps} onChange={handleChange} name="steps">
      {stepsList.map((step) => (
        <option key={generateKey(step)} value={step}>
          {step}
        </option>
      ))}
    </select>
  );
}

export default RenderParams;
