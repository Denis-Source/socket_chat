import { RoomModel } from "./Room.model";

export interface UserModel {
    name: string;
    room?: RoomModel;
    uuid: string;
}
