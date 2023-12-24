# What

A dumb little react implentation of a game played with dice.

Its a semi-clone of a physical dice game based on building a gelatinous cube, but I'm sure I've also seen it elsewere as some sort of generic game to play with d6.

I make no claim to own this game, or its concept. This is entirely a programming mechanics playground.

* Deployed https://uberfuzzy.github.io/g-dice/
* HEAD https://magenta-taiyaki-f74a33.netlify.app/

# Why

Wanted to play around with some React (outside of Gatsby) to help learn and strengthen some logical (mis)assumptions I had. Also was bored.

Much like playing "war" with a deck of cards, there is no skill involved, and a pure implentation of mechanics. I like using those as programming exercise, because you know what the endgoal is supposed to do.

# Game Rules

1. Each player starts with 6 dice (d6).
2. Everyone rolls at the same time.
3. As an atomic action, everyone:
  4. give your `1`s to the player on your left
  5. move your `3`s to your cube pile.
  6. give your `6`s to the player on your right.
7. If one or more player completes their cube (stack of >=8) at the same time, the player with the LEAST unstacked cubes wins.
8. If at any point no one has any unstacked cubes, everyone is eaten, and everyone loses.

   

