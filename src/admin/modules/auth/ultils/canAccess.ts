import { Action, Permission } from "../authType";

type Data = {
  permissions: Permission[];
  resource: string;
  action: Action;
};
export const canAccess = ({ permissions, resource, action }: Data) => {
  const hasResource = permissions?.some((p) => p.resource === "*" || p.resource === resource);
  if (!hasResource) return false;

  const hasAction = permissions?.some((p) => {
    if (p.action === "*") return true;
    if (typeof p.action === "string") return p.action === action;
    return p.action.some((a) => a === action);
  });
  if (!hasAction) return false;

  return true;
};
