import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  DateInput,
  Edit,
  email,
  maxLength,
  RadioButtonGroupInput, required,
  SimpleForm,
  TextInput
} from "react-admin";

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
