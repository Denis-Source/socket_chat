import React from "react";
import addIcon from "../../../Static/Images/add.svg";
import BaseButton from "../BaseButton/BaseButton";
import { Strings } from "../../../strings";
import { prepareStatement, WSS_FEED_URL } from "../../../api";
import { TypeStatements } from "../../../StatementsTypes/TypeStatements";
import { RoomStatements } from "../../../StatementsTypes/RoomStatements";
import useWebSocket from "react-use-websocket";

const CreateRoomButton = () => {
    // Configure websocket connection
    const { sendJsonMessage } = useWebSocket(WSS_FEED_URL, {
        share: true,
    });

    // Function to create a new room
    const create = async () => {
        const statement = prepareStatement({
            type: TypeStatements.Call,
            message: RoomStatements.CreateRoom,
        });
        await sendJsonMessage(statement);
    };

    return (
        <BaseButton
            img={addIcon}
            imgDesc={Strings.AddRoomButtonDesc}
            callback={create}
        />
    );
};

export default CreateRoomButton;
