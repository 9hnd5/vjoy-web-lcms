import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  AutocompleteArrayInput,
  DateInput,
  Edit,
  email,
  maxLength,
  RadioButtonGroupInput, 
  regex, 
  required,
  SimpleForm,
  TextInput
} from "react-admin";
import { regexPhoneNumber } from "ultils/constants";

export const UserEdit = () => {
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
              source="firstName"
              label="First Name"
              fullWidth
              validate={[required(), maxLength(50)]}
            />
          </Box>
          <Box flex={1} ml={{ xs: 0, sm: "0.5em" }}>
            <TextInput
              source="lastName"
              label="Last Name"
              fullWidth
              validate={[required(), maxLength(50)]}
            />
          </Box>
        </Box>
        <DateInput
          source="dateOfBirth"
          label="Date of birth"
          fullWidth
          validate={[required()]}
        />
        <TextInput
          source="email"
          label="Email"
          fullWidth
          validate={[email(), required()]}
        />
        <TextInput
          source="phone"
          label="Phone"
          fullWidth
          validate={[regex(regexPhoneNumber, "Not Viet Nam phone number format")]}
        />
        <AutocompleteArrayInput source="roles" label="Roles" choices={[
            { id: 'admin', name: 'Admin' },
            { id: 'u001', name: 'Editor' },
            { id: 'u002', name: 'Moderator' },
            { id: 'u003', name: 'Reviewer' },
          ]} 
          fullWidth
          validate={[required()]}
        />
        <RadioButtonGroupInput
          source="gender"
          choices={[
            { id: "Male", name: "Male" },
            { id: "Female", name: "Female" },
          ]}
          validate={[required()]}
        />
      </SimpleForm>
    </Edit>
  );
};
