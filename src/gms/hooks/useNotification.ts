import { openNotification } from "gms/slice";
import { useAppDispatch } from "./useAppDispatch";

type Payload = Omit<Parameters<typeof openNotification>[0], "severity">;

export const useNotification = () => {
  const dispatch = useAppDispatch();

  const action = (payload: Payload, severity: Parameters<typeof openNotification>[0]["severity"]) => {
    dispatch(openNotification({ ...payload, severity }));
  };

  const notify = {
    success: (payload: Payload) => {
      return action(payload, "success");
    },
    error: (payload: Payload) => {
      return action(payload, "error");
    },
  };

  return notify;
};
