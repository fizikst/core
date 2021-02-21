import React, { useEffect } from "react";
import { useEventCallback } from "rxjs-hooks";
import { filter, tap, map, combineLatest } from "rxjs/operators";
import timerEpic from "../epics/timerEpic";
import laodAudiosEpic from "../epics/laodAudiosEpic";
// import useTerminal from "../states/useTerminal";
// import { TerminalContext } from "../states/TerminalContext";
import {
  useControlsState,
  useControlsActions
} from "../contexts/ControlsContext";

function Forsage(props) {
  const { render } = props;

  const {
    start,
    stop,
    check,
    sound,
    repeat,
    begin,
    progress,
    end,
    args
  } = useControlsState();
  const { onStart, onStop, onBegin, onProgress, onEnd } = useControlsActions();
  // const [state] = React.useContext(TerminalContext);
  // const {
  //   args,
  //   workout: { end },
  //   controls: { start, stop, check, sound, repeat }
  // } = state;

  const [inc, setInc] = React.useState(0);

  const handleError = (data) => {
    console.log("error handle", data);
    onEvent({
      type: "error"
    });
  };

  const [onEvent, index] = useEventCallback(
    (events$, state$, inputs$) => {
      // const running$ = events$.pipe(
      //   // filter((e) => e.type === "click"),
      //   scan((running) => !running, running)
      // );

      return events$.pipe(
        // withLatestFrom(running$),

        // scan((running) => !running, running),
        // tap((running) => setRunning(running)),
        combineLatest(inputs$),
        filter(([event, [args, sound, end]]) => {
          console.log("ON EVENT OBSERVEBLE", {
            type: event.type,
            arglength: args.length,
            sound,
            end
          });
          return event.type === "start" && !end && args.length > 0;
        }),
        tap(() => console.log("ON EVENT OBSERVEBLE EENNDD")),

        map(([event, [args, sound]]) => [args, sound]),
        tap((e) =>
          console.log("<<<<<<<<<<<<<<<< Start load audios >>>>>>>>>>>>>>>>", e)
        ),
        laodAudiosEpic(events$, handleError),

        tap(() => onBegin()),
        tap((e) => console.log("---------------------", e)),
        tap(() => setInc(0)),
        tap(() => onProgress()),
        tap((e) =>
          console.log("<<<<<<<<<<<<<<<< Start timer >>>>>>>>>>>>>>>>", e)
        ),
        timerEpic(events$, setInc),
        filter(([index, count]) => index >= count - 1),
        tap(() => onEnd())
        // takeUntil(events$.pipe(filter(e => e.type === 'error')))
      );
    },
    0,
    [args, sound, end]
  );

  useEffect(() => {
    console.log("&&&&&&&& FORSAGE  START", { start });
    if (start) {
      onEvent({ type: "start" });
    }
  }, [onEvent, start]);

  useEffect(() => {
    console.log("&&&&&&&& FORSAGE  STOP", { stop });
    if (stop) {
      onEvent({ type: "stop" });
    }
  }, [onEvent, stop]);

  // useEffect(() => {
  //   console.log("&&&&&&&& FORSAGE CHECK", { repeat, check });
  //   if (repeat && check) {
  //     // onStop();
  //     onStart();
  //   // }
  // }, [onStart, repeat, check, onStop]);

  console.log("RESULT", { inc, end, start, stop, begin, progress, end });

  console.count("FORSAGE");

  return <div>{args[inc]}</div>;
}

export default Forsage;

// {render({
//   args,
//   inc
// })}
