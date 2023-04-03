import { Alert, AlertTitle, Snackbar, Stack } from "@mui/material";
import { useAppDispatch } from "gms/hooks/useAppDispatch";
import { useAppSelector } from "gms/hooks/useAppSelector";
import { closeNotification, selectNotification } from "gms/slice";
export const Notification = () => {
  const { open, content, title, severity } = useAppSelector(selectNotification);

  const dispatch = useAppDispatch();

  const handleClose = () => dispatch(closeNotification());

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={handleClose}
      >
        <Alert variant="filled" onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {title && <AlertTitle>{title}</AlertTitle>}
          {content}
        </Alert>
      </Snackbar>
    </Stack>
  );
};
