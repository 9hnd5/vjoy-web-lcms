import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  AutocompleteInput,
  Create,
  DateInput,
  maxLength,
  ReferenceInput,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
} from "react-admin";
import { KID_GENDER } from "../kid.constants";

export const KidCreate = () => {
  return (
    <Create>
      <SimpleForm style={{ maxWidth: 500 }}>
        <Typography variant="h5">Create Kid</Typography>
        <TextInput source="id" disabled fullWidth />
        <Box sx={{ display: "flex", width: "100%", gap: "0.5em" }}>
          <TextInput source="firstname" label="First Name" fullWidth validate={[required(), maxLength(50)]} />
          <TextInput source="lastname" label="Last Name" fullWidth validate={[maxLength(50)]} />
        </Box>
        <Box sx={{ display: "flex", width: "100%", gap: "0.5em" }}>
          <DateInput source="dob" label="Date of birth" fullWidth validate={[required()]} />
          <SelectInput source="gender" label="Gender" choices={KID_GENDER} validate={[required()]} fullWidth />
        </Box>
        <ReferenceInput source="parentId" reference="core/users">
          <AutocompleteInput
            optionText={(choice) => `${choice.firstname} ${choice.lastname}`}
            validate={[required()]}
            fullWidth
          />
        </ReferenceInput>
        <ReferenceInput source="role.code" reference="core/roles">
          <AutocompleteInput
            label="Role"
            name="roleCode"
            optionText="name"
            optionValue="code"
            validate={[required()]}
            fullWidth
          />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  );
};
