import { UserModel } from "./User.model";

export interface MessageModel {
    uuid: string;
    body: string;
    created: string;
    user: UserModel;
    room_uuid: string;
    name: string;
}
