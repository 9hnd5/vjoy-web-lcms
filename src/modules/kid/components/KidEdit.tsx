import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  AutocompleteInput,
  Edit,
  maxLength,
  ReferenceInput,
  required,
  SimpleForm,
  TextInput,
  useEditContext,
  useRecordContext,
} from "react-admin";

export const KidEdit = () => {
  
  return (
    <Edit>
      <SimpleForm style={{ maxWidth: 500 }}>
        <Typography variant="h5">Edit Kid</Typography>
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
          <ReferenceInput source="parentId" reference="core/users">
            <AutocompleteInput
              optionText={(choice) => `${choice.firstname} ${choice.lastname}`}
              validate={[required()]}
            />
          </ReferenceInput>
          <ReferenceInput source="roleId" reference="core/roles">
            <AutocompleteInput optionText="name" validate={[required()]} />
          </ReferenceInput>
        </Box>
      </SimpleForm>
    </Edit>
  );
};
