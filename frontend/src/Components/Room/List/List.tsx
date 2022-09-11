import React from "react";
import { RoomModel } from "../../../Models/Room.model";
import { useSelector } from "react-redux";
import Item from "../Item/Item";
import styles from "./List.module.scss";
import ScrollToBottom from "react-scroll-to-bottom";
import CreateRoomButton from "../../Buttons/FuncButtons/CreateRoomButton";
import { ViewportList } from "react-viewport-list";

const List = ({ filterString }: { filterString: string }) => {
    // Get rooms from the state
    const rooms: RoomModel[] = useSelector((state: any) => state.room.list);

    const filteredRooms = rooms.filter((room) =>
        room.name.toLowerCase().includes(filterString.toLowerCase())
    );
    return (
        <div className={styles.wrapper}>
            <ScrollToBottom
                initialScrollBehavior={"auto"}
                followButtonClassName={styles.followButton}
                className={styles.listWrapper}
            >
                <div className={styles.list}>
                    <ViewportList items={filteredRooms}>
                        {(item) => <Item room={item} key={item.uuid} />}
                    </ViewportList>
                    <CreateRoomButton />
                </div>
            </ScrollToBottom>
        </div>
    );
};

export default List;
