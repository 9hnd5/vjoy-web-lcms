import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { EditToolbar } from "components/EditToolbar";
import {
  AutocompleteInput,
  Edit,
  email,
  maxLength,
  ReferenceInput,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
} from "react-admin";
import { USER_STATUS } from "../user.constants";

export const UserEdit = () => {
  return (
    <Edit>
      <SimpleForm style={{ maxWidth: 500 }} toolbar={<EditToolbar />}>
        <Typography variant="h5">Edit User</Typography>
        <Box display={{ width: "100%" }}>
          <TextInput source="id" disabled fullWidth />
        </Box>
        <Box display={{ xs: "block", sm: "flex", width: "100%" }}>
          <Box flex={1} mr={{ xs: 0, sm: "0.5em" }}>
            <TextInput source="firstname" label="First Name" fullWidth validate={[required(), maxLength(50)]} />
          </Box>
          <Box flex={1} ml={{ xs: 0, sm: "0.5em" }}>
            <TextInput source="lastname" label="Last Name" fullWidth validate={[required(), maxLength(50)]} />
          </Box>
        </Box>
        <Box display={{ width: "100%" }}>
          <TextInput source="email" label="Email" fullWidth validate={[email()]} />
          <TextInput source="phone" label="Phone" fullWidth />
          <ReferenceInput source="roleId" reference="core/roles">
            <AutocompleteInput optionText="name" validate={[required()]} />
          </ReferenceInput>
          <SelectInput source="status" choices={USER_STATUS} validate={[required()]} />
        </Box>
      </SimpleForm>
    </Edit>
  );
};
