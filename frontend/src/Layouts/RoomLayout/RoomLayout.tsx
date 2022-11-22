import React from 'react';
import {useSelector} from "react-redux";
import {LeftTabs, RightTabs} from "../../Reducers/General";
import LogTab from "../../Components/Tabs/LogTab/LogTab";
import RoomTabMinimal from "../../Components/Tabs/RoomTabMinimal/RoomTabMinimal";
import BaseLayout from "../BaseLayout/BaseLayout";
import styles from "./RoomLayout.module.scss";
import MessageTab from "../../Components/Tabs/MessageTab/MessageTab";
import DrawingTab from "../../Components/Tabs/DrawingTab/DrawingTab";
import {RoomModel} from "../../Models/Room.model";
import Announcement from "../../Components/Misc/Announcement/Announcement";
import {Animations} from "../../Components/Misc/Ghost/Ghost";
import {Strings} from "../../strings";
import {useNavigate} from "react-router-dom";
import {RouterPaths} from "../../router";

const RoomLayout = () => {
    // Get selected tabs from the state
    const {leftTab, rightTab} = useSelector((state: any) => state.general);
    let leftTabElement, rightTabElement;

    // Decide what tabs to render
    switch (leftTab) {
        case LeftTabs.Log:
            leftTabElement = <LogTab/>;
            break;
        case LeftTabs.Rooms:
            leftTabElement = <RoomTabMinimal/>
    }
    switch (rightTab) {
        case RightTabs.Messages:
            rightTabElement = <MessageTab/>;
            break;
        case RightTabs.Drawing:
            rightTabElement = <DrawingTab/>;
            break;
    }

    // Get the current room from the state
    // If no room is selected,
    // the corresponding notification will be shown
    const currentRoom: RoomModel = useSelector(
        (state: any) => state.room.current
    );

    // Get navigation
    const navigate = useNavigate();

    return (
        <BaseLayout>
            <div className={styles.layout}>
                <div className={styles.leftTab}>
                    {leftTabElement}
                </div>
                <div className={styles.rightTab}>
                    {currentRoom ?
                        rightTabElement :
                        <Announcement
                            animation={Animations.Shake}
                            text={Strings.NoRoomSelected}
                            description={Strings.GoBack}
                            onClick={() => {
                                navigate(RouterPaths.HomePage)
                            }}
                        />
                    }
                </div>
            </div>
        </BaseLayout>
    );
};

export default RoomLayout;