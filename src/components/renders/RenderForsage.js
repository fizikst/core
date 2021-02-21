import React from "react";

function RenderForsage(props) {
  const { args, inc } = props;
  // console.log("RenderForsage", props);

  return (
    <div>
      <p>{inc}</p>
      <p>{args[inc]}</p>
    </div>
  );
}

export default RenderForsage;
