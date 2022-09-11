import React from "react";
import BaseButton from "../BaseButton/BaseButton";
import backImage from "../../../Static/Images/back.svg";
import { Strings } from "../../../strings";
import {
    LeftTabs,
    RightTabs,
    setLeftTab,
    setRightTab,
} from "../../../Reducers/General";
import { useDispatch, useSelector } from "react-redux";
import { clearMessages, resetMessages } from "../../../Reducers/Message";
import { prepareStatement, WSS_FEED_URL } from "../../../api";
import { TypeStatements } from "../../../StatementsTypes/TypeStatements";
import { RoomStatements } from "../../../StatementsTypes/RoomStatements";
import useWebSocket from "react-use-websocket";

const GoBackButton = () => {
    // Configure websocket connection
    const { sendJsonMessage } = useWebSocket(WSS_FEED_URL, {
        share: true,
    });

    // Get the current tab from the state to change it on leave
    // if the selected one is related to room selection
    const leftTab: LeftTabs = useSelector(
        (state: any) => state.general.leftTab
    );

    // use dispatch to set right tab to leave room and control tabs
    const dispatch = useDispatch();

    // Function to leave the entered room
    const leave = async () => {
        // Clear message history
        dispatch(clearMessages());
        // Switch the left tab to room selection
        dispatch(setRightTab(RightTabs.Rooms));
        // Clear the messages
        dispatch(resetMessages());
        // Switch the right tab if the room list is selected
        leftTab === LeftTabs.Rooms && dispatch(setLeftTab(LeftTabs.Log));
        const statements = prepareStatement({
            type: TypeStatements.Call,
            message: RoomStatements.LeaveRoom,
        });
        await sendJsonMessage(statements);
    };
    return (
        <BaseButton
            img={backImage}
            imgDesc={Strings.GoBackButtonDesc}
            callback={leave}
        />
    );
};

export default GoBackButton;
