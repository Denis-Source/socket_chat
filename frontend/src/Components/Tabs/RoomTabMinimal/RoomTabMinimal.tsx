import React, { useState } from "react";
import List from "../../Room/List/List";
import Input from "../../Input/Input";
import styles from "./RoomTabMinimal.module.scss";
import { Strings } from "../../../strings";
import SetLogTabButton from "../../Buttons/FuncButtons/SetLogTabButton";
import { motion } from "framer-motion";

const RoomTabMinimal = () => {
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
                <Input
                    setString={setFilterString}
                    placeholder={Strings.SearchPlaceholder}
                />
                <SetLogTabButton />
            </div>
            <List filterString={filterString} />
        </motion.div>
    );
};

export default RoomTabMinimal;
