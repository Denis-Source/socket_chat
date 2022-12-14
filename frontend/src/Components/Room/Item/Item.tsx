import React, { useState } from "react";
import { RoomModel } from "../../../Models/Room.model";
import useWebSocket from "react-use-websocket";
import { prepareStatement, WSS_FEED_URL } from "../../../api";
import { RoomStatements } from "../../../StatementsTypes/RoomStatements";
import styles from "./Item.module.scss";
import cross from "../../../Static/Images/cross.svg";
import message from "../../../Static/Images/message.svg";
import user from "../../../Static/Images/user.svg";
import { TypeStatements } from "../../../StatementsTypes/TypeStatements";
import MutableName, { Alignment } from "../../MutableName/MutableName";
import RoomColorPicker from "../../ColorPicker/RoomColorPicker/RoomColorPicker";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { RouterPaths } from "../../../router";

const Item = ({ room }: { room: RoomModel }) => {
    // Configure websocket connection
    const { sendJsonMessage } = useWebSocket(WSS_FEED_URL, {
        share: true,
    });

    // Use state to show picker
    const [pickerVisible, setPickerVisible] = useState<boolean>(false);

    // Use dispatch to call state changes
    const navigate = useNavigate();

    // Function to delete the room
    const sendDelete = async (event: React.MouseEvent) => {
        // Stop propagation as the listener is inside another one
        event.stopPropagation();
        const statement = prepareStatement({
            type: TypeStatements.Call,
            message: RoomStatements.DeleteRoom,
            uuid: room.uuid,
        });
        await sendJsonMessage(statement);
    };

    return (
        <motion.div
            layout
            animate={{ opacity: 1 }}
            initial={{ opacity: 0.2 }}
            transition={{ duration: 0.2 }}
            className={styles.layout}
        >
            <div
                className={styles.item}
                onClick={() => navigate(`${RouterPaths.Rooms}/${room.uuid}`)}
            >
                <div className={styles.header}>
                    <MutableName room={room} alignment={Alignment.left} />
                    <button
                        className={styles.closeButton}
                        onClick={(event) => sendDelete(event)}
                    >
                        <img src={cross} alt="Cross icon" />
                    </button>
                </div>
                <div className={styles.footer}>
                    <div
                        className={styles.colorIcon}
                        style={{ backgroundColor: `${room.color}aa` }}
                        onClick={(event) => {
                            event.stopPropagation();
                            setPickerVisible(!pickerVisible);
                        }}
                    ></div>
                    <div className={styles.info}>
                        <div className={styles.stat}>
                            <img
                                className={styles.statIcon}
                                src={message}
                                alt="Message icon"
                            />
                            <p className={styles.counter}>{room.sum}</p>
                        </div>
                        <div className={styles.stat}>
                            <img
                                className={styles.statIcon}
                                src={user}
                                alt="Message icon"
                            />
                            <p className={styles.counter}>
                                {room.users.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <RoomColorPicker
                room={room}
                pickerVisible={pickerVisible}
                setPickerVisible={setPickerVisible}
            />
        </motion.div>
    );
};

export default Item;
