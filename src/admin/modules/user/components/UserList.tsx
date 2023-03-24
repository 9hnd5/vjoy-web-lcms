import {
  CreateButton,
  Datagrid,
  DateField,
  EmailField,
  FilterButton,
  FunctionField,
  List,
  SearchInput,
  SelectField,
  TextField,
  TopToolbar,
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
      <Datagrid
        size="medium"
        sx={{
          "& .column-id": { width: 100 },
          "& .RaDatagrid-rowCell": { overflow: "hidden", textOverflow: "ellipsis" },
        }}
        bulkActionButtons={false}
        style={{ tableLayout: "fixed" }}
        rowClick="edit"
      >
        <TextField source="id" />
        <FunctionField label="Name" noWrap render={(record: any) => `${record.firstname} ${record.lastname}`} />
        <EmailField source="email" />
        <TextField source="phone" />
        <SelectField source="status" choices={USER_STATUS} />
        <FunctionField label="Role" render={(record: any) => record.role.name} />
        <DateField label="Last Updated" noWrap source="updatedAt" locales="en-GB" showTime={true} />
      </Datagrid>
    </List>
  );
};
