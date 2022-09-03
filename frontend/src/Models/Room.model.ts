import { UserModel } from "./User.model";

export interface RoomModel {
  uuid: string;
  name: string;
  color: string;
  users: UserModel[];
  sum: number;
}
