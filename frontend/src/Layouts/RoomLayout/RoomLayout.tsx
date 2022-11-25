import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LeftTabs, RightTabs } from "../../Reducers/General";
import LogTab from "../../Components/Tabs/LogTab/LogTab";
import RoomTabMinimal from "../../Components/Tabs/RoomTabMinimal/RoomTabMinimal";
import BaseLayout from "../BaseLayout/BaseLayout";
import styles from "./RoomLayout.module.scss";
import MessageTab from "../../Components/Tabs/MessageTab/MessageTab";
import DrawingTab from "../../Components/Tabs/DrawingTab/DrawingTab";
import { RoomModel } from "../../Models/Room.model";
import Announcement from "../../Components/Misc/Announcement/Announcement";
import { Animations } from "../../Components/Misc/Ghost/Ghost";
import { Strings } from "../../strings";
import { useNavigate, useParams } from "react-router-dom";
import { RouterPaths } from "../../router";
import UserListTab from "../../Components/Tabs/UserListTab/UserListTab";
import useWebSocket from "react-use-websocket";
import { prepareStatement, WSS_FEED_URL } from "../../api";
import { enterRoom } from "../../Reducers/Room";
import { TypeStatements } from "../../StatementsTypes/TypeStatements";
import { RoomStatements } from "../../StatementsTypes/RoomStatements";
import Spinner from "../../Components/Spinner/Spinner";

const RoomLayout = () => {
    // Get selected tabs from the state
    const { leftTab, rightTab } = useSelector((state: any) => state.general);
    const rooms: RoomModel[] = useSelector((state: any) => state.room.list);
    const currentRoom: RoomModel = useSelector(
        (state: any) => state.room.current
    );
    const entered: boolean = useSelector((state: any) => state.room.entered);
    let leftTabElement, rightTabElement;

    // To send selected room
    // Use dispatch to call state changes
    const dispatch = useDispatch();

    const { sendJsonMessage } = useWebSocket(WSS_FEED_URL, {
        share: true,
    });
    // Decide what tabs to render
    switch (leftTab) {
        case LeftTabs.Log:
            leftTabElement = <LogTab />;
            break;
        case LeftTabs.Rooms:
            leftTabElement = <RoomTabMinimal />;
    }
    switch (rightTab) {
        case RightTabs.Drawing:
            rightTabElement = <DrawingTab />;
            break;
        case RightTabs.UserList:
            rightTabElement = <UserListTab />;
            break;
        default:
            rightTabElement = <MessageTab />;
            break;
    }

    const { roomUuid } = useParams();

    useEffect(() => {
        const sendEnter = async (selectedRoom: RoomModel) => {
            // Send the corresponding message to the server
            const statement = prepareStatement({
                type: TypeStatements.Call,
                message: RoomStatements.EnterRoom,
                uuid: selectedRoom.uuid,
            });
            await sendJsonMessage(statement);
        };
        const selectedRoom: RoomModel = rooms.filter(
            (room) => room.uuid === roomUuid
        )[0];
        dispatch(enterRoom(selectedRoom));
        if (currentRoom) {
            if (selectedRoom.uuid !== currentRoom.uuid) {
                sendEnter(selectedRoom).then();
            }
        }
        if (!currentRoom && selectedRoom) {
            sendEnter(selectedRoom).then();
        }
    }, [roomUuid, rooms, currentRoom, sendJsonMessage]);

    // Get navigation
    const navigate = useNavigate();

    return (
        <BaseLayout>
            <div className={styles.layout}>
                <div className={styles.leftTab}>{leftTabElement}</div>
                <div className={styles.rightTab}>
                    {currentRoom ? (
                        entered ? (
                            rightTabElement
                        ) : (
                            <Spinner />
                        )
                    ) : (
                        <Announcement
                            animation={Animations.Shake}
                            text={Strings.RoomDoesNotExist}
                            description={Strings.GoBack}
                            onClick={() => {
                                navigate(RouterPaths.HomePage);
                            }}
                        />
                    )}
                </div>
            </div>
        </BaseLayout>
    );
};

export default RoomLayout;
