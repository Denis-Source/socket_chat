import React, { useState } from "react";
import styles from "./MutableName.module.scss";
import { RoomModel } from "../../Models/Room.model";
import { prepareStatement, WSS_FEED_URL } from "../../api";
import { TypeStatements } from "../../StatementsTypes/TypeStatements";
import { RoomStatements } from "../../StatementsTypes/RoomStatements";
import useWebSocket from "react-use-websocket";

export enum Alignment {
  left,
  right,
}

const MutableName = ({
  room,
  alignment,
}: {
  room: RoomModel;
  alignment: Alignment;
}) => {
  // Configure websocket connection
  const { sendJsonMessage } = useWebSocket(WSS_FEED_URL, {
    share: true,
  });

  const [focus, setFocus] = useState<boolean>(false);
  const [enteredName, setEnteredName] = useState<string>(room.name);
  // If the input is selected, avoid changes
  if (!focus && enteredName !== room.name) {
    setEnteredName(room.name);
  }

  // Function to update a room name
  const sendUpdate = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredName(event.target.value);
    const statement = prepareStatement({
      type: TypeStatements.Call,
      message: RoomStatements.ChangeRoomName,
      uuid: room.uuid,
      name: event.target.value,
    });
    await sendJsonMessage(statement);
  };

  return (
    <input
      className={
        alignment === Alignment.right ? styles.nameRight : styles.nameLeft
      }
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
  );
};

export default MutableName;
