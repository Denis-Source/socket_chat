import React from 'react';
import {RoomModel} from "../../../Models/Room.model";
import {useSelector} from "react-redux";
import Item from "../Item/Item";
import {RoomStatements} from "../../../StatementsTypes/RoomStatements";
import useWebSocket from "react-use-websocket";
import {WSS_FEED_URL} from "../../../api";
import styles from "./List.module.scss"
import add from "../../../Static/Images/add.svg";
import ScrollToBottom from "react-scroll-to-bottom";

const List = ({filterString}: {filterString: string}) => {
    // Configure websocket connection
    const {sendJsonMessage} = useWebSocket(WSS_FEED_URL, {
        share: true
    });

    // Select rooms
    const rooms: RoomModel[] = useSelector((state: any) => state.room.list);

    // Function to create a new room
    const sendCreate = async () => {
        await sendJsonMessage({
            type: "call",
            payload: {
                message: RoomStatements.CreateRoom,
            }
        })
    }

    return (
        <div className={styles.wrapper}>
            <ScrollToBottom initialScrollBehavior={"auto"} followButtonClassName={styles.followButton} className={styles.listWrapper}>
                <div className={styles.list}>
                    {rooms.filter(room => room.name.toLowerCase().includes(filterString.toLowerCase())).map(room =>
                        <Item room={room} key={room.uuid}/>
                    )}
                    <button className={styles.button} onClick={sendCreate}>
                        <img className={styles.buttonIcon} src={add} alt="Add icon"/>
                    </button>
                </div>
            </ScrollToBottom>
        </div>

    );
};

export default List;