import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import { EditToolbar } from "components/EditToolbar";
import {
  AutocompleteInput,
  DateInput,
  Edit,
  maxLength,
  ReferenceInput,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
} from "react-admin";
import { useParams } from "react-router-dom";
import { KID_GENDER } from "../kid.constants";

export const KidEdit = () => {
  const { userId, kidId } = useParams();
  return (
    <Edit
      mutationMode="pessimistic"
      resource="core/kids"
      id={kidId}
      mutationOptions={{ meta: { userId } }}
      queryOptions={{ meta: { userId } }}
    >
      <SimpleForm style={{ maxWidth: 500 }} toolbar={<EditToolbar />}>
        <Typography variant="h5">Edit Kid</Typography>
        <TextInput source="id" disabled fullWidth />
        <Box sx={{ display: "flex", width: "100%", gap: "0.5em" }}>
          <TextInput source="firstname" label="First Name" fullWidth validate={[required(), maxLength(50)]} />
          <TextInput source="lastname" label="Last Name" fullWidth validate={[required(), maxLength(50)]} />
        </Box>
        <Box sx={{ display: "flex", width: "100%", gap: "0.5em" }}>
          <DateInput source="dob" label="Date of birth" fullWidth />
          <SelectInput source="gender" label="Gender" choices={KID_GENDER} fullWidth />
        </Box>
        <ReferenceInput source="parent.id" reference="core/users">
          <AutocompleteInput
            label="Parent"
            name="parentId"
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
    </Edit>
  );
};
