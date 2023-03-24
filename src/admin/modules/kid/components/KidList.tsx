import {
  CreateButton,
  Datagrid,
  DateField,
  FilterButton,
  FunctionField,
  List,
  SearchInput,
  TextField,
  TopToolbar,
} from "react-admin";

const listFilters = [<SearchInput key="search" source="q" alwaysOn />];

const ListActions = () => {
  return (
    <TopToolbar>
      <FilterButton filters={listFilters} />
      <CreateButton />
    </TopToolbar>
  );
};

export const KidList = () => {
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
        <TextField label="ID" source="id" />
        <FunctionField label="Name" noWrap render={(record: any) => `${record.firstname} ${record.lastname}`} />
        <DateField label="DoB" source="dob" locales="en-GB" />
        <FunctionField label="Parent" noWrap render={({ parent }: any) => `${parent.firstname} ${parent.lastname}`} />
        <TextField label="Role" source="role.name" />
        <DateField label="Last Updated" noWrap source="updatedAt" locales="en-GB" showTime={true} />
      </Datagrid>
    </List>
  );
};
