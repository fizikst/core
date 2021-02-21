import React from "react";
import { useReducer } from "reinspect";
import { fetchDadJoke } from "./actions";

import { useParamsState } from "./ParamsContext";

// console.log({actions})

const DadJokeStateContext = React.createContext();
const DadJokeActionsContext = React.createContext();

export function useDadJokeState() {
  return React.useContext(DadJokeStateContext);
}

export function useDadJokeActions() {
  const { dispatch } = React.useContext(DadJokeActionsContext);
  const { steps } = useParamsState();

  function sendDadData() {
    dispatch({
      type: "SET_DAD_JOKE",
      payload: steps
    });
  }

  return {
    sendDadData
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_DAD_JOKE":
      return {
        ...state,
        dadJoke: action.payload
      };
    default:
      return new Error();
  }
}

export function DadJokeContextProvider({ children }) {
  const [state, dispatch] = useReducer(
    reducer,
    { dadJoke: null },
    undefined,
    "DAD"
  );

  // async function fetchDadJoke() {
  //   const response = await fetch("//icanhazdadjoke.com", {
  //     headers: {
  //       accept: "application/json"
  //     }
  //   });
  //   const data = await response.json();
  //   dispatch({
  //     type: "SET_DAD_JOKE",
  //     payload: data.joke
  //   });
  // }

  const actions = React.useMemo(
    () => ({
      dispatch
    }),
    []
  );

  return (
    <DadJokeStateContext.Provider value={state}>
      <DadJokeActionsContext.Provider value={actions}>
        {children}
      </DadJokeActionsContext.Provider>
    </DadJokeStateContext.Provider>
  );
}
