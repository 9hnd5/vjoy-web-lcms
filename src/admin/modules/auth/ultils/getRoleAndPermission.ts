import { LOCAL_STORAGE_KEY } from "admin/ultils/constants";

/**
 * Get the role and permission of a user from local storage.
 * @returns {Object} An object containing the roleId and permissions of a user. If no user is found, return null.
 */
export const getRoleAndPermission = () => {
  const userString = localStorage.getItem(LOCAL_STORAGE_KEY.USER);
  if (!userString) return null;
  const user = JSON.parse(userString);
  return {
    roleId: user.roleId,
    permissions: user.permissions,
  };
};
