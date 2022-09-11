import React from "react";
import styles from "./Item.module.scss";
import {LogModel} from "../../../Models/Log.model";

const Item = ({log, last}: { log: LogModel, last: boolean }) => {
    return (
        <div className={last ? styles.lastItem : styles.item}>
            <p className={styles.time}>{log.time}</p>
            <p className={styles.origin}>{log.origin}</p>
            <p className={styles.type}>{log.type}</p>
            <p className={styles.description}>{log.description}</p>
        </div>
    );
};

export default Item;
