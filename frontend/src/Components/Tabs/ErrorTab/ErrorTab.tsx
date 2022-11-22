import React from 'react';
import Error from "../../Misc/Error/Error";
import {Strings} from "../../../strings";
import styles from "./ErrorTab.module.scss"

const ErrorTab = () => {
    return (
        <div className={styles.wrapper}>
            <Error/>
        </div>
    );
};

export default ErrorTab;