import React from 'react';
// import PropTypes from 'prop-types';
import "./PipGrid.css"
import "./Cube.css"

const patterns = {}

// anything other than "-" will be treated as a pip

patterns[0] = "---------"
patterns[1] = "*--------"
patterns[2] = "**-------"
patterns[3] = "***------"
patterns[4] = "***--*---"
patterns[5] = "***--*--*"
patterns[6] = "***--*-**"
patterns[7] = "***--****"
patterns[8] = "****-****"

export const Cube = ({ number }) => {
  let myPips = new Array(9)

  // start with a grid of spacers
  for (let i = 0; i < 9; i += 1) {
    myPips[i] = <span key={i} className="cell spacer" >-</span>
  }

  // if the value is in our list of known patterns...
  if (number >= 0 && number <= 8) {
    // iterate over the chars
    patterns[number].split("").forEach((element, i) => {
      // non-spacers are overwrote into pips
      if (element !== '-') {
        myPips[i] = <span key={i} className="cell pip">&bull;</span>
      }
    });
  }

  myPips[4] = <span key={4} className="cell pip hollow">{number}</span>

  return (
    <div className="pipGrid cubeGrid" title={number}>{myPips}</div>
  );
}

export default Cube;