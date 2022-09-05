import React from "react";
import { RoomModel } from "../../../Models/Room.model";
import styles from "./RoomColorPicker.module.scss";
import { TwitterPicker } from "react-color";
import { prepareStatement, WSS_FEED_URL } from "../../../api";
import { TypeStatements } from "../../../StatementsTypes/TypeStatements";
import { RoomStatements } from "../../../StatementsTypes/RoomStatements";
import useWebSocket from "react-use-websocket";

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
            <TwitterPicker onChangeComplete={(color) => sendColor(color.hex)} />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default RoomColorPicker;
