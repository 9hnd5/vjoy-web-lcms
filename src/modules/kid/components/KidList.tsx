import {
  Datagrid,
  DateField,
  CreateButton,
  EmailField,
  FilterButton,
  FunctionField,
  List,
  TextField,
  TopToolbar,
  SelectField,
  SearchInput,
  Button,
  useCreatePath,
  useBasename,
  useRecordContext,
  useRedirect,
} from "react-admin";
import { useNavigate } from "react-router-dom";

const listFilters = [<SearchInput key="search" source="q" alwaysOn />];

const ListActions = () => (
  <TopToolbar>
    <FilterButton filters={listFilters} />
    <CreateButton />
  </TopToolbar>
);

const TestButton = (props: any) => {
  const record = useRecordContext();
  const redirect = useRedirect();
  const handleClick = () => {
    redirect(`/core/users/${record.parentId}/kids/${record.id}`);
  };
  return <Button label="Edit" onClick={handleClick} {...props} />;
};

export const KidList = (props: any) => {
  return (
    <List filters={listFilters} actions={<ListActions />}>
      <Datagrid>
        <TextField source="id" />
        <TextField label="First name" source="firstname" />
        <TextField label="Last name" source="lastname" />
        <FunctionField
          label="Parent"
          render={(record: any) => `${record.parent.firstname} ${record.parent.lastname}`}
        />
        <FunctionField label="Role" render={(record: any) => record.role.name} />
        <DateField source="createdAt" locales="en-GB" showTime={true} />
        <TestButton />
        {/* <Button label="Edit" onClick={(record: any) => { const link = `${basename}/core/users/${record.parentId}/kids/${record.id}`; navigate(link); }} /> */}
      </Datagrid>
    </List>
  );
};
