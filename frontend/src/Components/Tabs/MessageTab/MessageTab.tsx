import React, {useState} from 'react';
import Form from "../../Message/Form/Form";
import List from "../../Message/List/List";
import {Strings} from "../../../strings";
import styles from "./MessageTab.module.scss"
import useWebSocket from "react-use-websocket";
import {WSS_FEED_URL} from "../../../api";
import {RoomModel} from "../../../Models/Room.model";
import {useDispatch, useSelector} from "react-redux";
import {RoomStatements} from "../../../StatementsTypes/RoomStatements";
import {RightTabs, setRightTab} from "../../../Reducers/General";
import back from "../../../Static/Images/back.svg"
import {leaveRoom} from "../../../Reducers/Room";

const MessageTab = () => {
    const {sendJsonMessage} = useWebSocket(WSS_FEED_URL, {
        share: true
    });

    const currentRoom: RoomModel = useSelector((state: any) => state.room.current);


    const [focus, setFocus] = useState<boolean>(false);
    const [enteredName, setEnteredName] = useState<string>(currentRoom?.name);

    // Function to update the room name
    const sendUpdate = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setEnteredName(event.target.value);
        await sendJsonMessage({
            type: "call",
            payload: {
                message: RoomStatements.ChangeRoomName,
                uuid: currentRoom.uuid,
                name: event.target.value
            }
        })
    }

    // If the input is selected, avoid changes
    if (!focus && enteredName !== currentRoom?.name) {
        setEnteredName(currentRoom?.name)
    }

    const dispatch = useDispatch();


    // Function to leave the entered room
    const sendLeave = async () => {
        dispatch(leaveRoom())
        await sendJsonMessage({
            type: "call",
            payload: {
                message: RoomStatements.LeaveRoom,
            }
        })
        dispatch(setRightTab(RightTabs.Rooms))
    }


    return (
        <div>
            <div className={styles.header}>
                <div>
                    <button className={styles.button} onClick={() => sendLeave()}>
                        <img className={styles.buttonIcon} src={back} alt="Add icon"/>
                    </button>
                </div>
                <div>
                    <p className={styles.hint}>{Strings.MessageTabRoom}</p>
                    <input
                        className={styles.name}
                        value={enteredName}
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                        onFocus={() => {
                            setFocus(true)
                        }}
                        onBlur={() => {
                            setFocus(false)
                        }}
                        onChange={(event) => sendUpdate(event)}/>
                </div>
            </div>
            <List/>
            <Form/>
        </div>
    );
};

export default MessageTab;