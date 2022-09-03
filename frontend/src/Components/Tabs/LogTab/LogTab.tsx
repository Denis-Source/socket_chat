import React from 'react';
import styles from "./LogTab.module.scss"
import List from "../../Log/List/List";
import {LeftTabs, setLeftTab} from "../../../Reducers/General";
import roomList from "../../../Static/Images/room_list.svg";
import {useDispatch, useSelector} from "react-redux";
import {Strings} from "../../../strings";
import {RoomModel} from "../../../Models/Room.model";

const LogTab = () => {
    // Get the current room from the state
    const currentRoom: RoomModel = useSelector((state: any) => state.room.current);

    // Use dispatch to change the current left tab
    const dispatch = useDispatch();

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h3 className={styles.heading}>{Strings.LogsHeading}</h3>{
                currentRoom &&
                <button className={styles.button} onClick={() => dispatch(setLeftTab(LeftTabs.Rooms))}>
                    <img className={styles.buttonIcon} src={roomList} alt="Add icon"/>
                </button>
            }
            </div>
            <List/>
        </div>
    );
};

export default LogTab;