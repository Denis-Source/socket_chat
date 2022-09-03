import React from "react";
import styles from "./Item.module.scss";
import { LogModel } from "../../../Models/Log.model";

const Item = ({ log }: { log: LogModel }) => {
  return (
    <div className={styles.item}>
      <p className={styles.time}>{log.time}</p>
      <p className={styles.origin}>{log.origin}</p>
      <p className={styles.type}>{log.type}</p>
      <p className={styles.description}>{log.description}</p>
    </div>
  );
};

export default Item;
