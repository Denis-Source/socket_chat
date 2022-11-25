import React from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import styles from "./List.module.scss";
import { UserModel } from "../../../Models/User.model";
import Item from "../Item/Item";
import { RoomModel } from "../../../Models/Room.model";
import { useSelector } from "react-redux";

const List = () => {
    // Get the current room and the user from the state
    const currentRoom: RoomModel = useSelector(
        (state: any) => state.room.current
    );
    const currentUser: UserModel = useSelector((state: any) => state.user.user);

    return (
        <>
            <ScrollToBottom
                initialScrollBehavior={"auto"}
                className={styles.wrapper}
                followButtonClassName={styles.scrollButton}
            >
                <div className={styles.users}>
                    {currentRoom.users.map((user) => (
                        <Item
                            user={user}
                            isMe={user.uuid === currentUser.uuid}
                            key={user.uuid}
                        />
                    ))}
                </div>
            </ScrollToBottom>
        </>
    );
};

export default List;
