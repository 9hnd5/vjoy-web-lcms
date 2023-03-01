import { Delete, Edit } from "@mui/icons-material";
import { Box } from "@mui/material";
import { isEmpty } from "lodash";
import { useState } from "react";
import {
  Datagrid,
  DateField,
  CreateButton,
  FilterButton,
  FunctionField,
  List,
  TextField,
  TopToolbar,
  SearchInput,
  Button,
  useRecordContext,
  useRedirect,
  useDelete,
  useNotify,
  Confirm,
  useRefresh,
} from "react-admin";

const listFilters = [<SearchInput key="search" source="q" alwaysOn />];

const ListActions = () => (
  <TopToolbar>
    <FilterButton filters={listFilters} />
    <CreateButton />
  </TopToolbar>
);

const EditButton = (props: any) => {
  const record = useRecordContext();
  const redirect = useRedirect();
  const handleClick = () => {
    redirect(`/core/parents/${record.parentId}/kids/${record.id}`);
  };
  return <Button label="Edit" onClick={handleClick} {...props} startIcon={<Edit />} />;
};

const DeleteButton = (props: any) => {
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const [deleteKid] = useDelete();

  const [open, setOpen] = useState(false);
  const handleClick = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);
  const handleConfirm = () => {
    deleteKid(
      "core/parents",
      { id: record.id, meta: { userId: record.parentId } },
      {
        onSuccess: () => {
          notify("Kid delete successful");
          setOpen(false);
          refresh();
        },
        onError: () => notify("Kid delete failed"),
      }
    );
  };
  return (
    <>
      <Button label="Delete" onClick={handleClick} {...props} startIcon={<Delete />} color="error" />
      <Confirm
        isOpen={open}
        title={`Delete kid #${record.id}`}
        content="Are you sure you want to delete this kid?"
        onConfirm={handleConfirm}
        onClose={handleDialogClose}
      />
    </>
  );
};

export const KidList = () => {
  return (
    <List filters={listFilters} actions={<ListActions />}>
      <Datagrid bulkActionButtons={false}>
        <TextField source="id" />
        <FunctionField label="Full name" render={(record: any) => `${record.firstname} ${record.lastname}`} />
        <DateField label="Date of birth" source="dob" locales="en-GB" />
        <FunctionField
          label="Parent"
          render={(record: any) =>
            !isEmpty(record.parent) ? `${record.parent.firstname} ${record.parent.lastname}` : ""
          }
        />
        <FunctionField label="Role" render={(record: any) => record.role.name} />
        <DateField source="updatedAt" locales="en-GB" showTime={true} />
        <Box display={{ xs: "block", sm: "flex", width: "100%" }}>
          <EditButton />
          <DeleteButton />
        </Box>
      </Datagrid>
    </List>
  );
};
