import React from 'react';
import PropTypes from 'prop-types';

import { PipGrid } from "./PipGrid"
import "./Dice.css"

export const Dice = ({ number }) => {

  return (
    <>
      Dice.props.number={number}<br />
      <PipGrid value={number} />
    </>
  );
}

Dice.propTypes = {
  number: PropTypes.number,
};

Dice.defaultProps = {
  number: 0,
}

export default Dice;