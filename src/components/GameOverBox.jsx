import { Emoji } from "~components/Emoji";
import "./GameOverBox.css";
import { useContext } from "react";
import { NameBox } from "~components/NameBox";

import { GameContext } from "~contexts/game";
import { PlayersContext } from "~contexts/players";
import { playerLookup } from "~util/players";

export const GameOverBox = ({ type }) => {
  let contents = <></>;
  const { winState } = useContext(GameContext);
  const players = useContext(PlayersContext);

  switch (type) {
    case "win":
      contents = (
        <>
          <Emoji>👑</Emoji> WINNER{winState?.length > 1 && <>S</>} DETECTED:{" "}
          {winState.map((winnerUuid, loopId) => {
            const p = playerLookup(winnerUuid, players);

            return (
              <span key={loopId}>
                {loopId > 0 && <>| </>}
                <NameBox title={p.uuid}>{p.name}</NameBox>
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
          <Emoji>☠</Emoji> NO WINNERS, CUBES REVOLT, EVERYONE EATEN <Emoji>☠</Emoji>
        </>
      );
      break;
    default:
      return null;
  }

  return <div className={`gameOverBox ${type}`}>{contents}</div>;
};
