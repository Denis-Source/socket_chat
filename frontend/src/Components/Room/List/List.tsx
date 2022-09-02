import React, {useState} from 'react';
import {RoomModel} from "../../../Molels/Room.model";
import {useDispatch, useSelector} from "react-redux";
import Item from "../Item/Item";
import {RoomStatements} from "../../../StatementsTypes/RoomStatements";
import useWebSocket from "react-use-websocket";
import {WSS_FEED_URL} from "../../../api";
import {leave} from "../../../Reducers/Room";
import styles from "./List.module.scss"
import {Strings} from "../../../strings";
import add from "../../../Static/Images/add.svg";
import ScrollToBottom from "react-scroll-to-bottom";

const List = () => {
    // Configure websocket connection
    const {sendJsonMessage} = useWebSocket(WSS_FEED_URL, {
        share: true
    });

    const [filteredString, setFilteredString] = useState<string>("");

    // Select rooms including the current one
    const rooms: RoomModel[] = useSelector((state: any) => state.room.list);
    const currentRoom: RoomModel[] = useSelector((state: any) => state.room.current);

    const dispatch = useDispatch()

    // Function to leave the entered room
    const sendLeave = async () => {
        dispatch(leave())
        await sendJsonMessage({
            type: "call",
            payload: {
                message: RoomStatements.LeaveRoom,
            }
        })
    }

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
            <div className={currentRoom ? styles.headerWrapperOne: styles.headerWrapper}>
                {!currentRoom &&
                    <h3 className={styles.header}>{Strings.ListRoomHeader}</h3>}
                <div className={styles.searchWrapper}>
                    <label className={styles.searchLabel}>Search:</label>
                    <input className={styles.search} type="text"
                           onChange={(event) => setFilteredString(event.target.value)}/>
                </div>
            </div>
            <ScrollToBottom followButtonClassName={styles.followButton} className={styles.list}>
                {rooms.filter(room => room.name.toLowerCase().includes(filteredString.toLowerCase())).map(room =>
                    <Item room={room} key={room.uuid}/>
                )}
            </ScrollToBottom>

            <button className={styles.button} onClick={sendCreate}>
                <img className={styles.buttonIcon} src={add} alt="Add icon"/>
            </button>
        </div>

    );
};

export default List;