export type Action = "*" | "read" | "write" | "delete" | "list";
export type Permission = {
  resource: string;
  action: Action | Action[];
};
