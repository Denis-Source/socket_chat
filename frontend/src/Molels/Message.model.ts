import {UserModel} from "./User.model";
import {RoomModel} from "./Room.model";

export interface MessageModel{
    uuid: string;
    body: string;
    created: string;
    user: UserModel;
    room: RoomModel;
    name: string;
}