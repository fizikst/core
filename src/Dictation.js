import React, { useState, useEffect, useRef, useReducer } from "react";
// import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
// import Paper from '@material-ui/core/Paper';
import { useEventCallback } from "rxjs-hooks";
import { takeUntil, tap, switchMap, delay, filter } from "rxjs/operators";
// import PersonalPanel from '../../../vendors/simulators/src/PersonalPanel';

export const types = {
  ON_START: "ON_START",
  ON_STOP: "ON_STOP",
  SET_STATE: "SET_STATE",
  SET_DICTATION: "SET_DICTATION",
  ON_PROGRESS: "ON_PROGRESS",
  SET_SAMPLES: "SET_SAMPLES",
  SET_PERIOD: "SET_PERIOD",
  SET_AMOUNT: "SET_AMOUNT"
};

function dictationEpic(events$) {
  return events$.pipe(
    filter((e) => e.type === "dictation_start"),
    switchMap((action) =>
      events$.pipe(
        filter((e) => e.type === "sample_stop"),
        delay(1000 * Number(action.payload.interval)),
        tap(() => action.deps.clear()),
        tap(() => action.deps.run()),

        takeUntil(events$.pipe(filter((e) => e.type === "dictation_stop")))
      )
    )
  );
}

const initialState = {
  dictation: false,
  amount: 3,
  start: false,
  progress: false,
  stop: false,
  period: 5,
  samples: []
};

function reducer(state, action) {
  switch (action.type) {
    case types.SET_AMOUNT:
    case types.SET_PERIOD:
    case types.SET_SAMPLES:
    case types.SET_DICTATION: {
      return {
        ...state,
        [action.meta]: action.payload
      };
    }
    case types.ON_START: {
      return {
        ...state,
        start: true,
        progress: false,
        stop: false,
        samples: []
      };
    }
    case types.ON_PROGRESS: {
      return {
        ...state,
        start: false,
        progress: true,
        stop: false
      };
    }
    case types.ON_STOP: {
      return {
        ...state,
        start: false,
        progress: false,
        stop: true
      };
    }
    case types.SET_STATE: {
      return action.payload;
    }
    default:
      return state;
  }
}
const Dictation = ({
  args: parentArgs,
  request,
  getNextArgs,
  state,
  onStop,
  fetchArgs,
  room,
  onCheck,
  onIncrement,
  onShowParamsBlock,
  onChangeInputValue,
  onAbacusChange,
  onToggleSetting,
  onChangeDictationSetting,
  render
}) => {
  // const classes = useStyles();

  // const { dictationState: nextDictationState } = state;

  const { controls, params, dictationState: nextDictationState } = state;
  const { start, stop, dictation } = controls;

  const [dictationState, dispatch] = useReducer(reducer, initialState);

  // const { dictation } = dictationState;

  // useEffect(() => {
  //   dispatch({
  //     type: types.SET_STATE,
  //     payload: nextDictationState,
  //   });
  // }, [nextDictationState]);

  useEffect(() => {
    if (stop && dictation) {
      dispatch({
        type: types.ON_STOP
      });
    }
  }, [stop, dispatch, dictation]);

  useEffect(() => {
    if (start && dictation) {
      dispatch({
        type: types.ON_START
      });
    }
  }, [start, dictation]);

  /*
   * Ref
   */
  const dictationStateRef = useRef(dictationState);
  // useEffect(() => {
  //   dictationStateRef.current = dictationState;
  // }, [dictationState]);

  const dictationIndexRef = useRef(0);
  useEffect(() => {
    dictationIndexRef.current = dictationState.samples.length;
  }, [dictationState.samples]);

  const [onEvent] = useEventCallback(dictationEpic);

  const [args, setArgs] = useState(parentArgs);

  useEffect(() => {
    setArgs(parentArgs);
  }, [parentArgs]);

  useEffect(() => {
    if (args.length > 0 && dictation) {
      dispatch({
        type: types.SET_SAMPLES,
        meta: "samples",
        payload: [...dictationState.samples, args]
      });
    }
  }, [args]);

  // const handleBegin = () => console.log('handleBegin');

  function handleEnd() {
    const { amount: nextAmount, period } = dictationStateRef.current;

    if (dictationIndexRef.current === +nextAmount) {
      // TODO сделать без timeout

      setTimeout(() => {
        onEvent({
          type: "dictation_stop"
        });

        dispatch({
          type: types.ON_STOP
        });
      }, 1000 * period);
    } else {
      onEvent({
        type: "sample_stop",
        deps: {
          run: () => getNextArgs(dictationIndexRef.current),
          clear: () => setArgs([])
        }
      });
    }
  }

  useEffect(() => {
    const { period } = dictationStateRef.current;
    if (dictationState.start) {
      onEvent({
        type: "dictation_start",
        payload: { interval: period },
        deps: {
          run: () => getNextArgs(dictationIndexRef.current),
          clear: () => setArgs([])
        }
      });
      dispatch({
        type: types.ON_PROGRESS
      });
    }
  }, [dictationState.start]);

  useEffect(() => {
    if (dictationState.stop) {
      onEvent({
        type: "dictation_stop"
      });
    }
  }, [dictationState.stop]);

  function handleStart(nextParams) {
    const {
      dictation: nextDictation,
      amount: nextAmount
    } = dictationStateRef.current;
    fetchArgs(nextParams, nextDictation, nextAmount);
    if (nextDictation) {
      dispatch({
        type: types.ON_START
      });
    }
  }

  const handleStop = () => {
    onStop();
  };

  console.count("Dictation");

  return <>{render({ onStart: handleStart, onStop: handleStop })}</>;
};

export default Dictation;
