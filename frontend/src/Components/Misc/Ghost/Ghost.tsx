import React from 'react';
import styles from "./Ghost.module.scss"
import ghostIcon from "../../../Static/Images/ghost.svg"
import {Strings} from "../../../strings";

const Ghost = () => {
    return (
        <div className={styles.ghost}>
            <img
                className={styles.icon}
                src={ghostIcon}
                alt={Strings.GHOST_DESC}
            />
        </div>
    );
};

export default Ghost;