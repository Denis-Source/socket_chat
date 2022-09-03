import React, {useRef} from 'react';
import useWebSocket from "react-use-websocket";
import {WSS_FEED_URL} from "../../../api";
import {MessageStatements} from "../../../StatementsTypes/MessageStatements";
import styles from "./Form.module.scss"
import {Strings} from "../../../strings";

const Form = () => {
    const {sendJsonMessage} = useWebSocket(WSS_FEED_URL, {
        share: true
    });

    const textArea = useRef(null) as any;

    const sendMessage = async (event: React.FormEvent<HTMLFormElement> | null) => {
        event?.preventDefault();
        if (textArea.current) {
            await sendJsonMessage({
                type: "call",
                payload: {
                    message: MessageStatements.CreateMessage,
                    body: textArea.current.value,
                }
            })
            textArea.current.value = "";
        }
    }

    const onEnterPress = async (event: any) => {
        if(event.keyCode == 13 && event.shiftKey == false) {
            event.preventDefault();
            await sendMessage(event)
        }
    }

    return (
        <div className={styles.formWrapper}>
            <form className={styles.form}  onSubmit={(event) => sendMessage(event)}>
                <textarea className={styles.textArea} placeholder={Strings.FormMessagePlaceholder} ref={textArea} rows={5}
                          onKeyDown={(event) => onEnterPress(event)}/>
                <input className={styles.submit} value={Strings.FormSubmit} type="submit"/>
            </form>
        </div>
    );
};

export default Form;