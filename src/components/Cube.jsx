import React from "react";
// import PropTypes from 'prop-types';
import "./PipGrid.css";
import "./Cube.css";
import { Emoji } from "./Emoji";

const patterns = {};

// anything other than "-" will be treated as a pip

patterns[0] = "---------";
patterns[1] = "*--------";
patterns[2] = "**-------";
patterns[3] = "***------";
patterns[4] = "***--*---";
patterns[5] = "***--*--*";
patterns[6] = "***--*-**";
patterns[7] = "***--****";
patterns[8] = "****-****";

export const CubeStack = ({ number, color }) => {
  let myPips = new Array(9);

  // start with a grid of spacers
  for (let i = 0; i < 9; i += 1) {
    myPips[i] = (
      <span key={i} className="cell spacer">
        -
      </span>
    );
  }

  let displayPattern = Math.max(Math.min(number, 8), 0);

  patterns[displayPattern].split("").forEach((element, i) => {
    // non-spacers are overwrote into pips
    if (element !== "-") {
      myPips[i] = (
        <span key={i} className="cell none">
          <Emoji>🎲</Emoji>
        </span>
      );
    }
  });

  myPips[4] = (
    <span key={4} className="cell none">
      {number}
    </span>
  );

  return (
    <div
      className={`diceBox ${number >= 8 ? "win" : ""}`}
      style={{ backgroundColor: color || "transparent" }}
    >
      <div className={`pipGrid cubeGrid`} title={number}>
        {myPips}
      </div>
    </div>
  );
};

export default CubeStack;
