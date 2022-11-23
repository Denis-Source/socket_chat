import React from 'react';
import styles from "../MessageTab/MessageTab.module.scss";
import GoBackButton from "../../Buttons/FuncButtons/GoBackButton";
import SetDrawingTabButton from "../../Buttons/FuncButtons/SetDrawingTab";
import SetMessageTabButton from "../../Buttons/FuncButtons/SetMessageTabButton";
import List from "../../User/List/List";
import {useSelector} from "react-redux";
import {RoomModel} from "../../../Models/Room.model";
import {UserModel} from "../../../Models/User.model";
import {Strings} from "../../../strings";
import MutableName, {Alignment} from "../../MutableName/MutableName";

const UserListTab = () => {
    // Get current room from the state
    const currentRoom: RoomModel = useSelector((state: any) => state.room.current);

    return (
        <>
            <div className={styles.header}>
                <div className={styles.navigation}>
                    <GoBackButton/>
                    <SetMessageTabButton/>
                    <SetDrawingTabButton/>
                </div>
                <div className={styles.nameWrapper}>
                    <p className={styles.hint}>{Strings.MessageTabRoom}</p>
                    <MutableName
                        room={currentRoom}
                        alignment={Alignment.right}
                    />
                </div>
            </div>
            <List/>
        </>
    );
};

export default UserListTab;