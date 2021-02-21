import { StrictMode } from "react";
import ReactDOM from "react-dom";

import App from "./App";

// https://webformyself.com/alternativa-redux-s-pomoshhyu-react-context-i-xukov/
const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);
