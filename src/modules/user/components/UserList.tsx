import {
  Datagrid,
  DateField,
  CreateButton,
  EmailField,
  FilterButton,
  FunctionField,
  List,
  SelectField,
  TextField,
  TextInput,
  TopToolbar,
  SelectField,
} from "react-admin";

const listFilters = [<TextInput label="Search" key="search" source="q" alwaysOn />];

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
        <TextField source="firstname" />
        <TextField source="lastname" />
        <EmailField source="email"/>
        <TextField source="phone" />
        <SelectField source="status" choices={[
          { id: 0, name: "NEW" },
          { id: 1, name: "ACTIVATED" },
          { id: 2, name: "DEACTIVED" },
        ]} />
        <FunctionField render={(record: any) => record.role.name} />
        <DateField source="createdAt" locales="en-GB" showTime={true} />
      </Datagrid>
    </List>
  );
};
