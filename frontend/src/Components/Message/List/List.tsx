import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MessageModel } from "../../../Models/Message.model";
import Item from "../Item/Item";
import { UserModel } from "../../../Models/User.model";

import styles from "./List.module.scss";
import ScrollToBottom from "react-scroll-to-bottom";
import useSound from "use-sound";
import { setNew } from "../../../Reducers/Message";
import Spinner from "../../Spinner/Spinner";
import { ViewportList } from "react-viewport-list";
import Announcement from "../../Misc/Announcement/Announcement";
import { Animations } from "../../Misc/Ghost/Ghost";
import { Strings } from "../../../strings";

const notificationOther = require("../../../Static/Sound/messageOther.mp3");
const notificationMine = require("../../../Static/Sound/messageMine.mp3");

const List = () => {
    // Get message list from the state
    const messages: MessageModel[] = useSelector(
        (state: any) => state.message.list
    );

    // Get dispatch for new message handling
    const dispatch = useDispatch();

    // Get user from the state
    const user: UserModel = useSelector((state: any) => state.user.user);

    // Use sound for notification
    const toNotify: boolean = useSelector((state: any) => state.message.isNew);
    const [playOther] = useSound(notificationOther);
    const [playMine] = useSound(notificationMine);

    useEffect(() => {
        if (toNotify) {
            messages[messages.length - 1].user.uuid === user.uuid
                ? playMine()
                : playOther();
            dispatch(setNew());
        }
    });

    return (
        <>
            {messages ? (
                <ScrollToBottom
                    initialScrollBehavior={"auto"}
                    className={styles.wrapper}
                    followButtonClassName={styles.scrollButton}
                >
                    <div className={styles.messages}>
                        {messages.length === 0 ? (
                            <Announcement
                                animation={Animations.Wobble}
                                text={Strings.NoMessages}
                            />
                        ) : (
                            <ViewportList items={messages}>
                                {(item) => (
                                    <Item
                                        key={item.uuid}
                                        message={item}
                                        isMine={item.user.uuid === user.uuid}
                                    />
                                )}
                            </ViewportList>
                        )}
                    </div>
                </ScrollToBottom>
            ) : (
                <div className={styles.spinnerWrapper}>
                    <Spinner />
                </div>
            )}
        </>
    );
};

export default List;
