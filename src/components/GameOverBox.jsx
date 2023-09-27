import { Emoji } from "~components/Emoji";
import "./GameOverBox.css";
import { useContext } from "react";
import { NameBox } from "~components/NameBox";

import { GameContext } from "~contexts/game";
import { PlayersContext } from "~contexts/players";

export const GameOverBox = ({ type }) => {
  let contents = <></>;
  const { winState } = useContext(GameContext);
  const players = useContext(PlayersContext);

  switch (type) {
    case "win":
      contents = (
        <>
          <Emoji>👑</Emoji> WINNER{winState?.length > 1 && <>S</>} DETECTED:{" "}
          {winState.map((playerId, loopId) => {
            const p = players[playerId];
            return (
              <span key={loopId}>
                {loopId > 0 && <>| </>}
                <NameBox title={p.id}>{p.name}</NameBox>
              </span>
            );
          })}{" "}
          <Emoji>👑</Emoji>
        </>
      );
      break;
    case "lose":
      contents = (
        <>
          <Emoji>☠</Emoji> NO WINNERS, CUBES REVOLT, EVERYONE EATEN{" "}
          <Emoji>☠</Emoji>
        </>
      );
      break;
    default:
      return null;
  }

  return <div className={`gameOverBox ${type}`}>{contents}</div>;
};
