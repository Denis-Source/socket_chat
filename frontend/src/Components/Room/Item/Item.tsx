import React, {useState} from 'react';
import {RoomModel} from "../../../Models/Room.model";
import {enterRoom} from "../../../Reducers/Room";
import useWebSocket from "react-use-websocket";
import {WSS_FEED_URL} from "../../../api";
import {RoomStatements} from "../../../StatementsTypes/RoomStatements";
import {useDispatch} from "react-redux";
import styles from "./Item.module.scss"
import cross from "../../../Static/Images/cross.svg"
import message from "../../../Static/Images/message.svg"
import user from "../../../Static/Images/user.svg"
import {TwitterPicker} from 'react-color';


const Item = ({room}: { room: RoomModel }) => {
    // Configure websocket connection
    const {sendJsonMessage} = useWebSocket(WSS_FEED_URL, {
        share: true
    });

    // Use states to properly handle form changes
    const [focus, setFocus] = useState<boolean>(false);
    const [enteredName, setEnteredName] = useState<string>(room.name);
    const [pickerVisible, setPickerVisible] = useState<boolean>(false);

    const dispatch = useDispatch()

    // Function to update the room name
    const sendUpdate = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setEnteredName(event.target.value);
        await sendJsonMessage({
            type: "call",
            payload: {
                message: RoomStatements.ChangeRoomName,
                uuid: room.uuid,
                name: event.target.value
            }
        })
    }

    // Function to select the room
    const sendSelect = async () => {
        dispatch(enterRoom(room));
        await sendJsonMessage({
            type: "call",
            payload: {
                message: RoomStatements.EnterRoom,
                uuid: room.uuid
            }
        });
    }

    // Function to delete the room
    const sendDelete = async () => {
        await sendJsonMessage({
            type: "call",
            payload: {
                message: RoomStatements.DeleteRoom,
                uuid: room.uuid
            }
        })
    }

    //Function to send new selected color
    const sendColor = async (color: string) => {
        await sendJsonMessage({
            type: "call",
            payload: {
                message: RoomStatements.ChangeRoomColor,
                uuid: room.uuid,
                color: color
            }
        });
    }


    // If the input is selected, avoid changes
    if (!focus && enteredName !== room.name) {
        setEnteredName(room.name)
    }

    return (
        <>
            <div className={styles.item} onClick={sendSelect}>
                <div className={styles.header}>
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
                    <button className={styles.closeButton} onClick={sendDelete}>
                        <img src={cross} alt="Cross icon"/>
                    </button>
                </div>
                <div className={styles.footer}>
                    <div className={styles.colorIcon} style={{backgroundColor: `${room.color}aa`}}
                         onClick={(event) => {
                             event.stopPropagation();
                             setPickerVisible(!pickerVisible)
                         }}>
                    </div>
                    <div className={styles.info}>
                        <div className={styles.stat}>
                            <img className={styles.statIcon} src={message} alt="Message icon"/>
                            <p className={styles.counter}>{room.sum}</p>
                        </div>
                        <div className={styles.stat}>
                            <img className={styles.statIcon} src={user} alt="Message icon"/>
                            <p className={styles.counter}>{room.users.length}</p>
                        </div>
                    </div>
                </div>
            </div>
            {pickerVisible ?
                <div className={styles.innerWrapper}>
                    <div className={styles.fullHeight}></div>
                    <div className={styles.popOver}>
                        <div className={styles.cover} onClick={() => {
                            setPickerVisible(!pickerVisible);
                        }}/>
                        <TwitterPicker onChangeComplete={(color) => sendColor(color.hex)}/>
                    </div>
                </div> : null}
        </>
    )
};


export default Item;