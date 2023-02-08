import React from "react";
import { usePermissions } from "react-admin";
import { Action } from "../authType";
import { canAccess } from "../ultils/canAccess";

type Props = {
  resource: string;
  action: Action;
  children?: React.ReactNode;
};
export const IfCanAccess = ({ resource, action, children }: Props) => {
  const { permissions } = usePermissions();
  
  if (canAccess({ permissions, resource, action })) return <React.Fragment>{children}</React.Fragment>;

  return null;
};
