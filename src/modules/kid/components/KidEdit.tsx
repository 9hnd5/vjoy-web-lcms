import Box from "@mui/material/Box";
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
  useNotify,
  useRedirect,
  useUpdate,
} from "react-admin";
import { useParams } from "react-router-dom";
import { KID_GENDER } from "../kid.constants";

export const KidEdit = () => {
  const { parentId, kidId } = useParams();
  const notify = useNotify();
  const redirect = useRedirect();
  const [update] = useUpdate();
  const kidSave = (data: any) => {
    update(
      "core/parents",
      { id: kidId, data, meta: { userId: parentId } },
      {
        onSuccess: () => {
          notify("Kid update successful");
          redirect("list", "core/kids");
        },
        onError: () => notify("Kid update failed"),
      }
    );
  };

  return (
    <Edit resource="core/parents" id={kidId} queryOptions={{ meta: { userId: parentId } }}>
      <SimpleForm style={{ maxWidth: 500 }} toolbar={<EditToolbar />} onSubmit={kidSave}>
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
        <Box display={{ xs: "block", sm: "flex", width: "100%" }}>
          <Box flex={1} mr={{ xs: 0, sm: "0.5em" }}>
            <DateInput source="dob" label="Date of birth" fullWidth />
          </Box>
          <Box flex={1} ml={{ xs: 0, sm: "0.5em" }}>
            <SelectInput source="gender" label="Gender" choices={KID_GENDER} />
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
