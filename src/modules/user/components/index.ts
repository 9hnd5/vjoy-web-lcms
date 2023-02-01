import { UserCreate } from "./UserCreate";
import { UserEdit } from "./UserEdit";
import { UserList } from "./UserList";

export default {
  user: {
    list: UserList,
    edit: UserEdit,
    create: UserCreate,
  }
};