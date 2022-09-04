import React, {useState} from 'react';
import Drawing from "../../Drawing/Drawing";
import styles from "./DrawingTab.module.scss";
import {LeftTabs, RightTabs, setLeftTab, setRightTab} from "../../../Reducers/General";
import {useDispatch, useSelector} from "react-redux";
import back from "../../../Static/Images/back.svg";
import {clearMessages} from "../../../Reducers/Message";
import {prepareStatement, WSS_FEED_URL} from "../../../api";
import {TypeStatements} from "../../../StatementsTypes/TypeStatements";
import {RoomStatements} from "../../../StatementsTypes/RoomStatements";
import useWebSocket from "react-use-websocket";
import messageTab from "../../../Static/Images/messageTab.svg"
import {Strings} from "../../../strings";
import {RoomModel} from "../../../Models/Room.model";

const DrawingTab = () => {
    const dispatch = useDispatch();
    // Configure websocket connection
    const {sendJsonMessage} = useWebSocket(WSS_FEED_URL, {
        share: true,
    });

    const currentRoom: RoomModel = useSelector(
        (state: any) => state.room.current
    );

    const sendUpdate = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setEnteredName(event.target.value);
        const statements = prepareStatement({
            type: TypeStatements.Call,
            message: RoomStatements.ChangeRoomName,
            uuid: currentRoom?.uuid,
            name: event.target.value,
        });
        await sendJsonMessage(statements);
    };


    const leftTab: LeftTabs = useSelector((state: any) => state.general.leftTab);

    // Function to leave the entered room
    const sendLeave = async () => {
        // Clear message history
        dispatch(clearMessages());
        // Switch the left tab to room selection
        dispatch(setRightTab(RightTabs.Rooms));
        // Switch the right tab if the room list is selected
        leftTab === LeftTabs.Rooms && dispatch(setLeftTab(LeftTabs.Log));
        const statement = prepareStatement({
            type: TypeStatements.Call,
            message: RoomStatements.LeaveRoom,
        });
        await sendJsonMessage(statement);
    };

    const [focus, setFocus] = useState<boolean>(false);
    const [enteredName, setEnteredName] = useState<string>(currentRoom?.name);
    // If the input is selected, avoid changes
    if (!focus && enteredName !== currentRoom?.name) {
        setEnteredName(currentRoom?.name);
    }


    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div className={styles.navigation}>
                    <button className={styles.button} onClick={() => sendLeave()}>
                        <img className={styles.buttonIcon} src={back} alt="Add icon" />
                    </button>
                    <button
                        className={styles.button}
                        onClick={() => dispatch(setRightTab(RightTabs.Messages))}
                    >
                        <img className={styles.buttonIcon} src={messageTab} alt="Add icon"/>
                    </button>
                </div>
                <div className={styles.nameWrapper}>
                    <p className={styles.hint}>{Strings.MessageTabRoom}</p>
                    <input
                        className={styles.name}
                        value={enteredName}
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                        onFocus={() => {
                            setFocus(true);
                        }}
                        onBlur={() => {
                            setFocus(false);
                        }}
                        onChange={(event) => sendUpdate(event)}
                    />
                </div>
            </div>
            <Drawing/>
        </div>
    );
};

export default DrawingTab;