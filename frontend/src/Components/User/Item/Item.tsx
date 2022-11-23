import React from "react";
import { UserModel } from "../../../Models/User.model";
import styles from "./Item.module.scss";
import { motion } from "framer-motion";

const Item = ({ user, isMe }: { user: UserModel; isMe: boolean }) => {
    return (
        <motion.div
            layout
            animate={{ opacity: 1 }}
            initial={{ opacity: 0.2 }}
            transition={{ duration: 0.2 }}
            className={isMe ? styles.userMe : styles.user}
        >
            <p className={styles.name}>{user.name}</p>
            <p className={styles.uuid}>{user.uuid}</p>
        </motion.div>
    );
};

export default Item;
