import { Box } from "@mui/material";
import {
  Datagrid,
  DateField,
  CreateButton,
  EmailField,
  FilterButton,
  FunctionField,
  List,
  TextField,
  TopToolbar,
  SelectField,
  SearchInput,
  EditButton,
  DeleteWithConfirmButton,
} from "react-admin";
import { USER_STATUS } from "../user.constants";

const listFilters = [<SearchInput key="search" source="q" alwaysOn />];

const ListActions = () => (
  <TopToolbar>
    <FilterButton filters={listFilters} />
    <CreateButton />
  </TopToolbar>
);

export const UserList = () => {
  return (
    <List filters={listFilters} actions={<ListActions />}>
      <Datagrid bulkActionButtons={false}>
        <TextField source="id" />
        <TextField label="First name" source="firstname" />
        <TextField label="Last name" source="lastname" />
        <EmailField source="email"/>
        <TextField source="phone" />
        <SelectField source="status" choices={USER_STATUS} />
        <FunctionField label="Role" render={(record: any) => record.role.name} />
        <DateField source="createdAt" locales="en-GB" showTime={true} />
        <Box display={{ xs: "block", sm: "flex", width: "100%" }}>
          <EditButton />
          <DeleteWithConfirmButton />
        </Box>
      </Datagrid>
    </List>
  );
};
