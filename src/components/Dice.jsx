import React from "react";
import PropTypes from "prop-types";

import { PipGrid } from "~components/PipGrid";
import "./Dice.css";

export const Dice = ({ number }) => {
  const bgClass = (() => {
    switch (number) {
      case 1:
        return "one";
      case 3:
        return "three";
      case 6:
        return "six";
      default:
        return "";
    }
  })();

  return (
    <div className={`diceBox ${bgClass}`}>
      <PipGrid value={number} />
    </div>
  );
};

Dice.propTypes = {
  number: PropTypes.number,
};

Dice.defaultProps = {
  number: 0,
};

export default Dice;
