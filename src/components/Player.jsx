import React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Dice } from "~components/Dice";
import { CubeStack } from "~components/Cube";
import { NameBox } from "~components/NameBox";

import "./Player.css";

export const Player = ({ data }) => {
  const [pool, setPool] = useState(data.pool);

  // let gameIsStart = useContext(GameContext);

  useEffect(() => {
    setPool(data.pool);
  }, [data.pool]);

  const unstacked = data.pool.length + data.gifts;

  return (
    <>
      <div className={"playerDev"}>
        my name is <NameBox>{data.name}</NameBox>,<br />
        my cube is: {data.cube}, my pool({pool.length}) is [{pool.join(", ")}],
        my gifts is: {data.gifts}. [US={unstacked}]
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        <div style={{ display: "flex" }}>
          <div className="playerCube">
            <CubeStack number={data.cube} color="pink" />
          </div>

          <div className="playerDicePool">
            {pool.map((dv, i) => {
              return <Dice key={i} number={dv} />;
            })}
          </div>

          <div className="giftCube">
            <CubeStack number={data.gifts} color="gold" />
          </div>
        </div>
        {data.win !== false && (
          <>
            <div className="win">I AM WINNER [{data.win}]</div>
          </>
        )}
      </div>
    </>
  );
};

Player.propTypes = {
  data: PropTypes.object,
};

// Player.defaultProps = {
// }

export default Player;
