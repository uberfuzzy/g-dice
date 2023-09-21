import React from 'react';
import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import "./Player.css"
import { rollD6 } from '../util/dice';
import { Dice } from "./Dice"
import { GameContext } from '../contexts/gameState';

export const Player = ({ name }) => {
  const [pool, setPool] = useState([])
  let gameIsStart = useContext(GameContext);

  useEffect(() => {
    setPool(new Array(7).fill(0));
  }, [])

  const rollPool = () => {
    let np = pool.map(() => {
      return rollD6();
    })

    np = np.sort((a, b) => a - b)

    setPool(np);
  }

  return (
    <>
      <div className={"playerDev"}>
        my name is <code className="nameBox">{name}</code>, my pool({pool.length}) is [{pool.join(', ')}],

        <div className="playerDicePool">
          {pool.map((dv, i) => {
            return <Dice key={i} number={dv} />
          })}
        </div>

        {gameIsStart &&
          <>
            <button onClick={rollPool}>roll pool</button>
          </>
        }
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