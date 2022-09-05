import React from "react";
import Form from "../../Message/Form/Form";
import List from "../../Message/List/List";
import { Strings } from "../../../strings";
import styles from "./MessageTab.module.scss";
import { RoomModel } from "../../../Models/Room.model";
import { useSelector } from "react-redux";
import GoBackButton from "../../Buttons/FuncButtons/GoBackButton";
import SetDrawingTabButton from "../../Buttons/FuncButtons/SetDrawingTab";
import MutableName, { Alignment } from "../../MutableName/MutableName";

const MessageTab = () => {
    // Get the current tab from the state
    const currentRoom: RoomModel = useSelector(
        (state: any) => state.room.current
    );
    return (
        <div>
            <div className={styles.header}>
                <div className={styles.navigation}>
                    <GoBackButton />
                    <SetDrawingTabButton />
                </div>
                <div className={styles.nameWrapper}>
                    <p className={styles.hint}>{Strings.MessageTabRoom}</p>
                    <MutableName
                        room={currentRoom}
                        alignment={Alignment.right}
                    />
                </div>
            </div>
            <List />
            <Form />
        </div>
    );
};

export default MessageTab;
