import React, { useState } from "react";
import List from "../../Room/List/List";
import Input from "../../Input/Input";
import styles from "./RoomTab.module.scss";
import { Strings } from "../../../strings";
import { motion } from "framer-motion";

const RoomTab = () => {
    // Use state to filter rooms with the input field
    const [filterString, setFilterString] = useState("");

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
                <h2 className={styles.heading}>{Strings.ListRoomHeader}</h2>
                <Input
                    setString={setFilterString}
                    placeholder={Strings.SearchPlaceholder}
                />
            </div>
            <List filterString={filterString} />
        </motion.div>
    );
};

export default RoomTab;
