import {
  AutocompleteInput,
  Create,
  email,
  maxLength,
  RadioButtonGroupInput,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
  useGetList,
} from "react-admin";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export const UserCreate = () => {
  const roles = useGetList('roles');

  return (
    <Create>
      <SimpleForm sx={{ maxWidth: 500 }}>
        <Typography variant="h5">Create User</Typography>
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
        <RadioButtonGroupInput
          source="gender"
          choices={[
            { id: 0, name: "NEW" },
            { id: 1, name: "ACTIVATED" },
            { id: 2, name: "DEACTIVED" },
          ]}
        />
      </SimpleForm>
    </Create>
  );
};
