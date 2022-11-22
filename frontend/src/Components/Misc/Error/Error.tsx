import React from 'react';
import Ghost, {Animations} from "../Ghost/Ghost";
import styles from "./Error.module.scss"
import {Strings} from "../../../strings";
import {UserModel} from "../../../Models/User.model";
import {useSelector} from "react-redux";
import {ErrorMessages} from "../../../Reducers/General";

const Error = () => {
    // Get the error message from the state
    const errorMessage: ErrorMessages = useSelector((state: any) => state.general.errorMessage);

    return (
        <div
            className={styles.wrapper}
            onClick={() => window.location.reload()}>
            <Ghost animation={Animations.Shake}/>
            <p className={styles.desc}>{errorMessage}</p>
            <div className={styles.refreshWrapper}>
                <p className={styles.refreshDesc}>{Strings.ErrorRefresh}</p>
            </div>
        </div>
    );
};

export default Error;