import React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import "./Player.css"
import { Dice } from "./Dice"
// import { GameContext } from '../contexts/gameState';
import { NameBox } from './NameBox';

export const Player = ({ data }) => {
  const [pool, setPool] = useState(data.pool)

  // let gameIsStart = useContext(GameContext);

  useEffect(() => {
    setPool(data.pool);
  }, [data.pool])

  return (
    <>
      <div className={"playerDev"}>
        my name is <NameBox>{data.name}</NameBox>, my pool({pool.length}) is [{pool.join(', ')}],
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}

        <div className="playerDicePool">
          {pool.map((dv, i) => {
            return <Dice key={i} number={dv} />
          })}
        </div>

      </div>
    </>
  );
}


Player.propTypes = {
  name: PropTypes.string,
};

Player.defaultProps = {
  name: "-",
}

export default Player;