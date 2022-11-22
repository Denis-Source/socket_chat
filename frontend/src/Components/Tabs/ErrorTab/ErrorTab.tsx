import React from "react";
import styles from "./ErrorTab.module.scss";
import Announcement from "../../Misc/Announcement/Announcement";
import {Animations} from "../../Misc/Ghost/Ghost";
import {ErrorMessages} from "../../../Reducers/General";
import {useSelector} from "react-redux";

const ErrorTab = ({message, description, onClick}:
                      { message?: ErrorMessages | string, description?: string, onClick?: () => void }) => {
    // Get the error message from the state
    const errorMessage: string = useSelector(
        (state: any) => state.general.errorMessage
    );

    return (
        <div className={styles.wrapper}>
            <Announcement
                animation={Animations.Shake}
                text={message ?? errorMessage}
                description={description}
                onClick={onClick}
            />
        </div>
    );
};

export default ErrorTab;
