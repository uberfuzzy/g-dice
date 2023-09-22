export const rollD6 = () => {
  return rollDice(6);
};

export function rollDice(sides) {
  return Math.floor(Math.random() * sides) + 1;
}
