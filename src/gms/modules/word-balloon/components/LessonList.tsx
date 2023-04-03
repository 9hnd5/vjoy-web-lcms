import { Box, Chip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { LESSON_STATUS, useGetLessonsQuery } from "gms/services/lessonService";
const columns: GridColDef[] = [
  {
    field: "id",
    width: 100,
    headerName: "ID",
  },
  {
    field: "name",
    width: 200,
    headerName: "Name",
  },
  {
    field: "status",
    width: 150,
    headerName: "Status",
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      const { value } = params;
      if (value === LESSON_STATUS.SAVED) return <Chip label="Saved" color="primary" />;
      if (value === LESSON_STATUS.APPROVED) return <Chip label="Approved" color="secondary" />;
      if (value === LESSON_STATUS.PUBLISHED) return <Chip label="Published" color="success" />;
      if (value === LESSON_STATUS.HIDDEN) return <Chip label="Hidden" color="info" />;
    },
  },
];

type Props = {
  onSelect?: (id: number) => void;
};

export const LessonList = (props: Props) => {
  const { onSelect } = props;
  const { data: { data } = { data: { rows: [], count: 0 } }, isLoading } = useGetLessonsQuery({});

  return (
    <Box sx={{ height: 500, width: 500 }}>
      <DataGrid columns={columns} rows={data.rows} loading={isLoading} onRowClick={(data) => onSelect?.(+data.id)} />
    </Box>
  );
};
