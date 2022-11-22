import React from 'react';
import Ghost, {Animations} from "../../Misc/Ghost/Ghost";
import styles from "./Absent.module.scss"
import {Strings} from "../../../strings";

const Absent = () => {
    return (
        <div
            className={styles.absent}>
            <Ghost animation={Animations.Wobble}/>
            <p className={styles.desc}>
                {Strings.noMessages}
            </p>
        </div>
    );
};

export default Absent;