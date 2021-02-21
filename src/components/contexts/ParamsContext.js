import React from "react";
import { useReducer } from "reinspect";

const ParamsStateContext = React.createContext();
const ParamsActionsContext = React.createContext();

export function useParamsState() {
  return React.useContext(ParamsStateContext);
}

export function useParamsActions() {
  const { dispatch } = React.useContext(ParamsActionsContext);

  function change(key, value) {
    dispatch({
      type: "CHANGE",
      meta: key,
      payload: value
    });
  }

  return {
    change
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        [action.meta]: action.payload
      };
    default:
      return new Error();
  }
}

export function ParamsContextProvider({ children }) {
  const [state, dispatch] = useReducer(
    reducer,
    { steps: 3 },
    undefined,
    "PARAMS"
  );

  const actions = React.useMemo(
    () => ({
      dispatch
    }),
    []
  );

  return (
    <ParamsStateContext.Provider value={state}>
      <ParamsActionsContext.Provider value={actions}>
        {children}
      </ParamsActionsContext.Provider>
    </ParamsStateContext.Provider>
  );
}
