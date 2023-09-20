import React from 'react';
// import PropTypes from 'prop-types';
import "./PipGrid.css"

const patterns = {}

// anything other than "-" will be treated as a pip

patterns[0] = "*********"

patterns[1] = "----*----"
patterns[2] = "*-------*"
patterns[3] = "*---*---*"
patterns[4] = "*-*---*-*"
patterns[5] = "*-*-*-*-*"
patterns[6] = "*-**-**-*"

export const PipGrid = ({ value }) => {
    let myPips = new Array(9)

    // start with a grid of spacers
    for (let i = 0; i < 9; i += 1) {
        myPips[i] = <span key={i} className="cell spacer" >-</span>
    }

    // if the value is in our list of known patterns...
    if (value >= 0 && value <= 6) {
        // iterate over the chars
        patterns[value].split("").forEach((element, i) => {
            // non-spacers are overwrote into pips
            if (element !== '-') {
                myPips[i] = <span key={i} className="cell pip">&bull;</span>
            }
        });
    } else {
        // for things outside of the known patterns, just
        // pip the center, punch out the middle, and put the value in it.
        myPips[4] = <span key={4} className="cell pip hollow">{value}</span>
    }

    return (
        <div className="pipGrid" title={value}>{myPips}</div>
    );
}

export default PipGrid;