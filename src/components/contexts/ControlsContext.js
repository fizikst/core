import React, { useEffect } from "react";
import { useReducer } from "reinspect";

const ControlsStateContext = React.createContext();
const ControlsActionsContext = React.createContext();

export function useControlsState() {
  return React.useContext(ControlsStateContext);
}

const initialState = {
  count: 5,
  dictation: true,
  start: false,
  stop: false,
  check: false,
  clear: false,
  abacus: false,
  settings: true,
  repeat: false,
  correct: false,
  value: "",
  open: true,
  sound: false,
  sample: false,
  showAnswers: false,
  success: 0,
  failure: 0,
  begin: false,
  progress: false,
  end: false,
  args: []
};

export const types = {
  ON_START: "ON_START",
  ON_STOP: "ON_STOP",
  ON_CHECK: "ON_CHECK",
  ON_CHANGE: "ON_CHANGE",
  ON_BEGIN: "ON_BEGIN",
  ON_END: "ON_END",
  ON_TOGGLE: "ON_TOGGLE",
  ON_PROGRESS: "ON_PROGRESS",
  ON_UPDATE: "ON_UPDATE"
  // ON_INCREMENT: "ON_INCREMENT",
  // ON_CHANGE: "ON_CHANGE",
  // // ON_PARAMS: "ON_PARAMS",
  // ON_PURSE: "ON_PURSE",
  // ON_BEGIN: "ON_BEGIN",
  // ON_END: "ON_END",
  // ON_PROGRESS: "ON_PROGRESS",

  // ON_DICTATION_START: "ON_DICTATION_START",
  // ON_DICTATION_PROGRESS: "ON_DICTATION_PROGRESS",

  // // SET_PARAMS: "SET_PARAMS",
  // SET_CONTROLS: "SET_CONTROLS",
  // SET_DICTATION_STATUSES: "SET_DICTATION_STATUSES"
};

export function useControlsActions() {
  const { dispatch } = React.useContext(ControlsActionsContext);

  function onChange(key, value) {
    dispatch({
      type: types.ON_CHANGE,
      meta: key,
      payload: value
    });
  }

  function onStart() {
    dispatch({
      type: types.ON_START
    });
  }
  function onStop() {
    dispatch({
      type: types.ON_STOP
    });
  }
  function onCheck() {
    dispatch({
      type: types.ON_CHECK
    });
  }

  function onEnd() {
    dispatch({
      type: types.ON_END
    });
  }

  function onBegin() {
    dispatch({
      type: types.ON_BEGIN
    });
  }
  function onProgress() {
    dispatch({
      type: types.ON_PROGRESS
    });
  }

  function onToggle(key) {
    dispatch({
      type: types.ON_TOGGLE,
      meta: key
    });
  }

  function onUpdate(payload) {
    dispatch({
      type: types.ON_UPDATE,
      payload
    });
  }

  return {
    onChange,
    onStart,
    onStop,
    onCheck,
    onEnd,
    onBegin,
    onProgress,
    onToggle,
    onUpdate
  };
}

function reducer(state, action) {
  switch (action.type) {
    case types.ON_CHANGE:
      return {
        ...state,
        [action.meta]: action.payload
      };
    case types.ON_TOGGLE:
      return {
        ...state,
        [action.meta]: !state[action.meta]
      };
    case types.ON_START:
      return {
        ...state,
        start: true,
        stop: false,
        check: false,
        value: "",
        begin: false,
        progress: false,
        end: false
      };
    case types.ON_STOP:
      return {
        ...state,
        start: false,
        stop: true,
        check: false,
        begin: false,
        progress: false,
        end: true
      };
    case types.ON_CHECK:
      return {
        ...state,
        start: state.repeat,
        stop: false,
        check: true
      };
    case types.ON_BEGIN:
      return {
        ...state,
        begin: true,
        progress: false,
        end: false
      };
    case types.ON_END:
      return {
        ...state,
        begin: false,
        progress: false,
        end: true
      };
    case types.ON_PROGRESS:
      return {
        ...state,
        begin: false,
        progress: true,
        end: false
      };
    case types.ON_UPDATE:
      return {
        ...state,
        ...action.payload
      };
    default:
      return new Error();
  }
}

export function ControlsContextProvider(props) {
  const { children, args, controls, afterStart, afterStop } = props;
  const [state, dispatch] = useReducer(
    reducer,
    { ...initialState, afterStart, afterStop },
    undefined,
    "CONTROLS"
  );

  useEffect(() => {
    dispatch({
      type: types.ON_CHANGE,
      meta: "args",
      payload: args
    });
  }, [args]);

  useEffect(() => {
    dispatch({
      type: types.ON_UPDATE,
      payload: controls
    });
  }, [controls]);

  const actions = React.useMemo(
    () => ({
      dispatch
    }),
    []
  );

  return (
    <ControlsStateContext.Provider value={state}>
      <ControlsActionsContext.Provider value={actions}>
        {children}
      </ControlsActionsContext.Provider>
    </ControlsStateContext.Provider>
  );
}
