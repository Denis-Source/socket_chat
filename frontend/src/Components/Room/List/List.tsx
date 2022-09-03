import React from 'react';
import {RoomModel} from "../../../Molels/Room.model";
import {useDispatch, useSelector} from "react-redux";
import Item from "../Item/Item";
import {RoomStatements} from "../../../StatementsTypes/RoomStatements";
import useWebSocket from "react-use-websocket";
import {WSS_FEED_URL} from "../../../api";
import {leaveRoom} from "../../../Reducers/Room";
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
    const dispatch = useDispatch()

    // Function to leave the entered room
    const sendLeave = async () => {
        dispatch(leaveRoom())
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
            <ScrollToBottom followButtonClassName={styles.followButton} className={styles.listWrapper}>
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