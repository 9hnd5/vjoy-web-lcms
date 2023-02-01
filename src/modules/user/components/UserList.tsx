import {
  Datagrid,
  DateField,
  CreateButton,
  EmailField,
  FilterButton,
  List,
  TextField,
  TextInput,
  TopToolbar,
} from "react-admin";

const postFilters = [<TextInput label="Search" key="1" source="q" alwaysOn />];

const PostListActions = () => (
  <TopToolbar>
    <FilterButton filters={postFilters} />
    <CreateButton />
  </TopToolbar>
);

export const UserList = () => {
  return (
    <List filters={postFilters} actions={<PostListActions />}>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="firstName" />
        <TextField source="lastName" />
        <DateField source="dateOfBirth" locales="en-GB" />
        <EmailField source="email" />
        <TextField source="gender" />
        <DateField source="createdAt" locales="en-GB" showTime={true} />
      </Datagrid>
    </List>
  );
};
