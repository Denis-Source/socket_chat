import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LogTab from "../../Components/Tabs/LogTab/LogTab";
import styles from "./HomePage.module.scss";
import RoomTab from "../../Components/Tabs/RoomTab/RoomTab";
import BaseLayout from "../BaseLayout/BaseLayout";
import useWebSocket from "react-use-websocket";
import { prepareStatement, WSS_FEED_URL } from "../../api";
import { clearMessages, resetMessages } from "../../Reducers/Message";
import { RightTabs, setRightTab } from "../../Reducers/General";
import { TypeStatements } from "../../StatementsTypes/TypeStatements";
import { RoomStatements } from "../../StatementsTypes/RoomStatements";
import { RoomModel } from "../../Models/Room.model";

const HomePageLayout = () => {
    // Configure websocket connection
    const { sendJsonMessage } = useWebSocket(WSS_FEED_URL, {
        share: true,
    });

    // Get dispatch for working with the state
    const dispatch = useDispatch();
    const currentRoom: RoomModel = useSelector(
        (state: any) => state.room.current
    );

    // Leave from room if one has been entered
    useEffect(() => {
        const leave = async () => {
            // Clear message history
            dispatch(clearMessages());
            // Switch the left tab to room selection
            dispatch(setRightTab(RightTabs.Rooms));
            // Clear the messages
            dispatch(resetMessages());
            // Switch the right tab if the room list is selected
            const statements = prepareStatement({
                type: TypeStatements.Call,
                message: RoomStatements.LeaveRoom,
            });
            await sendJsonMessage(statements);
        };
        if (currentRoom) {
            leave().then();
        }
    }, [currentRoom, dispatch, sendJsonMessage]);

    // Decide what left tab to display
    const { leftTab } = useSelector((state: any) => state.general);
    let leftTabElement;

    switch (leftTab) {
        default:
            leftTabElement = <LogTab />;
            break;
    }

    return (
        <BaseLayout>
            <div className={styles.layout}>
                <div className={styles.leftTab}>{leftTabElement}</div>
                <div className={styles.rightTab}>
                    <RoomTab />
                </div>
            </div>
        </BaseLayout>
    );
};

export default HomePageLayout;
