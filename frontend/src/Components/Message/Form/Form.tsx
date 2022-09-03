import React, { useRef } from "react";
import useWebSocket from "react-use-websocket";
import { prepareStatement, WSS_FEED_URL } from "../../../api";
import styles from "./Form.module.scss";
import { Strings } from "../../../strings";
import { TypeStatements } from "../../../StatementsTypes/TypeStatements";
import { MessageStatements } from "../../../StatementsTypes/MessageStatements";

const Form = () => {
  // Configure websocket connection
  const { sendJsonMessage } = useWebSocket(WSS_FEED_URL, {
    share: true,
  });

  // Use ref to take control over the text area
  const textArea = useRef(null) as any;

  // Function to send message
  const sendMessage = async (
    event: React.FormEvent<HTMLFormElement> | null
  ) => {
    event?.preventDefault();

    if (textArea.current) {
      const statement = prepareStatement({
        type: TypeStatements.Call,
        message: MessageStatements.CreateMessage,
        body: textArea.current.value,
      });
      await sendJsonMessage(statement);
      textArea.current.value = "";
    }
  };

  // Function to process key presses
  const onEnterPress = async (event: any) => {
    if (event.keyCode == 13 && event.shiftKey == false) {
      event.preventDefault();
      await sendMessage(event);
    }
  };

  return (
    <form className={styles.form} onSubmit={(event) => sendMessage(event)}>
      <textarea
        className={styles.textArea}
        placeholder={Strings.FormMessagePlaceholder}
        ref={textArea}
        rows={5}
        onKeyDown={(event) => onEnterPress(event)}
      />
      <input
        className={styles.submit}
        value={Strings.FormSubmit}
        type="submit"
      />
    </form>
  );
};

export default Form;
