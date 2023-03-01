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
  useCreate,
  useNotify,
  useRedirect,
} from "react-admin";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { KID_GENDER } from "../kid.constants";

export const KidCreate = () => {
  const notify = useNotify();
  const redirect = useRedirect();
  const [create] = useCreate();
  const kidSave = (data: any) => {
    create(
      "core/parents",
      { data },
      {
        onSuccess: () => {
          notify("Kid create successful");
          redirect("list", "core/kids");
        },
        onError: (error) => notify(`Kid create failed ${error}`),
      }
    );
  };

  return (
    <Create>
      <SimpleForm style={{ maxWidth: 500 }} onSubmit={kidSave}>
        <Typography variant="h5">Create Kid</Typography>
        <Box display={{ width: "100%" }}>
          <TextInput source="id" disabled fullWidth />
        </Box>
        <Box display={{ xs: "block", sm: "flex", width: "100%" }}>
          <Box flex={1} mr={{ xs: 0, sm: "0.5em" }}>
            <TextInput source="firstname" label="First Name" fullWidth validate={[required(), maxLength(50)]} />
          </Box>
          <Box flex={1} ml={{ xs: 0, sm: "0.5em" }}>
            <TextInput source="lastname" label="Last Name" fullWidth validate={[maxLength(50)]} />
          </Box>
        </Box>
        <Box display={{ xs: "block", sm: "flex", width: "100%" }}>
          <Box flex={1} mr={{ xs: 0, sm: "0.5em" }}>
            <DateInput source="dob" label="Date of birth" fullWidth validate={[required()]} />
          </Box>
          <Box flex={1} ml={{ xs: 0, sm: "0.5em" }}>
            <SelectInput source="gender" label="Gender" choices={KID_GENDER} validate={[required()]} />
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
    </Create>
  );
};
