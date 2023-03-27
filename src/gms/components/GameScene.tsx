import { Grid } from "@mui/material";
import React from "react";
const GameSceneContext = React.createContext(false);
type GameSceneProps = {
  children?: React.ReactNode;
};
const GameScene = (props: GameSceneProps) => {
  return (
    <GameSceneContext.Provider value={true}>
      <Grid container>{props.children}</Grid>
    </GameSceneContext.Provider>
  );
};

type RightMidLeftProps = {
  children?: React.ReactNode;
};
const Right = (props: RightMidLeftProps) => {
  const context = React.useContext(GameSceneContext);
  if (!context) throw new Error("GameScene.Right Component should be inside GameScene");
  return (
    <Grid xs={4} item>
      {props.children}
    </Grid>
  );
};
const Mid = (props: RightMidLeftProps) => {
  const context = React.useContext(GameSceneContext);
  if (!context) throw new Error("GameScene.Mid Component should be inside GameScene");
  return (
    <Grid xs={4} item>
      {props.children}
    </Grid>
  );
};

const Left = (props: RightMidLeftProps) => {
  const context = React.useContext(GameSceneContext);
  if (!context) throw new Error("GameScene.Left Component should be inside GameScene");
  return (
    <Grid xs={4} item>
      {props.children}
    </Grid>
  );
};
GameScene.Left = Left;
GameScene.Right = Right;
GameScene.Mid = Mid;
export { GameScene };
