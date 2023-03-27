import { Grid } from "@mui/material";
import React from "react";
const EditorSceneContext = React.createContext(false);
type EditorSceneProps = {
  children: Iterable<React.ReactNode> & {
    0: React.ReactElement<typeof Left>;
    1: React.ReactElement<typeof Mid>;
    2: React.ReactElement<typeof Right>;
  };
};
const EditorScene = ({ children }: EditorSceneProps) => {
  const left = React.Children.toArray(children)[0] as React.ReactElement<typeof Left>;
  const mid = React.Children.toArray(children)[1] as React.ReactElement<typeof Mid>;
  const right = React.Children.toArray(children)[2] as React.ReactElement<typeof Right>;

  if (!left || left.type !== Left) throw new Error("EditorScene must contain Left component as first child");

  if (!mid || mid.type !== Mid) throw new Error("EditorScene must contain Mid component as second child");

  if (!right || right.type !== Right) throw new Error("EditorScene must contain Right component as third child");

  return (
    <EditorSceneContext.Provider value={true}>
      <Grid container>{children}</Grid>
    </EditorSceneContext.Provider>
  );
};

type RightMidLeftProps = {
  children?: React.ReactNode;
};
const Right = (props: RightMidLeftProps) => {
  const context = React.useContext(EditorSceneContext);
  if (!context) throw new Error("EditorScene.Right Component should be inside EditorScene");

  return (
    <Grid xs={4} item>
      {props.children}
    </Grid>
  );
};
const Mid = (props: RightMidLeftProps) => {
  const context = React.useContext(EditorSceneContext);
  if (!context) throw new Error("EditorScene.Mid Component should be inside EditorScene");

  return (
    <Grid xs={4} item>
      {props.children}
    </Grid>
  );
};

const Left = (props: RightMidLeftProps) => {
  const context = React.useContext(EditorSceneContext);
  if (!context) throw new Error("EditorScene.Left Component should be inside EditorScene");

  return (
    <Grid xs={4} item>
      {props.children}
    </Grid>
  );
};

EditorScene.Left = Left;
EditorScene.Right = Right;
EditorScene.Mid = Mid;

export { EditorScene };
