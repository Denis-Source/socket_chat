import React from "react";
import styles from "./LogTab.module.scss";
import List from "../../Log/List/List";
import { useSelector } from "react-redux";
import { Strings } from "../../../strings";
import { RoomModel } from "../../../Models/Room.model";
import SetRoomTabButton from "../../Buttons/FuncButtons/SetRoomTabButton";
import { motion } from "framer-motion";

const LogTab = () => {
    // Get the current room from the state
    const currentRoom: RoomModel = useSelector(
        (state: any) => state.room.current
    );

    return (
        <motion.div
            layout
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.wrapper}
        >
            <div className={styles.header}>
                <h3 className={styles.heading}>{Strings.LogsHeading}</h3>
                {currentRoom && <SetRoomTabButton />}
            </div>
            <List />
        </motion.div>
    );
};

export default LogTab;
