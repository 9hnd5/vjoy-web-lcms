import { Edit } from "@mui/icons-material";
import { Box } from "@mui/material";
import {
  Button,
  CreateButton,
  Datagrid,
  DateField,
  DeleteWithConfirmButton,
  FilterButton,
  FunctionField,
  List,
  SearchInput,
  TextField,
  TopToolbar,
  useRecordContext,
  useRedirect,
  WithRecord
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

const EditButton = () => {
  const {
    id,
    parent: { id: parentId },
  } = useRecordContext();
  const redirect = useRedirect();
  return <Button label="edit" onClick={() => redirect(`/core/users/${parentId}/kids/${id}`)} startIcon={<Edit />} />;
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
      >
        <TextField label="ID" source="id" />
        <FunctionField label="Name" noWrap render={(record: any) => `${record.firstname} ${record.lastname}`} />
        <DateField label="DoB" source="dob" locales="en-GB" />
        <FunctionField label="Parent" noWrap render={({ parent }: any) => `${parent.firstname} ${parent.lastname}`} />
        <TextField label="Role" source="role.name" />
        <DateField label="Last Updated" noWrap source="updatedAt" locales="en-GB" showTime={true} />
        <Box sx={{ display: "flex" }}>
          <EditButton />
          <WithRecord
            render={({ parent: { id } }) => <DeleteWithConfirmButton mutationOptions={{ meta: { userId: id } }} />}
          />
        </Box>
      </Datagrid>
    </List>
  );
};
