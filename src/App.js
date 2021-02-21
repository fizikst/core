import React from "react";
// import {
//   DadJokeContextProvider,
//   useDadJokeState,
//   useDadJokeActions
// } from "./dad-joke";

import { ControlsContextProvider } from "./components/contexts/ControlsContext";
// import { WorkContextProvider } from "./components/contexts/WorkContext";
import {
  ParamsContextProvider,
  useParamsState,
  useParamsActions
} from "./components/contexts/ParamsContext";

// import RenderControls from "./components/renders/RenderControls";
import RenderForsage from "./components/renders/RenderForsage";
import Render from "./components/renders/Render";
import Forsage from "./components/containers/Forsage";
import RepeatCntr from "./components/containers/RepeatCntr";
import Dictation from "./Dictation";

import { StateInspector } from "reinspect";
import Dashboard from "./Dashboard";
import RenderControls from "./components/renders/RenderControls";
import RenderSettings from "./components/renders/RenderSettings";
import RenderParams from "./components/renders/RenderParams";

const initialTerminalState = {
  params: {
    section: 5,
    steps: 3,
    interval: 1,
    mode: 1,
    sign: 0,
    bound: 0,
    under: 1,
    over: 1,
    numbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
  },
  controls: {
    start: false,
    stop: false,
    open: false,
    check: false,
    clear: false,
    abacus: false,
    settings: true,
    repeat: false,
    correct: false
  },
  visible: {
    answerCounter: {
      sound: false,
      settings: true,
      sample: true,
      play: true,
      params: true,
      showAnswer: true,
      abacus: true
    }
  },
  dictationState: {
    dictation: false,
    amount: 3,
    start: false,
    progress: false,
    stop: false,
    period: 5,
    samples: []
  },
  abacusState: {
    a: [0, 0, 0, 0, 0],
    b: [0, 0, 0, 0, 0],
    c: [0, 0, 0, 0, 0],
    d: [0, 0, 0, 0, 0],
    e: [0, 0, 0, 0, 0]
  }
};

const initControls = {
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
  args: [111]
};

export default function App() {
  const [controls, setCntr] = React.useState(initControls);

  const handleChangeControls = () => {
    setCntr({ ...initControls, start: true });
  };

  const handleChangeArg = () => {
    setCntr({ ...initControls, args: [111, 222, 333] });
  };

  const [request, setRequest] = React.useState({
    data: [],
    error: false,
    errorMessage: "",
    loading: false,
    success: false
  });

  const fetchArgs = () => {
    setRequest({
      ...request,
      success: true,
      data: [
        [1, 2, 3],
        [4, 5, 6]
      ]
    });
  };

  const getNextArgs = (index) => {
    setCntr({ ...initControls, args: request.data[index] });
  };

  console.count("App");

  return (
    <StateInspector name="Terminal">
      <input type="button" value="change args" onClick={handleChangeArg} />
      <input
        type="button"
        value="change start"
        onClick={handleChangeControls}
      />
      <ParamsContextProvider>
        <ControlsContextProvider controls={controls}>
          <Dashboard
            renderForsage={() => (
              <Forsage render={(props1) => <RenderForsage {...props1} />} />
            )}
            renderControl={() => (
              <RepeatCntr render={(props2) => <RenderControls {...props2} />} />
            )}
          />
        </ControlsContextProvider>
      </ParamsContextProvider>
    </StateInspector>
  );
}

{
  /* <Dictation
state={{ controls: initControls }}
fetchArgs={fetchArgs}
getNextArgs={getNextArgs}
args={controls.args}
render={({ onStart, onStop }) => (
  )}
  /> */
}
// afterStart={onStart}
// afterStop={onStop}
