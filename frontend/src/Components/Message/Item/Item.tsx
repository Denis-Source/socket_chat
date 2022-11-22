import React from "react";
import { MessageModel } from "../../../Models/Message.model";
import styles from "./Item.module.scss";
import { motion } from "framer-motion";

const Item = ({
    message,
    isMine,
}: {
    message: MessageModel;
    isMine: boolean;
}) => {
    return (
        <motion.div
            layout
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={isMine ? styles.myMessage : styles.otherMessage}
        >
            <p className={styles.body}>{message.body}</p>
            <p className={styles.user}>{message.user.name}</p>
            <p className={styles.date}>{convertTime(message.created)}</p>
        </motion.div>
    );
};

const convertTime = (timeStr: string) => {
    /*
    Converts the provided UTC time string to the local one
    Shows date if the message sent yesterday or earlier
     */
    const DAY_OFFSET = 24 * 60 * 60;

    const messageDate = new Date(timeStr);
    const now = new Date();
    return messageDate.getDate() > now.getTime() + DAY_OFFSET
        ? messageDate.toLocaleString()
        : messageDate.toLocaleTimeString();
};

export default Item;
