import React, { useState } from "react";
import { UserModel } from "../../../Models/User.model";
import { useSelector } from "react-redux";
import useWebSocket from "react-use-websocket";
import { prepareStatement, WSS_FEED_URL } from "../../../api";
import { UserStatements } from "../../../StatementsTypes/UserStatements";
import styles from "./UserName.module.scss";
import { Strings } from "../../../strings";
import { TypeStatements } from "../../../StatementsTypes/TypeStatements";

const UserName = () => {
  // Configure websocket connection
  const { sendJsonMessage } = useWebSocket(WSS_FEED_URL, {
    share: true,
  });

  // Get user model from the store
  const user: UserModel = useSelector((state: any) => state.user.user);

  // Use states to properly handle form changes
  const [focus, setFocus] = useState<boolean>(false);
  const [enteredName, setEnteredName] = useState<string>(user?.name);

  // If the input is selected, avoid changes
  if (!focus && enteredName !== user?.name) {
    setEnteredName(user?.name);
  }

  // Function to update user name
  const sendChanges = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredName(event.target.value);
    const statement = prepareStatement({
      type: TypeStatements.Call,
      message: UserStatements.ChangeUserName,
      uuid: user.uuid,
      name: event.target.value,
    });
    await sendJsonMessage(statement);
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.hint}>{Strings.UserLoggedAs}</p>
      <label className={styles.name}>
        <p className={styles.nameLabel}>{Strings.UserNameLabel}</p>
        <input
          className={styles.nameInput}
          value={enteredName}
          onFocus={() => {
            setFocus(true);
          }}
          onBlur={() => {
            setFocus(false);
          }}
          onChange={(event) => sendChanges(event)}
        />
      </label>
    </div>
  );
};

export default UserName;
