import { Datagrid, EmailField, List, TextField } from "react-admin";
export const UserList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="firstName" />
        <TextField source="lastName" />
        <TextField source="dateOfBirth" />
        <EmailField source="email" />
        <TextField source="gender" />
      </Datagrid>
    </List>
  );
};
