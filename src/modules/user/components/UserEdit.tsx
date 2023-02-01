import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  AutocompleteInput,
  Edit,
  email,
  maxLength,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
  useGetList,
} from "react-admin";
import { regexPhoneNumber } from "ultils/constants";

export const UserEdit = () => {
  const roles = useGetList('roles');

  return (
    <Edit>
      <SimpleForm style={{ maxWidth: 500 }}>
        <Typography variant="h5">Edit User</Typography>
        <Box display={{ width: "100%" }}>
          <TextInput source="id" disabled fullWidth />
        </Box>
        <Box display={{ xs: "block", sm: "flex", width: "100%" }}>
          <Box flex={1} mr={{ xs: 0, sm: "0.5em" }}>
            <TextInput
              source="firstname"
              label="First Name"
              fullWidth
              validate={[required(), maxLength(50)]}
            />
          </Box>
          <Box flex={1} ml={{ xs: 0, sm: "0.5em" }}>
            <TextInput
              source="lastname"
              label="Last Name"
              fullWidth
              validate={[required(), maxLength(50)]}
            />
          </Box>
        </Box>
        <TextInput
          source="email"
          label="Email"
          fullWidth
          validate={[required(), email()]}
        />
        <TextInput
          source="phone"
          label="Phone"
          fullWidth
        />
        <AutocompleteInput source="roleId" label="Role" choices={roles.data} 
          fullWidth
          validate={[required()]}
        />
        <SelectInput
          source="status"
          choices={[
            { id: 0, name: "NEW" },
            { id: 1, name: "ACTIVATED" },
            { id: 2, name: "DEACTIVED" },
          ]}
        />
      </SimpleForm>
    </Edit>
  );
};
