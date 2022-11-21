import React from "react";
import { RoomModel } from "../../../Models/Room.model";
import styles from "./RoomColorPicker.module.scss";
import { prepareStatement, WSS_FEED_URL } from "../../../api";
import { TypeStatements } from "../../../StatementsTypes/TypeStatements";
import { RoomStatements } from "../../../StatementsTypes/RoomStatements";
import useWebSocket from "react-use-websocket";
import { roomColors } from "./RoomColors";

const RoomColorPicker = ({
    room,
    pickerVisible,
    setPickerVisible,
}: {
    room: RoomModel;
    pickerVisible: boolean;
    setPickerVisible: (arg0: boolean) => void;
}) => {
    // Configure websocket connection
    const { sendJsonMessage } = useWebSocket(WSS_FEED_URL, {
        share: true,
    });

    //Function to send a selected color
    const sendColor = async (color: string) => {
        const statement = prepareStatement({
            type: TypeStatements.Call,
            message: RoomStatements.ChangeRoomColor,
            uuid: room.uuid,
            color: color,
        });
        await sendJsonMessage(statement);
    };

    return (
        <>
            {pickerVisible ? (
                <div className={styles.innerWrapper}>
                    <div className={styles.fullHeight}></div>
                    <div className={styles.popOver}>
                        <div
                            className={styles.cover}
                            onClick={() => {
                                setPickerVisible(!pickerVisible);
                            }}
                        />
                        <div className={styles.picker}>
                            <div className={styles.arrow} />
                            <div className={styles.body}>
                                {roomColors.map((item, count) => (
                                    <div
                                        style={{ backgroundColor: `${item}dd` }}
                                        className={styles.color}
                                        onClick={async () => {
                                            await sendColor(item);
                                            setPickerVisible(false);
                                        }}
                                        key={count}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default RoomColorPicker;
