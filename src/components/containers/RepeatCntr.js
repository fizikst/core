import React, { useEffect } from "react";
// import PropTypes from "prop-types";

import { useEventCallback } from "rxjs-hooks";
// import { of } from "rxjs";
// import { takeUntil, switchMap, tap, delay, filter } from "rxjs/operators";
// import usePersonalControl from "./usePersonalControl";
import repeatEpic from "../epics/repeatEpic";

import {
  useControlsState,
  useControlsActions
} from "../contexts/ControlsContext";

// import { useParamsState, useParamsActions } from "../contexts/ParamsContext";

// function repeatEpic(events$, ) {
//   return events$.pipe(
//     filter((e) => e.type === "repeat"),
//     switchMap((action) =>
//       of(2000).pipe(
//         delay(2000),
//         tap(() => action.deps.start()),
//         takeUntil(events$.pipe(filter((e) => e.type === "stop_repeat")))
//       )
//     )
//   );
// }

const RepeatCntr = ({ render }) => {
  // const {
  //   state,
  //   start,
  //   stop: onStop,
  //   onDictationStart,
  //   patchControls
  // } = usePersonalControl();
  // const {
  //   onChangeInputValue,
  //   controls: { repeat, stop }
  // } = state;

  const { onStart, onStop, onChange } = useControlsActions();

  const { start, stop, repeat, onChangeInputValue } = useControlsState();
  // const { steps } = useParamsState();
  // const {change} = useParamsActions();

  const [onEvent] = useEventCallback((events$) => repeatEpic(events$, onStart));

  const handleChange = (event) => {
    const { value: nextValue } = event.target;

    if (onChangeInputValue) {
      onChangeInputValue(nextValue);
    } else {
      // patchControls("value", nextValue);
      onChange("value", nextValue);
    }
  };

  const handleStart = () => {
    onStart();
    // onDictationStart();
  };

  const handleStop = () => {
    onStop();
  };

  function handleCheck() {
    if (repeat) {
      onEvent({
        type: "repeat",
        deps: { start }
      });
    }
    // state.onCheck();
  }

  useEffect(() => {
    if (stop) {
      onEvent({
        type: "stop_repeat"
      });
    }
  }, [stop, onEvent]);

  console.count("RepeatCntr");

  return (
    <>
      {render({
        onStart: handleStart,
        onStop: handleStop,
        onCheck: handleCheck,
        onChange: handleChange
      })}
    </>
  );
};

// Provider.propTypes = {
//   render: PropTypes.func.isRequired
// };

export default RepeatCntr;
