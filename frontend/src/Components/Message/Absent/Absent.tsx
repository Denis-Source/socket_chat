import React from 'react';
import Ghost from "../../Misc/Ghost/Ghost";
import styles from "./Absent.module.scss"
import {Strings} from "../../../strings";

const Absent = () => {
    return (
        <div className={styles.absent}>
            <Ghost/>
            <p className={styles.desc}>
                {Strings.NO_MESSAGES}
            </p>
        </div>
    );
};

export default Absent;