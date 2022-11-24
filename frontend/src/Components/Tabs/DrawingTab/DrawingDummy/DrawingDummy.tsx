import React from "react";
import { Strings } from "../../../../strings";
import dummyIcon from "../../../../Static/Images/dummy.svg";
import styles from "./DrawingDummy.module.scss";

const DrawingDummy = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.iconWrapper}>
                <img
                    className={styles.icon}
                    src={dummyIcon}
                    alt={Strings.DrawingDummy}
                />
            </div>
            <p className={styles.text}>{Strings.DrawingDummy}</p>
        </div>
    );
};

export default DrawingDummy;
