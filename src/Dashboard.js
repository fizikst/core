import React from "react";
import RenderControls from "./components/renders/RenderControls";
import RenderSettings from "./components/renders/RenderSettings";
import RenderParams from "./components/renders/RenderParams";
// import useTerminal from "./components/states/useTerminal";

function Dashboard(props) {
  const { renderForsage, renderColumn, renderCard, renderControl } = props;

  console.count("Dashboard");

  return (
    <div>
      {renderForsage()}

      {renderControl()}

      <RenderSettings />
      <RenderParams />
    </div>
  );
}
// renderCard()
// {renderForsage()}
// {renderColumn()}
export default Dashboard;
