import React, { useState } from "react";
import Form from "../../Message/Form/Form";
import List from "../../Message/List/List";
import { Strings } from "../../../strings";
import styles from "./MessageTab.module.scss";
import useWebSocket from "react-use-websocket";
import { prepareStatement, WSS_FEED_URL } from "../../../api";
import { RoomModel } from "../../../Models/Room.model";
import { useDispatch, useSelector } from "react-redux";
import { RoomStatements } from "../../../StatementsTypes/RoomStatements";
import {
  LeftTabs,
  RightTabs,
  setLeftTab,
  setRightTab,
} from "../../../Reducers/General";
import back from "../../../Static/Images/back.svg";
import { TypeStatements } from "../../../StatementsTypes/TypeStatements";
import { clearMessages } from "../../../Reducers/Message";
import drawing from "../../../Static/Images/drawing.svg";

const MessageTab = () => {
  // Configure websocket connection
  const { sendJsonMessage } = useWebSocket(WSS_FEED_URL, {
    share: true,
  });

  // Get the current tab from the state to change it on leave
  // if the selected one is related to room selection
  const leftTab: LeftTabs = useSelector((state: any) => state.general.leftTab);

  // Get the current tab from the state
  const currentRoom: RoomModel = useSelector(
    (state: any) => state.room.current
  );

  // Use dispatch to switch tabs
  const dispatch = useDispatch();

  // Use states to properly handle form changes
  const [focus, setFocus] = useState<boolean>(false);
  const [enteredName, setEnteredName] = useState<string>(currentRoom?.name);
  // If the input is selected, avoid changes
  if (!focus && enteredName !== currentRoom?.name) {
    setEnteredName(currentRoom?.name);
  }
  // Function to update the room name
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

  // Function to leave the entered room
  const sendLeave = async () => {
    // Clear message history
    dispatch(clearMessages());
    // Switch the left tab to room selection
    dispatch(setRightTab(RightTabs.Rooms));
    // Switch the right tab if the room list is selected
    leftTab === LeftTabs.Rooms && dispatch(setLeftTab(LeftTabs.Log));
    const statements = prepareStatement({
      type: TypeStatements.Call,
      message: RoomStatements.LeaveRoom,
    });
    await sendJsonMessage(statements);
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.navigation}>
          <button className={styles.button} onClick={() => sendLeave()}>
            <img className={styles.buttonIcon} src={back} alt="Add icon" />
          </button>
          <button
              className={styles.button}
              onClick={() => dispatch(setRightTab(RightTabs.Drawing))}
          >
            <img className={styles.buttonIcon} src={drawing} alt="Add icon"/>
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
      <List />
      <Form />
    </div>
  );
};

export default MessageTab;
