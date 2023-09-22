import React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import "./Player.css"
import { Dice } from "./Dice"
import { Cube } from "./Cube"

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

        <div style={{ display: "flex" }}>

          <div className="playerCube" style={{ backgroundColor: "magenta" }}>
            <Cube number={data.cube} />
          </div>

          <div className="playerDicePool">
            {pool.map((dv, i) => {
              return <Dice key={i} number={dv} />
            })}
          </div>
        </div>

      </div>
    </>
  );
}


Player.propTypes = {
  data: PropTypes.object
};

// Player.defaultProps = {
// }

export default Player;