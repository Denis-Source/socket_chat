import React from "react";
import Ghost, { Animations } from "../Ghost/Ghost";
import styles from "./Announcement.module.scss";
import { ErrorMessages } from "../../../Reducers/General";

const Announcement = ({
    animation,
    text,
    description,
    onClick,
}: {
    animation: Animations;
    text?: string | ErrorMessages;
    description?: string;
    onClick?: () => void;
}) => {
    return (
        <div className={styles.wrapper} onClick={onClick}>
            <Ghost animation={animation} />
            <p className={styles.desc}>{text}</p>
            {description && (
                <div className={styles.refreshWrapper}>
                    <p className={styles.refreshDesc}>{description}</p>
                </div>
            )}
        </div>
    );
};

export default Announcement;
