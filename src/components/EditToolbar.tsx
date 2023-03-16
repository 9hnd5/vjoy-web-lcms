import { DeleteWithConfirmButton, SaveButton, Toolbar } from "react-admin";

export const EditToolbar = () => {
  return (
    <Toolbar sx={{ justifyContent: "space-between" }}>
      <SaveButton />
      <DeleteWithConfirmButton size="medium" />
    </Toolbar>
  );
};
