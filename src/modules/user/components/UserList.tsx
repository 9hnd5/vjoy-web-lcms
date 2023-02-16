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
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField label="First name" source="firstname" />
        <TextField label="Last name" source="lastname" />
        <EmailField source="email"/>
        <TextField source="phone" />
        <SelectField source="status" choices={USER_STATUS} />
        <FunctionField label="Role" render={(record: any) => record.role.name} />
        <DateField source="createdAt" locales="en-GB" showTime={true} />
      </Datagrid>
    </List>
  );
};
