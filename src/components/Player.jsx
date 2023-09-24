import React from "react";
import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";

import { Dice } from "~components/Dice";
import { CubeStack } from "~components/Cube";
import { NameBox } from "~components/NameBox";
import { PlayersContext } from "~/contexts/players";

import "./Player.css";

export const Player = ({ data }) => {
  const [pool, setPool] = useState(data.pool);
  const [giftPool, setGiftPool] = useState(data.gifts);

  let players = useContext(PlayersContext);

  useEffect(() => {
    setPool(data.pool);
  }, [data.pool]);

  useEffect(() => {
    setGiftPool(data.gifts);
  }, [data.gifts]);

  const leftGiveAway = data.rolled.filter((dv) => {
    return dv === 1;
  });

  const rightGiveAway = data.rolled.filter((dv) => {
    return dv === 6;
  });

  return (
    <>
      <div className={"playerDev"}>
        my name is <NameBox>{data.name}</NameBox>
        {/* , <br /> */}
        {/* my cube is: {data.cube}, my pool({pool.length}) is [{pool.join(", ")}] , */}
        {/* my gifts is: {data.gifts}, */}
        {/* US={data.pool.length + data.gifts.length} */}
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        <div className="playerDiceRow">
          <div className="playerCube">
            <CubeStack number={data.cube} color="pink" />
          </div>
          <div>
            <div className="playerDicePool">
              {pool.map((dv, i) => {
                return <Dice key={i} number={dv} />;
              })}
            </div>

            <div className="playerDicePool" id="playerGiftPool">
              {giftPool.map((dv, i) => {
                console.log("playerGiftPool", i, dv);
                return <Dice key={i} number={dv} />;
              })}
            </div>
          </div>
        </div>
        {data?.rolled.length > 0 && (
          <>
            <>I rolled [{data.rolled.join(", ")}].</>
            <>
              <>
                <br /> Giving [{leftGiveAway.join(", ")}] to{" "}
                <NameBox>{players[data.left].name}</NameBox>
              </>
              <>
                , and [{rightGiveAway.join(", ")}] to{" "}
                <NameBox>{players[data.right].name}</NameBox>
              </>
            </>
            <br />
          </>
        )}
        {data.win !== false && (
          <>
            <div className="win">I HAVE COMPLETED MY CUBE [{data.win}]</div>
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
