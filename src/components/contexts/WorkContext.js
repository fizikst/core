import React from "react";
import { useReducer } from "reinspect";

const WorkStateContext = React.createContext();
const WorkActionsContext = React.createContext();

export function useWorkState() {
  return React.useContext(WorkStateContext);
}

export const types = {
  ON_BEGIN: "ON_BEGIN",
  ON_END: "ON_END",
  ON_PROGRESS: "ON_PROGRESS"
};

export function useWorkActions() {
  const { dispatch } = React.useContext(WorkActionsContext);

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

  return {
    onEnd,
    onBegin,
    onProgress
  };
}

function reducer(state, action) {
  switch (action.type) {
    case types.ON_BEGIN:
      return {
        begin: true,
        progress: false,
        end: false
      };
    case types.ON_END:
      return {
        begin: false,
        progress: false,
        end: true
      };
    case types.ON_PROGRESS:
      return {
        begin: false,
        progress: true,
        end: false
      };
    default:
      return new Error();
  }
}

export function WorkContextProvider({ children }) {
  const [state, dispatch] = useReducer(
    reducer,
    { begin: false, progress: false, end: false },
    undefined,
    "WORK"
  );

  const actions = React.useMemo(
    () => ({
      dispatch
    }),
    []
  );

  return (
    <WorkStateContext.Provider value={state}>
      <WorkActionsContext.Provider value={actions}>
        {children}
      </WorkActionsContext.Provider>
    </WorkStateContext.Provider>
  );
}
